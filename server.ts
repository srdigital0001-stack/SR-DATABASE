import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("clientflow.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    notes TEXT,
    managed_by TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    service_type TEXT NOT NULL,
    price REAL DEFAULT 0,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    total_amount REAL DEFAULT 0,
    advance_paid REAL DEFAULT 0,
    remaining_balance REAL DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    title TEXT NOT NULL,
    assigned_to TEXT,
    due_date DATE,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    amount REAL NOT NULL,
    type TEXT DEFAULT 'payment',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );
`);

// Migration: Add assigned_to to tasks if it doesn't exist
try {
  db.prepare("SELECT assigned_to FROM tasks LIMIT 1").get();
} catch (e) {
  db.exec("ALTER TABLE tasks ADD COLUMN assigned_to TEXT");
}

try {
  db.prepare("SELECT notes FROM clients LIMIT 1").get();
} catch (e) {
  db.exec("ALTER TABLE clients ADD COLUMN notes TEXT");
}

try {
  db.prepare("SELECT managed_by FROM clients LIMIT 1").get();
} catch (e) {
  db.exec("ALTER TABLE clients ADD COLUMN managed_by TEXT");
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = Number(process.env.PORT) || 3000;

  // API Routes
  app.get("/api/health", (req, res) => {
    try {
      const clientCount = db.prepare("SELECT COUNT(*) as count FROM clients").get();
      res.json({ 
        status: "ok", 
        database: "connected", 
        clients: clientCount.count,
        env: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

  app.get("/api/stats", (req, res) => {
    try {
      const now = new Date();
      const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

      const currentStats = db.prepare(`
        SELECT 
          SUM(p.total_amount) as total_revenue,
          SUM(p.advance_paid) as total_received,
          SUM(p.remaining_balance) as total_pending,
          COUNT(c.id) as total_clients
        FROM clients c
        LEFT JOIN payments p ON c.id = p.client_id
      `).get();

      const prevMonthStats = db.prepare(`
        SELECT 
          SUM(p.total_amount) as total_revenue,
          SUM(p.advance_paid) as total_received
        FROM clients c
        LEFT JOIN payments p ON c.id = p.client_id
        WHERE c.created_at < ?
      `).get(firstDayCurrentMonth);

      // Calculate trends (simplified based on client creation date for revenue)
      const calculateTrend = (current: number, prev: number) => {
        if (!prev || prev === 0) return "+100%";
        const diff = ((current - prev) / prev) * 100;
        return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%";
      };

      res.json({
        revenue: {
          value: currentStats.total_revenue || 0,
          trend: calculateTrend(currentStats.total_revenue || 0, prevMonthStats.total_revenue || 0)
        },
        received: {
          value: currentStats.total_received || 0,
          trend: calculateTrend(currentStats.total_received || 0, prevMonthStats.total_received || 0)
        },
        pending: {
          value: currentStats.total_pending || 0
        },
        clients: {
          value: currentStats.total_clients || 0
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/clients", (req, res) => {
    const clients = db.prepare(`
      SELECT c.*, 
             (SELECT GROUP_CONCAT(service_type) FROM services WHERE client_id = c.id) as services,
             p.total_amount, p.advance_paid, p.remaining_balance,
             (SELECT COUNT(*) FROM tasks WHERE client_id = c.id AND status = 'pending') as pending_tasks
      FROM clients c
      LEFT JOIN payments p ON c.id = p.client_id
      ORDER BY c.created_at DESC
    `).all();
    
    res.json(clients.map(c => ({
      ...c,
      services: c.services ? c.services.split(',') : []
    })));
  });

  // Task Routes
  app.get("/api/tasks", (req, res) => {
    const { clientId } = req.query;
    let query = `
      SELECT t.*, c.name as client_name 
      FROM tasks t 
      JOIN clients c ON t.client_id = c.id 
    `;
    const params = [];
    
    if (clientId) {
      query += " WHERE t.client_id = ?";
      params.push(clientId);
    }
    
    query += " ORDER BY t.due_date ASC, t.created_at DESC";
    
    const tasks = db.prepare(query).all(...params);
    res.json(tasks);
  });

  app.post("/api/tasks", (req, res) => {
    const { client_id, title, assigned_to, due_date } = req.body;
    try {
      const result = db.prepare(
        "INSERT INTO tasks (client_id, title, assigned_to, due_date) VALUES (?, ?, ?, ?)"
      ).run(client_id, title, assigned_to, due_date);
      res.status(201).json({ id: result.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/tasks/:id", (req, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE tasks SET status = ? WHERE id = ?").run(status, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/tasks/:id", (req, res) => {
    try {
      db.prepare("DELETE FROM tasks WHERE id = ?").run(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/clients", (req, res) => {
    const { name, email, phone, company, services, total_amount, advance_paid, notes, managed_by } = req.body;
    
    const insertClient = db.transaction(() => {
      const clientResult = db.prepare(
        "INSERT INTO clients (name, email, phone, company, notes, managed_by) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(name, email, phone, company, notes, managed_by);
      
      const clientId = clientResult.lastInsertRowid;
      
      const serviceStmt = db.prepare("INSERT INTO services (client_id, service_type) VALUES (?, ?)");
      for (const service of services) {
        serviceStmt.run(clientId, service);
      }
      
      const remaining = total_amount - advance_paid;
      db.prepare(
        "INSERT INTO payments (client_id, total_amount, advance_paid, remaining_balance) VALUES (?, ?, ?, ?)"
      ).run(clientId, total_amount, advance_paid, remaining);
      
      return clientId;
    });

    try {
      const id = insertClient();
      res.status(201).json({ id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/clients/:id", (req, res) => {
    db.prepare("DELETE FROM clients WHERE id = ?").run(req.params.id);
    res.status(204).send();
  });

  app.patch("/api/clients/:id", (req, res) => {
    const { name, email, phone, company, notes, services, managed_by } = req.body;
    const clientId = req.params.id;

    try {
      const updateClient = db.transaction(() => {
        db.prepare(
          "UPDATE clients SET name = ?, email = ?, phone = ?, company = ?, notes = ?, managed_by = ? WHERE id = ?"
        ).run(name, email, phone, company, notes, managed_by, clientId);

        if (services) {
          db.prepare("DELETE FROM services WHERE client_id = ?").run(clientId);
          const serviceStmt = db.prepare("INSERT INTO services (client_id, service_type) VALUES (?, ?)");
          for (const service of services) {
            serviceStmt.run(clientId, service);
          }
        }
      });

      updateClient();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/payments/:clientId", (req, res) => {
    const { advance_paid, amount_added } = req.body;
    const clientId = req.params.clientId;
    
    try {
      const payment = db.prepare("SELECT total_amount, advance_paid FROM payments WHERE client_id = ?").get(clientId);
      if (!payment) return res.status(404).json({ error: "Payment record not found" });

      const updatePayment = db.transaction(() => {
        const remaining = payment.total_amount - advance_paid;
        db.prepare(
          "UPDATE payments SET advance_paid = ?, remaining_balance = ?, last_updated = CURRENT_TIMESTAMP WHERE client_id = ?"
        ).run(advance_paid, remaining, clientId);

        if (amount_added && amount_added > 0) {
          db.prepare(
            "INSERT INTO transactions (client_id, amount) VALUES (?, ?)"
          ).run(clientId, amount_added);
        }
      });

      updatePayment();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/transactions", (req, res) => {
    try {
      const transactions = db.prepare(`
        SELECT t.*, c.name as client_name, c.company
        FROM transactions t
        JOIN clients c ON t.client_id = c.id
        ORDER BY t.created_at DESC
      `).all();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/backup", (req, res) => {
    try {
      const clients = db.prepare("SELECT * FROM clients").all();
      const services = db.prepare("SELECT * FROM services").all();
      const payments = db.prepare("SELECT * FROM payments").all();
      const tasks = db.prepare("SELECT * FROM tasks").all();
      
      res.json({
        clients,
        services,
        payments,
        tasks,
        timestamp: new Date().toISOString(),
        version: "1.0"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/restore", (req, res) => {
    const { clients, services, payments, tasks } = req.body;
    
    const restore = db.transaction(() => {
      // Clear existing data
      db.prepare("DELETE FROM tasks").run();
      db.prepare("DELETE FROM payments").run();
      db.prepare("DELETE FROM services").run();
      db.prepare("DELETE FROM clients").run();
      
      // Restore clients
      const clientStmt = db.prepare("INSERT INTO clients (id, name, email, phone, company, notes, managed_by, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      for (const c of clients) {
        clientStmt.run(c.id, c.name, c.email, c.phone, c.company, c.notes, c.managed_by, c.status, c.created_at);
      }
      
      // Restore services
      const serviceStmt = db.prepare("INSERT INTO services (id, client_id, service_type, price) VALUES (?, ?, ?, ?)");
      for (const s of services) {
        serviceStmt.run(s.id, s.client_id, s.service_type, s.price);
      }
      
      // Restore payments
      const paymentStmt = db.prepare("INSERT INTO payments (id, client_id, total_amount, advance_paid, remaining_balance, last_updated) VALUES (?, ?, ?, ?, ?, ?)");
      for (const p of payments) {
        paymentStmt.run(p.id, p.client_id, p.total_amount, p.advance_paid, p.remaining_balance, p.last_updated);
      }
      
      // Restore tasks
      const taskStmt = db.prepare("INSERT INTO tasks (id, client_id, title, assigned_to, due_date, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
      for (const t of tasks) {
        taskStmt.run(t.id, t.client_id, t.title, t.assigned_to, t.due_date, t.status, t.created_at);
      }
    });

    try {
      restore();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
