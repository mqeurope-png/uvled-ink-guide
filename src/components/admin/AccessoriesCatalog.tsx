import { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2, X, Save, Package } from 'lucide-react';
import { getConsumables, saveConsumable, deleteConsumable, getProducts } from '@/lib/adminStorage';
import { AdminConsumable, CONSUMABLE_TYPES, ConsumableType } from '@/lib/adminTypes';

const emptyConsumable = (): AdminConsumable => ({
  id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
  name: '',
  type: 'accessory',
  description: '',
  url: '',
  image: '',
  price: '',
  lifespan: '',
  compatibleModelIds: [],
  active: true,
  createdAt: '',
  updatedAt: '',
});

const TYPE_COLORS: Record<ConsumableType, string> = {
  printhead: 'bg-blue-100 text-blue-700',
  damper: 'bg-purple-100 text-purple-700',
  capping: 'bg-amber-100 text-amber-700',
  wiper: 'bg-green-100 text-green-700',
  cleanStation: 'bg-teal-100 text-teal-700',
  tubes: 'bg-orange-100 text-orange-700',
  ink: 'bg-pink-100 text-pink-700',
  accessory: 'bg-indigo-100 text-indigo-700',
};

export function AccessoriesCatalog() {
  const [items, setItems] = useState<AdminConsumable[]>(getConsumables());
  const [editing, setEditing] = useState<AdminConsumable | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const products = useMemo(() => getProducts(), []);

  const refresh = () => setItems(getConsumables());

  const filtered = useMemo(() => {
    let result = items;
    if (typeFilter !== 'all') {
      result = result.filter(c => c.type === typeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, search, typeFilter]);

  const handleSave = () => {
    if (!editing) return;
    saveConsumable(editing);
    setEditing(null);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this consumable/accessory?')) {
      deleteConsumable(id);
      refresh();
    }
  };

  const toggleActive = (c: AdminConsumable) => {
    saveConsumable({ ...c, active: !c.active, updatedAt: new Date().toISOString() });
    refresh();
  };

  const update = (field: keyof AdminConsumable, value: unknown) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value } as AdminConsumable);
  };

  const toggleCompatibleModel = (modelId: string) => {
    if (!editing) return;
    const ids = editing.compatibleModelIds.includes(modelId)
      ? editing.compatibleModelIds.filter(id => id !== modelId)
      : [...editing.compatibleModelIds, modelId];
    update('compatibleModelIds', ids);
  };

  const getTypeLabel = (type: ConsumableType) =>
    CONSUMABLE_TYPES.find(t => t.value === type)?.label || type;

  // ── Edit Form ──
  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setEditing(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
            Cancel
          </button>
          <h1 className="text-display text-2xl">{editing.createdAt ? 'Edit Consumable' : 'New Consumable'}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-5 space-y-4" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-medium">Basic Info</h3>

              <div>
                <label className="text-sm font-medium block mb-1">Name *</label>
                <input
                  value={editing.name}
                  onChange={e => update('name', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Consumable name"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Type</label>
                <select
                  value={editing.type}
                  onChange={e => update('type', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none bg-card"
                >
                  {CONSUMABLE_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Description</label>
                <textarea
                  value={editing.description}
                  onChange={e => update('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y"
                  placeholder="Detailed description..."
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">URL</label>
                <input
                  value={editing.url}
                  onChange={e => update('url', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Image URL</label>
                <input
                  value={editing.image}
                  onChange={e => update('image', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="Image URL"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Price</label>
                  <input
                    value={editing.price}
                    onChange={e => update('price', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="e.g. 320€"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Lifespan</label>
                  <input
                    value={editing.lifespan}
                    onChange={e => update('lifespan', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="e.g. 6-12 months"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.active}
                  onChange={e => update('active', e.target.checked)}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>

          {/* Right Column - Compatible Models */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-5 space-y-3" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-medium">Compatible Models</h3>
              <p className="text-xs text-muted-foreground">Select which products this consumable works with.</p>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {products.map(p => (
                  <label key={p.id} className="flex items-center gap-3 cursor-pointer px-2 py-1.5 rounded-lg hover:bg-muted/30 transition-colors">
                    <input
                      type="checkbox"
                      checked={editing.compatibleModelIds.includes(p.id)}
                      onChange={() => toggleCompatibleModel(p.id)}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-sm">{p.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{p.id}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={!editing.name} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:brightness-[0.92] transition-all disabled:opacity-40">
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>
    );
  }

  // ── Table View ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-2xl">Accessories & Consumables</h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} items in catalog</p>
        </div>
        <button onClick={() => setEditing(emptyConsumable())} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:brightness-[0.92] transition-all">
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search consumables..."
            className="w-full h-10 pl-10 pr-4 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-card"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none bg-card"
        >
          <option value="all">All types</option>
          {CONSUMABLE_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-card rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="hidden md:grid grid-cols-[1fr_120px_100px_80px_100px_80px_80px] gap-3 px-4 py-3 bg-[#f0ede7] text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Name</span>
          <span>Type</span>
          <span>Models</span>
          <span>Price</span>
          <span>Lifespan</span>
          <span>Active</span>
          <span>Actions</span>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Package className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">No items found</p>
          </div>
        )}

        {filtered.map(item => (
          <div
            key={item.id}
            className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_80px_100px_80px_80px] gap-3 px-4 py-3 items-center text-sm hover:bg-muted/20 transition-colors"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
          >
            <div>
              <p className="font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground truncate">{item.description.slice(0, 60)}{item.description.length > 60 ? '...' : ''}</p>
            </div>
            <div>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[item.type] || 'bg-muted text-muted-foreground'}`}>
                {getTypeLabel(item.type)}
              </span>
            </div>
            <span className="hidden md:block text-xs text-muted-foreground">{item.compatibleModelIds.length} models</span>
            <span className="hidden md:block text-sm font-semibold">{item.price || '-'}</span>
            <span className="hidden md:block text-xs text-muted-foreground">{item.lifespan || '-'}</span>
            <div className="hidden md:block">
              <button onClick={() => toggleActive(item)} className={`w-10 h-5 rounded-full transition-colors ${item.active ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => setEditing({ ...item })} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
