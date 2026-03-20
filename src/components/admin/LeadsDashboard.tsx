import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  UserPlus,
  Filter,
  TrendingUp,
} from 'lucide-react';
import {
  Lead,
  LeadStatus,
  LEAD_STATUSES,
} from '@/lib/adminTypes';
import { getLeads, updateLeadStatus, deleteLead, addLead } from '@/lib/adminStorage';

function generateSampleLeads() {
  const samples = [
    { customerName: 'Carlos García', customerCompany: 'PrintShop Madrid', customerEmail: 'carlos@printshop.es', customerPhone: '+34 612 345 678', customerCountry: 'Spain', productsSelected: ['mbo-4060-plus'], productNames: ['MBO 4060 PLUS'], investmentRange: '5to15k', businessProfile: 'personalization', productionType: 'uvPrinting', priorities: ['quality', 'versatility'], notes: 'Interested in varnish effects', preferredContact: 'email', howFoundUs: 'google', totalEstimate: 8995, date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0] },
    { customerName: 'Marie Dupont', customerCompany: 'SignFrance', customerEmail: 'marie@signfrance.fr', customerPhone: '+33 6 12 34 56 78', customerCountry: 'France', productsSelected: ['mbo-6090'], productNames: ['MBO 6090'], investmentRange: '15to40k', businessProfile: 'signage', productionType: 'uvPrinting', priorities: ['quality'], notes: 'Need large format for signage', preferredContact: 'phone', howFoundUs: 'referral', totalEstimate: 18500, date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0] },
    { customerName: 'Jan Müller', customerCompany: 'DesignLab Berlin', customerEmail: 'jan@designlab.de', customerPhone: '+49 30 1234567', customerCountry: 'Germany', productsSelected: ['artisjet-young'], productNames: ['Artis Young'], investmentRange: 'under5k', businessProfile: 'designStudio', productionType: 'uvPrinting', priorities: ['price'], notes: '', preferredContact: 'whatsapp', howFoundUs: 'socialMedia', totalEstimate: 2990, date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0] },
    { customerName: 'Ana Martínez', customerCompany: 'Packaging Solutions', customerEmail: 'ana@packsol.es', customerPhone: '+34 698 765 432', customerCountry: 'Spain', productsSelected: ['mbo-4060-plus', 'mbo-3050'], productNames: ['MBO 4060 PLUS', 'MBO 3050 PRO'], investmentRange: '15to40k', businessProfile: 'industry', productionType: 'uvPrinting', priorities: ['versatility', 'quality', 'price'], notes: 'Wants to print on packaging and promotional items', preferredContact: 'email', howFoundUs: 'tradeShow', totalEstimate: 15490, date: new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0] },
    { customerName: 'Pieter Van Dam', customerCompany: 'Dutch Gifts BV', customerEmail: 'pieter@dutchgifts.nl', customerPhone: '+31 6 12345678', customerCountry: 'Netherlands', productsSelected: ['mbo-4060-plus-i3200'], productNames: ['MBO 4060 Plus I3200'], investmentRange: '5to15k', businessProfile: 'ecommerce', productionType: 'uvPrinting', priorities: ['quality', 'price'], notes: 'High quality personalization for online store', preferredContact: 'email', howFoundUs: 'google', totalEstimate: 11995, date: new Date().toISOString().split('T')[0] },
  ];
  samples.forEach(s => addLead(s));
}

export function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>(getLeads());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const refresh = () => setLeads(getLeads());

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    demo: leads.filter(l => l.status === 'demo_scheduled').length,
  }), [leads]);

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (dateFrom && l.date < dateFrom) return false;
      if (dateTo && l.date > dateTo) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          l.customerName.toLowerCase().includes(q) ||
          l.customerEmail.toLowerCase().includes(q) ||
          l.customerCompany.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [leads, search, statusFilter, dateFrom, dateTo]);

  const handleStatusChange = (id: string, status: LeadStatus) => {
    updateLeadStatus(id, status);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this lead?')) {
      deleteLead(id);
      refresh();
    }
  };

  const handleGenerateSamples = () => {
    generateSampleLeads();
    refresh();
  };

  const getStatusBadge = (status: LeadStatus) => {
    const s = LEAD_STATUSES.find(ls => ls.value === status);
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: s?.color + '18', color: s?.color }}
      >
        {s?.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-2xl">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage customer inquiries and quotes</p>
        </div>
        {leads.length === 0 && (
          <button
            onClick={handleGenerateSamples}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:brightness-[0.92] transition-all"
          >
            <UserPlus className="h-4 w-4" />
            Generate Sample Data
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: stats.total, icon: Users, color: '#0f0f0d' },
          { label: 'New', value: stats.new, icon: TrendingUp, color: '#e8522a' },
          { label: 'Contacted', value: stats.contacted, icon: Users, color: '#2563eb' },
          { label: 'Demo Scheduled', value: stats.demo, icon: Users, color: '#7c3aed' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-lg p-4" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <p className="text-label text-muted-foreground text-xs">{stat.label}</p>
            <p className="text-2xl font-semibold mt-1" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="bg-card rounded-lg p-4 space-y-3" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or company..."
              className="w-full h-10 pl-10 pr-4 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as LeadStatus | 'all')}
            className="h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none bg-card"
          >
            <option value="all">All statuses</option>
            {LEAD_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 px-3 rounded-lg text-sm border transition-colors ${
              showFilters ? 'border-primary text-primary bg-accent' : 'border-[rgba(0,0,0,0.08)] text-muted-foreground hover:border-[rgba(0,0,0,0.16)]'
            }`}
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <label className="text-xs text-muted-foreground">From:</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" />
            <label className="text-xs text-muted-foreground">To:</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" />
            {(dateFrom || dateTo) && (
              <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="text-xs text-primary hover:underline">Clear</button>
            )}
          </motion.div>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">{leads.length === 0 ? 'No leads yet' : 'No matching leads'}</h3>
          <p className="text-muted-foreground text-sm">
            {leads.length === 0 ? 'Leads will appear here when customers submit quotes from the wizard.' : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
          {/* Header */}
          <div className="hidden md:grid grid-cols-[100px_1fr_1fr_1fr_120px_100px_48px] gap-3 px-4 py-3 bg-[#f0ede7] text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Date</span>
            <span>Customer</span>
            <span>Products</span>
            <span>Investment</span>
            <span>Estimate</span>
            <span>Status</span>
            <span></span>
          </div>

          {/* Rows */}
          {filtered.map(lead => (
            <div key={lead.id}>
              <div
                className="grid grid-cols-1 md:grid-cols-[100px_1fr_1fr_1fr_120px_100px_48px] gap-3 px-4 py-3 items-center cursor-pointer hover:bg-muted/30 transition-colors text-sm"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
              >
                <span className="text-muted-foreground text-xs">{new Date(lead.createdAt).toLocaleDateString()}</span>
                <div>
                  <p className="font-medium truncate">{lead.customerName}</p>
                  <p className="text-xs text-muted-foreground truncate">{lead.customerCompany} · {lead.customerEmail}</p>
                </div>
                <div className="hidden md:block">
                  <p className="truncate">{lead.productNames?.join(', ') || '-'}</p>
                </div>
                <span className="hidden md:block text-muted-foreground">{lead.investmentRange || '-'}</span>
                <span className="hidden md:block text-price font-semibold">{lead.totalEstimate ? `${lead.totalEstimate.toLocaleString()}€` : '-'}</span>
                <div onClick={e => e.stopPropagation()}>
                  <select
                    value={lead.status}
                    onChange={e => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                    className="h-7 px-2 rounded text-xs font-medium border border-[rgba(0,0,0,0.08)] bg-card outline-none cursor-pointer"
                    style={{ color: LEAD_STATUSES.find(s => s.value === lead.status)?.color }}
                  >
                    {LEAD_STATUSES.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(lead.id); }}
                  className="hidden md:flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedId === lead.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-4 bg-[#f9f7f4] grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <div>
                        <p className="text-label text-xs text-muted-foreground mb-1">Contact</p>
                        <p>{lead.customerPhone}</p>
                        <p className="text-muted-foreground">{lead.customerCountry}</p>
                        <p className="text-muted-foreground">Preferred: {lead.preferredContact}</p>
                      </div>
                      <div>
                        <p className="text-label text-xs text-muted-foreground mb-1">Profile</p>
                        <p>{lead.businessProfile}</p>
                        <p className="text-muted-foreground">{lead.productionType}</p>
                        {lead.priorities?.length > 0 && (
                          <p className="text-muted-foreground">Priorities: {lead.priorities.join(', ')}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-label text-xs text-muted-foreground mb-1">Notes</p>
                        <p className="text-muted-foreground">{lead.notes || 'No notes'}</p>
                        <p className="text-xs text-muted-foreground mt-2">Source: {lead.howFoundUs || '-'}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Showing {filtered.length} of {leads.length} leads
      </p>
    </div>
  );
}
