import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  X, 
  MoreVertical, 
  Trash2, 
  Edit,
  Mail, 
  Phone, 
  Briefcase,
  ArrowUpRight,
  CreditCard,
  LayoutDashboard,
  Filter,
  Eye,
  EyeOff,
  Download,
  Upload,
  Database,
  Lock,
  FileText,
  Table as TableIcon,
  ListTodo,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu
} from 'lucide-react';
import { Client, ServiceType, SERVICE_TYPES, Task } from './types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const ADMIN_PASSWORD = 'Sr23802@&&';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-5 sm:p-6 rounded-3xl border border-white/10 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 ${color} opacity-5 blur-[40px] sm:blur-[60px] -mr-12 -mt-12 group-hover:opacity-10 transition-opacity`} />
    <div className="flex items-start justify-between relative z-10">
      <div className="space-y-1 sm:space-y-2">
        <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tighter">{value}</h3>
        {trend && (
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${trend.includes('+') ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
            <p className={`text-[10px] sm:text-xs font-bold ${trend.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend}
            </p>
          </div>
        )}
      </div>
      <div className={`p-2.5 sm:p-3 rounded-2xl ${color} bg-opacity-10 border border-white/5`}>
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
  </motion.div>
);

const ClientModal = ({ isOpen, onClose, onAdd, onUpdate, client }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [] as ServiceType[],
    total_amount: 0,
    advance_paid: 0,
    managed_by: 'JYOTI SONI' as 'JYOTI SONI' | 'SHUBHAM RAI',
    notes: ''
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        services: client.services || [],
        total_amount: client.total_amount || 0,
        advance_paid: client.advance_paid || 0,
        managed_by: client.managed_by || 'JYOTI SONI',
        notes: client.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        services: [] as ServiceType[],
        total_amount: 0,
        advance_paid: 0,
        managed_by: 'JYOTI SONI',
        notes: ''
      });
    }
  }, [client, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      onUpdate(client.id, formData);
    } else {
      onAdd(formData);
    }
    onClose();
  };

  const toggleService = (service: ServiceType) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-card rounded-[2.5rem] w-full max-w-2xl shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden border border-white/10 relative"
        >
          {/* Decorative Background Glows */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tighter">
                {client ? 'Edit Client' : 'Add New Client'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">Fill in the details to expand your digital empire.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
              <X className="w-6 h-6 text-slate-400 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 max-h-[75vh] overflow-y-auto relative z-10 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Client Name</label>
                <input 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-medium"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Managed By</label>
                <select 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium appearance-none"
                  value={formData.managed_by}
                  onChange={e => setFormData({...formData, managed_by: e.target.value as any})}
                >
                  <option value="JYOTI SONI" className="bg-slate-900">JYOTI SONI</option>
                  <option value="SHUBHAM RAI" className="bg-slate-900">SHUBHAM RAI</option>
                </select>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                <input 
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-medium"
                  placeholder="Acme Corp"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-medium"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input 
                  required
                  type="tel"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-medium"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) {
                      setFormData({...formData, phone: val});
                    }
                  }}
                />
                <div className="flex justify-between px-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Required for WhatsApp</p>
                  <p className="text-[10px] text-slate-500 font-bold">{formData.phone.length}/10</p>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select Services</label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {SERVICE_TYPES.map((service, idx) => (
                  <motion.button
                    key={service}
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + (idx * 0.05) }}
                    onClick={() => toggleService(service)}
                    className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                      formData.services.includes(service)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/20'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:border-indigo-500/50 hover:text-white'
                    }`}
                  >
                    {service}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-8 border-t border-white/10">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Total Project Value (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input 
                    type="number"
                    required
                    className="w-full pl-10 pr-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-bold text-lg"
                    placeholder="0.00"
                    value={formData.total_amount}
                    onChange={e => setFormData({...formData, total_amount: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Advance Payment (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input 
                    type="number"
                    className="w-full pl-10 pr-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-bold text-lg"
                    placeholder="0.00"
                    value={formData.advance_paid}
                    onChange={e => setFormData({...formData, advance_paid: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="flex justify-between px-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Initial Deposit</p>
                  <p className="text-[10px] text-amber-400 font-black">
                    Pending: ₹{(formData.total_amount - formData.advance_paid).toLocaleString('en-IN')}
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Client Notes</label>
              <textarea 
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 min-h-[120px] resize-none font-medium"
                placeholder="Add any specific requirements or notes about the client..."
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="pt-6 flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 rounded-2xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25 glow-indigo"
              >
                {client ? 'Update Client' : 'Save Client'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const PaymentModal = ({ isOpen, onClose, client, onUpdate }: any) => {
  const [amountPaid, setAmountPaid] = useState(0);

  useEffect(() => {
    if (client) {
      setAmountPaid(client.advance_paid);
    }
  }, [client]);

  if (!isOpen || !client) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(client.id, amountPaid);
    onClose();
  };

  const markAsComplete = () => {
    onUpdate(client.id, client.total_amount);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-card rounded-[2.5rem] w-full max-w-md shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden border border-white/10 relative"
        >
          <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter">Update Payment</h2>
              <p className="text-slate-400 text-xs font-medium mt-1">Client: {client.name}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
              <X className="w-6 h-6 text-slate-400 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 relative z-10">
            <div className="space-y-6">
              <div className="flex justify-between items-end p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Value</p>
                  <p className="text-xl font-black text-white">₹{client.total_amount.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Remaining</p>
                  <p className="text-xl font-black text-amber-400">₹{client.remaining_balance.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Total Amount Received (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input 
                    type="number"
                    required
                    step="0.01"
                    className="w-full pl-10 pr-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-bold text-lg"
                    placeholder="0.00"
                    value={amountPaid}
                    onChange={e => setAmountPaid(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="flex justify-between items-center px-1">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-500 font-medium">Cumulative amount received.</p>
                    <p className="text-[10px] text-indigo-400 font-black">
                      ₹{amountPaid.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="text-[10px] text-slate-500 font-medium">New Balance</p>
                    <p className="text-[10px] text-amber-400 font-black">
                      ₹{(client.total_amount - amountPaid).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25 glow-indigo"
              >
                Update Balance
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(16,185,129,0.3)" }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={markAsComplete}
                className="w-full px-8 py-4 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/25 glow-emerald"
              >
                Mark as Fully Paid
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const TaskModal = ({ isOpen, onClose, clients, onAdd, initialClientId }: any) => {
  const [formData, setFormData] = useState({
    client_id: initialClientId || '',
    title: '',
    assigned_to: 'JYOTI SONI',
    due_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialClientId) {
      setFormData(prev => ({ ...prev, client_id: initialClientId }));
    }
  }, [initialClientId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ client_id: '', title: '', assigned_to: 'JYOTI SONI', due_date: new Date().toISOString().split('T')[0] });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-card rounded-[2.5rem] w-full max-w-md shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden border border-white/10 relative"
        >
          <div className="p-6 sm:p-8 border-b border-white/10 flex justify-between items-center bg-white/5 relative z-10">
            <h2 className="text-2xl font-black text-white tracking-tighter">Add New Task</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors group">
              <X className="w-6 h-6 text-slate-400 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8 relative z-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Select Client</label>
                <select 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium appearance-none"
                  value={formData.client_id}
                  onChange={e => setFormData({...formData, client_id: e.target.value})}
                >
                  <option value="" className="bg-slate-900">Choose a client...</option>
                  {clients.map((c: Client) => (
                    <option key={c.id} value={c.id} className="bg-slate-900">{c.name} ({c.company})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                <input 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 font-medium"
                  placeholder="What needs to be done?"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Assign To</label>
                  <select 
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium appearance-none"
                    value={formData.assigned_to}
                    onChange={e => setFormData({...formData, assigned_to: e.target.value})}
                  >
                    <option value="JYOTI SONI" className="bg-slate-900">JYOTI SONI</option>
                    <option value="SHUBHAM RAI" className="bg-slate-900">SHUBHAM RAI</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Due Date</label>
                  <input 
                    type="date"
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                    value={formData.due_date}
                    onChange={e => setFormData({...formData, due_date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 rounded-2xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25 glow-indigo"
              >
                Create Task
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="app-bg" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/10 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
            <div className="w-24 h-24 relative z-10 marketing-gradient rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-4 border border-white/20 overflow-hidden">
              <img 
                src="https://lengthy-silver-enmyf91qfx.edgeone.app/IMG_1404-removebg-preview.png" 
                alt="SR DIGITAL" 
                className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">Admin Access</h2>
          <p className="text-slate-400 text-center mt-2">Enter your password to access the client dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, y: -2, boxShadow: "0 20px 40px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25 glow-indigo"
          >
            Unlock Digital Empire
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'tasks' | 'data' | 'payments'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    revenue: { value: 0, trend: '+0%' },
    received: { value: 0, trend: '+0%' },
    pending: { value: 0 },
    clients: { value: 0 }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [dbStatus, setDbStatus] = useState<string>('');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        if (res.ok) {
          setServerStatus('online');
          setDbStatus(data.database);
        } else {
          setServerStatus('offline');
        }
      } catch {
        setServerStatus('offline');
      }
    };
    checkServer();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchClients();
      fetchTasks();
      fetchStats();
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data);
      // Auto-backup to browser memory
      if (data.length > 0) {
        localStorage.setItem('clientflow_backup', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      // Try to load from browser memory if server fails
      const backup = localStorage.getItem('clientflow_backup');
      if (backup) {
        setClients(JSON.parse(backup));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const addTask = async (taskData: any) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (res.ok) {
        fetchTasks();
        fetchClients(); // Update pending tasks count
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const toggleTaskStatus = async (taskId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchTasks();
        fetchClients();
      }
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
      fetchClients();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const exportToExcel = (data: Client[], filename = 'clients-report.xlsx') => {
    const worksheetData = data.map(c => ({
      'Client Name': c.name,
      'Company': c.company,
      'Email': c.email,
      'Phone': c.phone,
      'Services': c.services.join(', '),
      'Total Amount (INR)': c.total_amount,
      'Paid (INR)': c.advance_paid,
      'Remaining (INR)': c.remaining_balance,
      'Status': c.status,
      'Created At': new Date(c.created_at).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
    XLSX.writeFile(workbook, filename);
  };

  const importFromExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      for (const row of data as any[]) {
        const clientData = {
          name: row['Client Name'] || row['name'],
          company: row['Company'] || row['company'],
          email: row['Email'] || row['email'],
          phone: row['Phone'] || row['phone'],
          services: (row['Services'] || row['services'] || '').split(',').map((s: string) => s.trim()).filter(Boolean),
          total_amount: parseFloat(row['Total Amount (INR)'] || row['total_amount'] || 0),
          advance_paid: parseFloat(row['Paid (INR)'] || row['advance_paid'] || 0)
        };
        await addClient(clientData);
      }
      alert('Import completed successfully!');
    };
    reader.readAsBinaryString(file);
  };

  const exportToPDF = (data: Client[], filename = 'clients-report.pdf') => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Client Payment Report (INR)', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableData = data.map(c => [
      c.name,
      c.company,
      c.services.join(', '),
      `₹${c.total_amount.toLocaleString('en-IN')}`,
      `₹${c.advance_paid.toLocaleString('en-IN')}`,
      `₹${c.remaining_balance.toLocaleString('en-IN')}`
    ]);

    (doc as any).autoTable({
      startY: 40,
      head: [['Client', 'Company', 'Services', 'Total', 'Paid', 'Balance']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      styles: { fontSize: 8 }
    });

    doc.save(filename);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const addClient = async (formData: any) => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchClients();
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to add client:', err);
    }
  };

  const editClient = async (id: number, formData: any) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchClients();
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to update client:', err);
    }
  };

  const updatePayment = async (clientId: number, advancePaid: number) => {
    try {
      const client = clients.find(c => c.id === clientId);
      const amountAdded = advancePaid - (client?.advance_paid || 0);

      const res = await fetch(`/api/payments/${clientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advance_paid: advancePaid, amount_added: amountAdded })
      });
      if (res.ok) {
        fetchClients();
        fetchStats();
        fetchTransactions();
      }
    } catch (err) {
      console.error('Failed to update payment:', err);
    }
  };

  const deleteClient = async (id: number) => {
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      fetchClients();
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
    } catch (err) {
      console.error('Failed to delete client:', err);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="app-bg" />
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 sidebar-glass flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-30 animate-pulse" />
            <div className="w-10 h-10 relative z-10 marketing-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/10 overflow-hidden">
              <img 
                src="https://lengthy-silver-enmyf91qfx.edgeone.app/IMG_1404-removebg-preview.png" 
                alt="SR DIGITAL" 
                className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h1 className="text-lg font-black text-white tracking-tighter">SR DIGITAL</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`fixed left-0 top-0 bottom-0 w-72 sidebar-glass flex flex-col p-6 z-50 transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-30 animate-pulse" />
              <div className="w-12 h-12 relative z-10 marketing-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/10 overflow-hidden">
                <img 
                  src="https://lengthy-silver-enmyf91qfx.edgeone.app/IMG_1404-removebg-preview.png" 
                  alt="SR DIGITAL" 
                  className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter">SR DIGITAL</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <nav className="space-y-3 flex-1">
          <motion.button 
            whileHover={{ x: 8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all border ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-600 text-white font-black border-indigo-500 shadow-[0_10px_20px_rgba(79,70,229,0.3)]' 
                : 'text-slate-400 hover:bg-indigo-600/10 hover:text-indigo-400 font-bold border-transparent'
            }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'animate-bounce' : ''}`} />
            Dashboard
          </motion.button>
          <motion.button 
            whileHover={{ x: 8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveTab('clients'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all border ${
              activeTab === 'clients' 
                ? 'bg-emerald-600 text-white font-black border-emerald-500 shadow-[0_10px_20px_rgba(5,150,105,0.3)]' 
                : 'text-slate-400 hover:bg-emerald-600/10 hover:text-emerald-400 font-bold border-transparent'
            }`}
          >
            <Users className={`w-5 h-5 ${activeTab === 'clients' ? 'animate-bounce' : ''}`} />
            Clients
          </motion.button>
          <motion.button 
            whileHover={{ x: 8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveTab('tasks'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all border ${
              activeTab === 'tasks' 
                ? 'bg-rose-600 text-white font-black border-rose-500 shadow-[0_10px_20px_rgba(225,29,72,0.3)]' 
                : 'text-slate-400 hover:bg-rose-600/10 hover:text-rose-400 font-bold border-transparent'
            }`}
          >
            <ListTodo className={`w-5 h-5 ${activeTab === 'tasks' ? 'animate-bounce' : ''}`} />
            Tasks
          </motion.button>
          <motion.button 
            whileHover={{ x: 8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveTab('payments'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all border ${
              activeTab === 'payments' 
                ? 'bg-amber-600 text-white font-black border-amber-500 shadow-[0_10px_20px_rgba(217,119,6,0.3)]' 
                : 'text-slate-400 hover:bg-amber-600/10 hover:text-amber-400 font-bold border-transparent'
            }`}
          >
            <CreditCard className={`w-5 h-5 ${activeTab === 'payments' ? 'animate-bounce' : ''}`} />
            Payments
          </motion.button>
          <motion.button 
            whileHover={{ x: 8, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveTab('data'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all border ${
              activeTab === 'data' 
                ? 'bg-cyan-600 text-white font-black border-cyan-500 shadow-[0_10px_20px_rgba(8,145,178,0.3)]' 
                : 'text-slate-400 hover:bg-cyan-600/10 hover:text-cyan-400 font-bold border-transparent'
            }`}
          >
            <Database className={`w-5 h-5 ${activeTab === 'data' ? 'animate-bounce' : ''}`} />
            Data Management
          </motion.button>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
              <img src="https://indirect-plum-spcvbqt3gr.edgeone.app/01c12cee-158c-4276-a5db-552b24c6f321.jpeg" alt="User" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">SR DIGITAL</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500 animate-pulse' : serverStatus === 'offline' ? 'bg-rose-500' : 'bg-slate-500'}`} />
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                  {serverStatus === 'online' 
                    ? (dbStatus.includes('fallback') ? 'Local Mode (No Save)' : 'Cloud Sync Active') 
                    : serverStatus === 'offline' ? 'Sync Error' : 'Checking...'}
                </p>
              </div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-bold transition-all group glow-red"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Logout
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 p-4 md:p-8 lg:p-12 pt-24 lg:pt-12 relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tighter leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-text">
                {activeTab === 'dashboard' && 'SR DIGITAL Dashboard'}
                {activeTab === 'clients' && 'SR DIGITAL Clients'}
                {activeTab === 'tasks' && 'SR DIGITAL Tasks'}
                {activeTab === 'payments' && 'SR DIGITAL Payments'}
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-base sm:text-lg font-medium"
            >
              {activeTab === 'dashboard' && "Welcome to the future of digital growth. Here's your agency overview."}
              {activeTab === 'clients' && "Precision management for your elite client portfolio."}
              {activeTab === 'tasks' && "Stay ahead of the curve. Your mission-critical deliverables."}
              {activeTab === 'payments' && "Financial transparency. Track every rupee across your agency."}
              {activeTab === 'data' && "Secure backup and restore for your agency's memory."}
            </motion.p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === 'clients' && (
              <div className="flex flex-wrap items-center gap-2">
                <motion.label 
                  whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(16,185,129,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/25 glow-emerald text-sm sm:text-base"
                >
                  <Download className="w-5 h-5 rotate-180" />
                  Import
                  <input type="file" accept=".xlsx, .xls" className="hidden" onChange={importFromExcel} />
                </motion.label>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(99,102,241,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportToExcel(clients)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 transition-all text-sm sm:text-base"
                >
                  <TableIcon className="w-5 h-5" />
                  Export
                </motion.button>
              </div>
            )}
            {activeTab === 'tasks' && (
              <motion.button 
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsTaskModalOpen(true)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25 glow-indigo w-full sm:w-auto"
              >
                <Plus className="w-6 h-6" />
                New Task
              </motion.button>
            )}
            {(activeTab === 'clients' || activeTab === 'dashboard') && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(99,102,241,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25 glow-indigo w-full sm:w-auto"
                >
                  <Plus className="w-6 h-6" />
                  Add New Client
                </motion.button>
              </div>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total Revenue" 
            value={`₹${stats.revenue.value.toLocaleString('en-IN')}`} 
            icon={DollarSign} 
            trend={`${stats.revenue.trend} this month`}
            color="bg-indigo-500"
          />
          <StatCard 
            title="Total Received" 
            value={`₹${stats.received.value.toLocaleString('en-IN')}`} 
            icon={CheckCircle2} 
            trend={`${stats.received.trend} this month`}
            color="bg-emerald-500"
          />
          <StatCard 
            title="Pending Balance" 
            value={`₹${stats.pending.value.toLocaleString('en-IN')}`} 
            icon={ArrowUpRight} 
            color="bg-amber-500"
          />
          <StatCard 
            title="Active Clients" 
            value={stats.clients.value} 
            icon={Users} 
            color="bg-violet-500"
          />
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden group cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Plus className="w-24 h-24 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Acquire Client</h4>
                <p className="text-slate-400 text-sm">Onboard a new high-value client to your portfolio.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden group cursor-pointer"
                onClick={() => setActiveTab('tasks')}
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ListTodo className="w-24 h-24 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Review Tasks</h4>
                <p className="text-slate-400 text-sm">Manage mission-critical deliverables and deadlines.</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden group cursor-pointer"
                onClick={() => setActiveTab('payments')}
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <DollarSign className="w-24 h-24 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Finance Overview</h4>
                <p className="text-slate-400 text-sm">Track revenue streams and pending settlements.</p>
              </motion.div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Clock className="w-6 h-6 text-indigo-400" />
                    Recent Transactions
                  </h3>
                  <button 
                    onClick={() => setActiveTab('payments')}
                    className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((t) => (
                    <motion.div 
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-card p-4 rounded-2xl border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{t.client_name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-400">+₹{t.amount.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-500">{new Date(t.created_at).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-8 glass-card rounded-2xl border border-white/5">
                      <p className="text-slate-500 text-sm">No recent transactions recorded.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <ListTodo className="w-6 h-6 text-rose-400" />
                    Urgent Tasks
                  </h3>
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className="text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors"
                  >
                    Manage Tasks
                  </button>
                </div>
                <div className="space-y-4">
                  {tasks.filter(t => t.status === 'pending').slice(0, 5).map((task) => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-card p-4 rounded-2xl border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{task.title}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">{task.client_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-rose-400 font-bold uppercase">{task.due_date}</p>
                        <p className="text-[10px] text-slate-500">Due Date</p>
                      </div>
                    </motion.div>
                  ))}
                  {tasks.filter(t => t.status === 'pending').length === 0 && (
                    <div className="text-center py-8 glass-card rounded-2xl border border-white/5">
                      <p className="text-slate-500 text-sm">All clear! No pending tasks.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
                  <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Transaction History</h3>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400">
                        <Filter className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5">
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Client</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {transactions.map((t) => (
                          <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="text-sm text-slate-300">{new Date(t.created_at).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-white">{t.client_name}</p>
                              <p className="text-[10px] text-slate-500 uppercase">{t.company}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-emerald-400">₹{t.amount.toLocaleString('en-IN')}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase">Completed</span>
                            </td>
                          </tr>
                        ))}
                        {transactions.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                              No transactions found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Outstanding Settlements */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white px-2">Outstanding Settlements</h3>
                <div className="space-y-4">
                  {clients.filter(c => c.remaining_balance > 0).sort((a, b) => b.remaining_balance - a.remaining_balance).map(client => (
                    <motion.div 
                      key={client.id}
                      whileHover={{ scale: 1.02 }}
                      className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between group cursor-pointer"
                      onClick={() => {
                        setSelectedClient(client);
                        setIsPaymentModalOpen(true);
                      }}
                    >
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{client.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase">{client.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-400">₹{client.remaining_balance.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-500">Pending</p>
                      </div>
                    </motion.div>
                  ))}
                  {clients.filter(c => c.remaining_balance > 0).length === 0 && (
                    <div className="p-8 text-center glass-card rounded-2xl border border-white/5">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
                      <p className="text-slate-500 text-sm">No outstanding balances!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Download className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Full Database Backup</h3>
              <p className="text-slate-400 mb-6">Download a complete snapshot of your agency's data, including all clients, services, payments, and tasks in a single JSON file.</p>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(99,102,241,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  const res = await fetch('/api/backup');
                  const data = await res.json();
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `sr-digital-backup-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                }}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/25 glow-indigo"
              >
                Download JSON Backup
              </motion.button>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Upload className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Restore from Backup</h3>
              <p className="text-slate-400 mb-6">Upload a previously downloaded JSON backup to restore your agency's memory. <span className="text-rose-400 font-bold">Warning: This will overwrite all current data!</span></p>
              <motion.label 
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(225,29,72,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer w-full flex items-center justify-center py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 transition-all shadow-xl shadow-rose-500/25 glow-rose"
              >
                Upload & Restore
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!confirm('Are you absolutely sure? This will delete all current data and replace it with the backup.')) return;
                    
                    const reader = new FileReader();
                    reader.onload = async (evt) => {
                      try {
                        const data = JSON.parse(evt.target?.result as string);
                        const res = await fetch('/api/restore', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(data)
                        });
                        if (res.ok) {
                          alert('Database restored successfully!');
                          fetchClients();
                          fetchTasks();
                          setActiveTab('dashboard');
                        } else {
                          alert('Failed to restore database.');
                        }
                      } catch (err) {
                        alert('Invalid backup file.');
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
              </motion.label>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Browser Cache Recovery</h3>
              <p className="text-slate-400 mb-6">If the server resets, you can try to restore client data from your browser's local memory (Auto-saved every time you view clients).</p>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2, boxShadow: "0 20px 40px rgba(245,158,11,0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  const backup = localStorage.getItem('clientflow_backup');
                  if (!backup) {
                    alert('No browser backup found.');
                    return;
                  }
                  if (!confirm('Attempt to restore clients from browser cache? This will try to re-sync them to the server.')) return;
                  
                  const clients = JSON.parse(backup);
                  let successCount = 0;
                  for (const client of clients) {
                    try {
                      const res = await fetch('/api/clients', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(client)
                      });
                      if (res.ok) successCount++;
                    } catch (e) {
                      console.error('Failed to sync client:', client.name);
                    }
                  }
                  alert(`Sync complete! Successfully restored ${successCount} clients to the server.`);
                  fetchClients();
                  setActiveTab('clients');
                }}
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black rounded-2xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-xl shadow-amber-500/25 glow-amber"
              >
                Sync Cache to Server
              </motion.button>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-white/10 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">System Integrity</h3>
                  <p className="text-slate-400 text-sm">Your data is stored in a persistent SQLite database on the server.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <p className="text-indigo-400 font-black text-xs uppercase tracking-widest">1. Server Memory</p>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">The primary storage is <span className="text-white font-bold">clientflow.db</span>. This file lives on your Hostinger server. Ensure the folder has <span className="text-indigo-400">write permissions</span>.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <p className="text-amber-400 font-black text-xs uppercase tracking-widest">2. Browser Cache</p>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">The app automatically caches clients in your browser. If the server resets, use <span className="text-amber-400 font-bold">Sync Cache</span> to restore them instantly.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-emerald-400 font-black text-xs uppercase tracking-widest">3. Manual Backups</p>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">Download a JSON backup weekly. This is the <span className="text-emerald-400 font-bold">ultimate safety net</span> for your agency's entire history.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xl font-black text-white tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 animate-gradient-text">
                  SR DIGITAL
                </span>
                <span className="ml-2 text-slate-500 font-bold">Directory</span>
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Search clients..."
                    className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm w-full md:w-64 placeholder:text-slate-600"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Filter className="w-5 h-5 text-slate-400" />
                </motion.button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Client Info</th>
                    <th className="px-6 py-4">Managed By</th>
                    <th className="px-6 py-4">Services</th>
                    <th className="px-6 py-4">Payment Status</th>
                    <th className="px-6 py-4">Tasks</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {filteredClients.map((client) => (
                      <motion.tr 
                        key={client.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                              {client.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-white">{client.name}</p>
                              <p className="text-xs text-slate-400">{client.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${client.managed_by === 'JYOTI SONI' ? 'bg-purple-500' : 'bg-indigo-500'}`} />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">{client.managed_by}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex flex-wrap gap-1">
                            {client.services.map(s => (
                              <span key={s} className="px-2 py-1 rounded-md bg-white/5 text-slate-300 text-[10px] font-bold uppercase tracking-tight border border-white/5">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="w-full max-w-[120px]">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <motion.span
                                key={client.advance_paid}
                                initial={{ opacity: 0.5, y: -2 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                {Math.round((client.advance_paid / client.total_amount) * 100)}% Paid
                              </motion.span>
                              <span>₹{client.total_amount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(client.advance_paid / client.total_amount) * 100}%` }}
                                className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${client.pending_tasks > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                              <ListTodo className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-white">{client.pending_tasks} Pending</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <motion.p 
                            key={client.remaining_balance}
                            initial={{ scale: 1.1, color: '#fbbf24' }}
                            animate={{ 
                              scale: 1, 
                              color: client.remaining_balance > 0 ? '#fbbf24' : '#34d399' 
                            }}
                            transition={{ duration: 0.4 }}
                            className={`font-bold ${client.remaining_balance > 0 ? 'text-amber-400' : 'text-emerald-400'}`}
                          >
                            ₹{client.remaining_balance.toLocaleString('en-IN')}
                          </motion.p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase">Remaining</p>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 transition-opacity">
                            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                              <motion.button 
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => exportToExcel([client], `${client.name}-report.xlsx`)}
                                className="p-1.5 hover:bg-emerald-500/20 text-emerald-400 rounded-md transition-colors"
                                title="Download Excel"
                              >
                                <TableIcon className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.2, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => exportToPDF([client], `${client.name}-report.pdf`)}
                                className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-md transition-colors"
                                title="Download PDF"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                  const text = `🚀 *SR DIGITAL - Client Report* 🚀\n\n👤 *Client:* ${client.name}\n🏢 *Company:* ${client.company}\n📱 *Phone:* ${client.phone}\n✉️ *Email:* ${client.email}\n\n💰 *Project Value:* ₹${client.total_amount.toLocaleString('en-IN')}\n✅ *Paid:* ₹${client.advance_paid.toLocaleString('en-IN')}\n⚠️ *Remaining Balance:* ₹${client.remaining_balance.toLocaleString('en-IN')}\n\n🛠️ *Services:* ${client.services.join(', ')}\n📋 *Pending Tasks:* ${client.pending_tasks}\n\n📅 *Report Date:* ${new Date().toLocaleDateString()}`;
                                  const encodedText = encodeURIComponent(text);
                                  window.open(`https://wa.me/919211841593?text=${encodedText}`, '_blank');
                                }}
                                className="p-1.5 hover:bg-emerald-500/20 text-[#25D366] rounded-md transition-colors"
                                title="Share to WhatsApp"
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                              </motion.button>
                            </div>
                            <motion.button 
                              whileHover={{ scale: 1.2, rotate: 15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedClient(client);
                                setIsModalOpen(true);
                              }}
                              className="p-2 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                              title="Edit Client"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.2, rotate: 15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedClient(client);
                                setIsTaskModalOpen(true);
                              }}
                              className="p-2 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                              title="Add Task"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.2, rotate: -15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedClient(client);
                                setIsPaymentModalOpen(true);
                              }}
                              className="p-2 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                              title="Update Payment"
                            >
                              <DollarSign className="w-4 h-4" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.2, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedClient(client);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                              title="Delete Client"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`glass-card p-6 rounded-3xl border transition-all ${
                    task.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-xl ${task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {task.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.2, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTask(task.id)}
                      className="p-2 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  <h4 className={`text-lg font-bold mb-1 ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-slate-400 font-medium">{task.client_name}</p>
                    <span className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-slate-500 font-bold border border-white/5">
                      {task.assigned_to}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(task.due_date).toLocaleDateString()}
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTaskStatus(task.id, task.status)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        task.status === 'completed' 
                          ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'
                      }`}
                    >
                      {task.status === 'completed' ? 'Reopen' : 'Complete'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {tasks.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center text-slate-500">
                <ListTodo className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-lg font-medium">No tasks assigned yet</p>
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="mt-4 text-indigo-400 hover:underline font-bold"
                >
                  Create your first task
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedClient && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-red-500/20"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Delete Client?</h2>
                <p className="text-slate-400 mb-6">
                  Are you sure you want to delete <span className="text-white font-bold">{selectedClient.name}</span>? 
                  This action cannot be undone and all associated tasks and payments will be lost.
                </p>
                
                <div className="mb-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <p className="text-xs text-emerald-400 font-bold uppercase mb-3">Backup Data Before Deleting</p>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => exportToExcel([selectedClient], `${selectedClient.name}-backup.xlsx`)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500/10 text-emerald-400 font-bold rounded-xl hover:bg-emerald-500/20 transition-all border border-emerald-500/20 glow-emerald"
                  >
                    <TableIcon className="w-4 h-4" />
                    Download Excel Backup
                  </motion.button>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setSelectedClient(null);
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-slate-300 font-bold hover:bg-white/10 transition-all border border-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => deleteClient(selectedClient.id)}
                    className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/25"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }} 
        onAdd={addClient}
        onUpdate={editClient}
        client={selectedClient}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onUpdate={updatePayment}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedClient(null);
        }}
        clients={clients}
        onAdd={addTask}
        initialClientId={selectedClient?.id}
      />
    </div>
  );
}
