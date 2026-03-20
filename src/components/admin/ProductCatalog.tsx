import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  ArrowLeft,
  X,
  GripVertical,
  Image as ImageIcon,
} from 'lucide-react';
import {
  AdminProduct,
  ProductCategory,
  PRODUCT_CATEGORIES,
} from '@/lib/adminTypes';
import {
  getProducts,
  saveProduct,
  deleteProduct,
  getFeatureTags,
  addFeatureTag,
} from '@/lib/adminStorage';

const emptyProduct = (): AdminProduct => ({
  id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
  name: '',
  model: '',
  category: 'uv_led_printer',
  shortDescription: '',
  longDescription: '',
  priceRange: '',
  showPrice: true,
  images: [],
  videoUrl: '',
  featureTags: [],
  specs: [{ key: '', value: '' }],
  costPerPrint: null,
  roiSalePrice: 5,
  roiCost: 0.4,
  roiMinUnitsPerDay: 10,
  compatibleMaterials: [],
  visibleInWizard: true,
  featured: false,
  active: true,
  displayOrder: 999,
  createdAt: '',
  updatedAt: '',
});

export function ProductCatalog() {
  const [products, setProducts] = useState<AdminProduct[]>(getProducts());
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [search, setSearch] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const allTags = getFeatureTags();

  const refresh = () => setProducts(getProducts());

  const filtered = useMemo(() => {
    if (!search) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleSave = () => {
    if (!editing) return;
    saveProduct(editing);
    setEditing(null);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this product?')) {
      deleteProduct(id);
      refresh();
    }
  };

  const toggleActive = (p: AdminProduct) => {
    saveProduct({ ...p, active: !p.active, updatedAt: new Date().toISOString() });
    refresh();
  };

  const toggleFeatured = (p: AdminProduct) => {
    saveProduct({ ...p, featured: !p.featured, updatedAt: new Date().toISOString() });
    refresh();
  };

  const update = (field: keyof AdminProduct, value: unknown) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value } as AdminProduct);
  };

  // ── Edit Form ──
  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setEditing(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-display text-2xl">{editing.createdAt ? 'Edit Product' : 'New Product'}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-card rounded-lg p-5 space-y-4" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-medium">Basic Info</h3>

              <div>
                <label className="text-sm font-medium block mb-1">Name *</label>
                <input value={editing.name} onChange={e => update('name', e.target.value)} className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Product name" />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Model</label>
                <input value={editing.model} onChange={e => update('model', e.target.value)} className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Full model name" />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Category</label>
                <select value={editing.category} onChange={e => update('category', e.target.value)} className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none bg-card">
                  {PRODUCT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Short Description <span className="text-muted-foreground">({editing.shortDescription.length}/160)</span></label>
                <input value={editing.shortDescription} onChange={e => update('shortDescription', e.target.value.slice(0, 160))} className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="Brief description" />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Long Description</label>
                <textarea value={editing.longDescription} onChange={e => update('longDescription', e.target.value)} rows={5} className="w-full px-3 py-2 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y" placeholder="Detailed product description..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Price Range</label>
                  <input value={editing.priceRange} onChange={e => update('priceRange', e.target.value)} className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none" placeholder="e.g. 8.995€" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editing.showPrice} onChange={e => update('showPrice', e.target.checked)} className="accent-primary w-4 h-4" />
                    <span className="text-sm">Show price publicly</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-card rounded-lg p-5 space-y-3" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Technical Specs</h3>
                <button onClick={() => update('specs', [...editing.specs, { key: '', value: '' }])} className="text-xs text-primary hover:underline">+ Add row</button>
              </div>
              {editing.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input value={spec.key} onChange={e => { const s = [...editing.specs]; s[i] = { ...s[i], key: e.target.value }; update('specs', s); }} className="flex-1 h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" placeholder="Key" />
                  <input value={spec.value} onChange={e => { const s = [...editing.specs]; s[i] = { ...s[i], value: e.target.value }; update('specs', s); }} className="flex-1 h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" placeholder="Value" />
                  <button onClick={() => update('specs', editing.specs.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive transition-colors"><X className="h-4 w-4" /></button>
                </div>
              ))}
            </div>

            {/* ROI */}
            <div className="bg-card rounded-lg p-5 space-y-3" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-medium">ROI Configuration</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Sale price (€/unit)</label>
                  <input type="number" step="0.1" value={editing.roiSalePrice} onChange={e => update('roiSalePrice', parseFloat(e.target.value) || 0)} className="w-full h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Cost (€/unit)</label>
                  <input type="number" step="0.01" value={editing.roiCost} onChange={e => update('roiCost', parseFloat(e.target.value) || 0)} className="w-full h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Min units/day</label>
                  <input type="number" value={editing.roiMinUnitsPerDay} onChange={e => update('roiMinUnitsPerDay', parseInt(e.target.value) || 0)} className="w-full h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Images */}
            <div className="bg-card rounded-lg p-5 space-y-3" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-medium">Images</h3>
              <div className="flex gap-2">
                <input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="flex-1 h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" placeholder="Image URL" />
                <button onClick={() => { if (newImageUrl) { update('images', [...editing.images, newImageUrl]); setNewImageUrl(''); } }} className="h-9 px-3 rounded-lg bg-primary text-white text-sm hover:brightness-[0.92] transition-all">Add</button>
              </div>
              <div className="space-y-2">
                {editing.images.map((img, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#f9f7f4]">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    {img.startsWith('http') || img.startsWith('/') || img.startsWith('data:') ? (
                      <img src={img} alt="" className="w-10 h-10 object-contain rounded bg-white" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
                    )}
                    <span className="flex-1 text-xs truncate text-muted-foreground">{img}</span>
                    <button onClick={() => update('images', editing.images.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Video URL</label>
                <input value={editing.videoUrl} onChange={e => update('videoUrl', e.target.value)} className="w-full h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" placeholder="YouTube or Vimeo URL" />
              </div>
            </div>

            {/* Feature Tags */}
            <div className="bg-card rounded-lg p-5 space-y-3" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-medium">Feature Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => {
                  const selected = editing.featureTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => update('featureTags', selected ? editing.featureTags.filter(t => t !== tag) : [...editing.featureTags, tag])}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input value={newTag} onChange={e => setNewTag(e.target.value)} className="flex-1 h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" placeholder="New tag" />
                <button onClick={() => { if (newTag) { addFeatureTag(newTag); update('featureTags', [...editing.featureTags, newTag]); setNewTag(''); } }} className="h-9 px-3 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors">Add</button>
              </div>
            </div>

            {/* Materials */}
            <div className="bg-card rounded-lg p-5 space-y-3" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-medium">Compatible Materials</h3>
              <div className="flex flex-wrap gap-2">
                {editing.compatibleMaterials.map((mat, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-primary text-xs font-medium">
                    {mat}
                    <button onClick={() => update('compatibleMaterials', editing.compatibleMaterials.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newMaterial} onChange={e => setNewMaterial(e.target.value)} className="flex-1 h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" placeholder="Add material" onKeyDown={e => { if (e.key === 'Enter' && newMaterial) { update('compatibleMaterials', [...editing.compatibleMaterials, newMaterial]); setNewMaterial(''); } }} />
                <button onClick={() => { if (newMaterial) { update('compatibleMaterials', [...editing.compatibleMaterials, newMaterial]); setNewMaterial(''); } }} className="h-9 px-3 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors">Add</button>
              </div>
            </div>

            {/* Toggles */}
            <div className="bg-card rounded-lg p-5 space-y-3" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 className="font-medium">Visibility</h3>
              {[
                { key: 'active' as const, label: 'Active (visible on site)' },
                { key: 'visibleInWizard' as const, label: 'Visible in quote wizard' },
                { key: 'featured' as const, label: 'Featured product' },
              ].map(toggle => (
                <label key={toggle.key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={editing[toggle.key] as boolean} onChange={e => update(toggle.key, e.target.checked)} className="accent-primary w-4 h-4" />
                  <span className="text-sm">{toggle.label}</span>
                </label>
              ))}
              <div>
                <label className="text-sm font-medium block mb-1">Display Order</label>
                <input type="number" value={editing.displayOrder} onChange={e => update('displayOrder', parseInt(e.target.value) || 0)} className="w-24 h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <button onClick={() => setEditing(null)} className="px-5 py-2.5 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={!editing.name} className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:brightness-[0.92] transition-all disabled:opacity-40">Save Product</button>
        </div>
      </div>
    );
  }

  // ── Table View ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-2xl">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">{products.length} products in catalog</p>
        </div>
        <button onClick={() => setEditing(emptyProduct())} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:brightness-[0.92] transition-all">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full h-10 pl-10 pr-4 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-card" />
      </div>

      <div className="bg-card rounded-lg overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="hidden md:grid grid-cols-[48px_1fr_120px_100px_80px_80px_80px] gap-3 px-4 py-3 bg-[#f0ede7] text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span></span>
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Active</span>
          <span>Featured</span>
          <span>Actions</span>
        </div>

        {filtered.map(product => (
          <div
            key={product.id}
            className="grid grid-cols-1 md:grid-cols-[48px_1fr_120px_100px_80px_80px_80px] gap-3 px-4 py-3 items-center text-sm hover:bg-muted/20 transition-colors"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
          >
            <div className="w-10 h-10 rounded bg-[#f9f7f4] flex items-center justify-center overflow-hidden">
              {product.images[0] ? (
                <img src={product.images[0]} alt="" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground truncate">{product.model}</p>
            </div>
            <span className="hidden md:block text-xs text-muted-foreground">{PRODUCT_CATEGORIES.find(c => c.value === product.category)?.label}</span>
            <span className="hidden md:block text-price text-sm font-semibold">{product.priceRange || '-'}</span>
            <div className="hidden md:block">
              <button onClick={() => toggleActive(product)} className={`w-10 h-5 rounded-full transition-colors ${product.active ? 'bg-primary' : 'bg-muted'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${product.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="hidden md:block">
              <button onClick={() => toggleFeatured(product)} className={`transition-colors ${product.featured ? 'text-yellow-500' : 'text-muted-foreground/30 hover:text-yellow-500'}`}>
                <Star className="h-4 w-4" fill={product.featured ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <button onClick={() => setEditing({ ...product })} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => handleDelete(product.id)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
