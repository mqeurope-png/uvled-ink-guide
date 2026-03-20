import { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ArrowLeft,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Power,
  Check,
} from 'lucide-react';
import {
  RecommendationRule,
  RuleCondition,
  RULE_FIELDS,
  RULE_OPERATORS,
  RuleOperator,
} from '@/lib/adminTypes';
import {
  getRules,
  saveRule,
  deleteRule,
  toggleRule,
  getProducts,
} from '@/lib/adminStorage';

// ── Helpers ──

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function emptyRule(): RecommendationRule {
  return {
    id: generateId(),
    name: '',
    conditions: [{ field: 'category', operator: 'equals', value: '' }],
    recommendedProductIds: [],
    priority: 10,
    enabled: true,
    createdAt: '',
    updatedAt: '',
  };
}

function emptyCondition(): RuleCondition {
  return { field: 'category', operator: 'equals', value: '' };
}

function evaluateCondition(condition: RuleCondition, testValues: Record<string, string>): boolean {
  const actual = testValues[condition.field] || '';
  const expected = condition.value;
  switch (condition.operator) {
    case 'equals':
      return actual.toLowerCase() === expected.toLowerCase();
    case 'not_equals':
      return actual.toLowerCase() !== expected.toLowerCase();
    case 'contains':
      return actual.toLowerCase().includes(expected.toLowerCase());
    case 'greater_than':
      return parseFloat(actual) > parseFloat(expected);
    case 'less_than':
      return parseFloat(actual) < parseFloat(expected);
    case 'in': {
      const list = expected.split(',').map(s => s.trim().toLowerCase());
      return list.includes(actual.toLowerCase());
    }
    default:
      return false;
  }
}

function ruleMatches(rule: RecommendationRule, testValues: Record<string, string>): boolean {
  if (!rule.enabled) return false;
  return rule.conditions.every(c => evaluateCondition(c, testValues));
}

// ── Component ──

export function RecommendationRules() {
  const [rules, setRules] = useState<RecommendationRule[]>(getRules());
  const [editing, setEditing] = useState<RecommendationRule | null>(null);
  const [showTest, setShowTest] = useState(false);
  const [testValues, setTestValues] = useState<Record<string, string>>({});

  const products = useMemo(() => getProducts(), []);
  const productMap = useMemo(() => {
    const map: Record<string, string> = {};
    products.forEach(p => { map[p.id] = p.name; });
    return map;
  }, [products]);

  const refresh = () => setRules(getRules());

  const handleSave = () => {
    if (!editing || !editing.name) return;
    saveRule(editing);
    setEditing(null);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this rule? This action cannot be undone.')) {
      deleteRule(id);
      refresh();
    }
  };

  const handleToggle = (id: string) => {
    toggleRule(id);
    refresh();
  };

  const updateEditing = (partial: Partial<RecommendationRule>) => {
    if (!editing) return;
    setEditing({ ...editing, ...partial });
  };

  const updateCondition = (index: number, partial: Partial<RuleCondition>) => {
    if (!editing) return;
    const conditions = [...editing.conditions];
    conditions[index] = { ...conditions[index], ...partial };
    setEditing({ ...editing, conditions });
  };

  const addCondition = () => {
    if (!editing) return;
    setEditing({ ...editing, conditions: [...editing.conditions, emptyCondition()] });
  };

  const removeCondition = (index: number) => {
    if (!editing) return;
    setEditing({ ...editing, conditions: editing.conditions.filter((_, i) => i !== index) });
  };

  const toggleProductSelection = (productId: string) => {
    if (!editing) return;
    const ids = editing.recommendedProductIds.includes(productId)
      ? editing.recommendedProductIds.filter(id => id !== productId)
      : [...editing.recommendedProductIds, productId];
    setEditing({ ...editing, recommendedProductIds: ids });
  };

  // ── Test results ──

  const testResults = useMemo(() => {
    if (!showTest) return [];
    return rules
      .filter(r => ruleMatches(r, testValues))
      .sort((a, b) => b.priority - a.priority);
  }, [rules, testValues, showTest]);

  // ── Edit Form ──

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setEditing(null)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-display text-2xl">
            {editing.createdAt ? 'Edit Rule' : 'New Rule'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Rule definition */}
          <div className="space-y-4">
            <div
              className="bg-card rounded-lg p-5 space-y-4"
              style={{ border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <h3 className="font-medium">Rule Info</h3>

              <div>
                <label className="text-sm font-medium block mb-1">Rule Name *</label>
                <input
                  value={editing.name}
                  onChange={e => updateEditing({ name: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  placeholder="e.g. Small UV printers for beginners"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Priority</label>
                  <input
                    type="number"
                    value={editing.priority}
                    onChange={e => updateEditing({ priority: parseInt(e.target.value) || 0 })}
                    className="w-full h-10 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    min={0}
                  />
                  <span className="text-xs text-muted-foreground mt-1 block">Higher = more important</span>
                </div>
                <div className="flex items-end pb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.enabled}
                      onChange={e => updateEditing({ enabled: e.target.checked })}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-sm">Enabled</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div
              className="bg-card rounded-lg p-5 space-y-4"
              style={{ border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Conditions</h3>
                <button
                  onClick={addCondition}
                  className="text-xs text-primary hover:underline"
                >
                  + Add condition
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                All conditions must match (AND logic) for this rule to trigger.
              </p>

              {editing.conditions.map((condition, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={condition.field}
                    onChange={e => updateCondition(i, { field: e.target.value })}
                    className="h-9 px-2 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none bg-card flex-shrink-0"
                  >
                    {RULE_FIELDS.map(f => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>

                  <select
                    value={condition.operator}
                    onChange={e => updateCondition(i, { operator: e.target.value as RuleOperator })}
                    className="h-9 px-2 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary outline-none bg-card w-24 flex-shrink-0"
                  >
                    {RULE_OPERATORS.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>

                  <input
                    value={condition.value}
                    onChange={e => updateCondition(i, { value: e.target.value })}
                    className="flex-1 h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Value"
                  />

                  <button
                    onClick={() => removeCondition(i)}
                    disabled={editing.conditions.length <= 1}
                    className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product selection */}
          <div className="space-y-4">
            <div
              className="bg-card rounded-lg p-5 space-y-3"
              style={{ border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <h3 className="font-medium">Recommended Products</h3>
              <p className="text-xs text-muted-foreground">
                Select which products to recommend when this rule matches.
              </p>

              <div className="space-y-2 max-h-[420px] overflow-y-auto">
                {products.filter(p => p.active).map(product => {
                  const selected = editing.recommendedProductIds.includes(product.id);
                  return (
                    <label
                      key={product.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                        selected
                          ? 'bg-[#fdf0eb] border border-primary/30'
                          : 'hover:bg-muted/30 border border-transparent'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleProductSelection(product.id)}
                        className="accent-primary w-4 h-4 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{product.model}</p>
                      </div>
                    </label>
                  );
                })}
              </div>

              {editing.recommendedProductIds.length > 0 && (
                <div className="pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <p className="text-xs text-muted-foreground mb-2">
                    {editing.recommendedProductIds.length} product{editing.recommendedProductIds.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {editing.recommendedProductIds.map(id => (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-primary text-xs font-medium"
                      >
                        {productMap[id] || id}
                        <button onClick={() => toggleProductSelection(id)}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-3 pt-4"
          style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}
        >
          <button
            onClick={() => setEditing(null)}
            className="px-5 py-2.5 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!editing.name}
            className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:brightness-[0.92] transition-all disabled:opacity-40"
          >
            Save Rule
          </button>
        </div>
      </div>
    );
  }

  // ── List View ──

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display text-2xl">Recommendation Rules</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {rules.length} rule{rules.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTest(!showTest)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showTest
                ? 'bg-[#fdf0eb] text-primary border-2 border-primary/30'
                : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            <FlaskConical className="h-4 w-4" />
            Test Rules
          </button>
          <button
            onClick={() => setEditing(emptyRule())}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:brightness-[0.92] transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Rule
          </button>
        </div>
      </div>

      {/* Test Area */}
      {showTest && (
        <div
          className="bg-[#fdf0eb] rounded-lg p-5 space-y-4"
          style={{ border: '1px solid rgba(232,82,42,0.15)' }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-primary">Rule Tester</h3>
            <button
              onClick={() => { setShowTest(false); setTestValues({}); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Set field values to simulate wizard state and see which rules match.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {RULE_FIELDS.map(field => (
              <div key={field.value}>
                <label className="text-xs font-medium block mb-1">{field.label}</label>
                <input
                  value={testValues[field.value] || ''}
                  onChange={e =>
                    setTestValues(prev => ({ ...prev, [field.value]: e.target.value }))
                  }
                  className="w-full h-9 px-3 rounded-lg text-sm border border-[rgba(0,0,0,0.08)] focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                  placeholder={field.label}
                />
              </div>
            ))}
          </div>

          {/* Test Results */}
          <div
            className="bg-white rounded-lg p-4 space-y-3"
            style={{ border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <h4 className="text-sm font-medium">
              Matching Rules ({testResults.length})
            </h4>
            {testResults.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No rules match the current test values. Try adjusting the fields above.
              </p>
            ) : (
              <div className="space-y-2">
                {testResults.map(rule => (
                  <div
                    key={rule.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#fdf0eb]"
                  >
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{rule.name}</span>
                    </div>
                    <span className="text-xs font-medium text-primary bg-white px-2 py-0.5 rounded-full">
                      Priority {rule.priority}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {rule.recommendedProductIds.map(id => (
                        <span
                          key={id}
                          className="text-xs bg-primary text-white px-2 py-0.5 rounded-full"
                        >
                          {productMap[id] || id}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rules List */}
      {rules.length === 0 ? (
        <div
          className="bg-card rounded-lg p-10 text-center"
          style={{ border: '1px solid rgba(0,0,0,0.08)' }}
        >
          <p className="text-muted-foreground text-sm">
            No recommendation rules yet. Click "Add Rule" to create your first one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {rules
            .sort((a, b) => b.priority - a.priority)
            .map(rule => (
              <div
                key={rule.id}
                className={`bg-card rounded-lg p-5 transition-opacity ${!rule.enabled ? 'opacity-50' : ''}`}
                style={{ border: '1px solid rgba(0,0,0,0.08)' }}
              >
                <div className="flex items-start gap-4">
                  {/* Toggle */}
                  <button
                    onClick={() => handleToggle(rule.id)}
                    className={`mt-0.5 w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                      rule.enabled ? 'bg-primary' : 'bg-muted'
                    }`}
                    title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        rule.enabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-medium text-sm">{rule.name}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#fdf0eb] text-primary">
                        Priority {rule.priority}
                      </span>
                    </div>

                    {/* Conditions as pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {rule.conditions.map((c, i) => {
                        const fieldLabel =
                          RULE_FIELDS.find(f => f.value === c.field)?.label || c.field;
                        const opLabel =
                          RULE_OPERATORS.find(o => o.value === c.operator)?.label || c.operator;
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs"
                          >
                            <span className="font-medium">{fieldLabel}</span>
                            <span className="text-muted-foreground">{opLabel}</span>
                            <span className="font-medium text-primary">{c.value}</span>
                          </span>
                        );
                      })}
                    </div>

                    {/* Recommended products */}
                    {rule.recommendedProductIds.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs text-muted-foreground">Recommends:</span>
                        {rule.recommendedProductIds.map(id => (
                          <span
                            key={id}
                            className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent text-primary text-xs font-medium"
                          >
                            {productMap[id] || id}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setEditing({ ...rule })}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                      title="Edit rule"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete rule"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
