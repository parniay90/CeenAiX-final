import React, { useState } from 'react';
import { X, Plus, Trash2, ChevronRight, GripVertical, FileText, Loader, CheckCircle, Eye } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

interface FieldItem {
  id: string;
  label: string;
  category: string;
}

interface CanvasField extends FieldItem {
  uid: string;
  aggregate?: string;
}

const FIELD_TREE: { category: string; fields: FieldItem[] }[] = [
  {
    category: 'Member',
    fields: [
      { id: 'mbr_id', label: 'Member ID', category: 'Member' },
      { id: 'mbr_name', label: 'Member Name', category: 'Member' },
      { id: 'mbr_plan', label: 'Plan', category: 'Member' },
      { id: 'mbr_dob', label: 'Date of Birth', category: 'Member' },
      { id: 'mbr_emirate', label: 'Emirate', category: 'Member' },
      { id: 'mbr_risk_tier', label: 'Risk Tier', category: 'Member' },
    ],
  },
  {
    category: 'Claims',
    fields: [
      { id: 'clm_id', label: 'Claim ID', category: 'Claims' },
      { id: 'clm_date', label: 'Claim Date', category: 'Claims' },
      { id: 'clm_amount', label: 'Claim Amount', category: 'Claims' },
      { id: 'clm_status', label: 'Status', category: 'Claims' },
      { id: 'clm_denial', label: 'Denial Code', category: 'Claims' },
      { id: 'clm_specialty', label: 'Specialty', category: 'Claims' },
      { id: 'clm_icd', label: 'ICD-10 Code', category: 'Claims' },
    ],
  },
  {
    category: 'Provider',
    fields: [
      { id: 'prv_id', label: 'Provider ID', category: 'Provider' },
      { id: 'prv_name', label: 'Provider Name', category: 'Provider' },
      { id: 'prv_dha', label: 'DHA License', category: 'Provider' },
      { id: 'prv_tier', label: 'Network Tier', category: 'Provider' },
      { id: 'prv_score', label: 'Performance Score', category: 'Provider' },
    ],
  },
  {
    category: 'Financial',
    fields: [
      { id: 'fin_premium', label: 'Premium Paid', category: 'Financial' },
      { id: 'fin_copay', label: 'Co-pay Collected', category: 'Financial' },
      { id: 'fin_loss_ratio', label: 'Loss Ratio', category: 'Financial' },
      { id: 'fin_ibnr', label: 'IBNR Reserve', category: 'Financial' },
    ],
  },
];

const AGGREGATES = ['None', 'SUM', 'COUNT', 'AVG', 'MIN', 'MAX'];

export default function CustomReportBuilder({ onClose, onSuccess }: Props) {
  const [reportName, setReportName] = useState('');
  const [canvasFields, setCanvasFields] = useState<CanvasField[]>([]);
  const [expandedCats, setExpandedCats] = useState<string[]>(['Claims', 'Member']);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');
  const [step, setStep] = useState<'build' | 'generating' | 'done'>('build');
  const [progressPct, setProgressPct] = useState(0);

  function toggleCat(cat: string) {
    setExpandedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  }

  function addField(field: FieldItem) {
    if (canvasFields.find(f => f.id === field.id)) return;
    setCanvasFields(prev => [...prev, { ...field, uid: `${field.id}_${Date.now()}`, aggregate: 'None' }]);
  }

  function removeField(uid: string) {
    setCanvasFields(prev => prev.filter(f => f.uid !== uid));
    if (activeField === uid) setActiveField(null);
  }

  function updateAggregate(uid: string, agg: string) {
    setCanvasFields(prev => prev.map(f => f.uid === uid ? { ...f, aggregate: agg } : f));
  }

  function moveField(uid: string, dir: 'up' | 'down') {
    const idx = canvasFields.findIndex(f => f.uid === uid);
    if (idx < 0) return;
    const newArr = [...canvasFields];
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newArr.length) return;
    [newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]];
    setCanvasFields(newArr);
  }

  const activeCanvasField = canvasFields.find(f => f.uid === activeField);

  const filteredTree = FIELD_TREE.map(cat => ({
    ...cat,
    fields: cat.fields.filter(f => !filterText || f.label.toLowerCase().includes(filterText.toLowerCase())),
  })).filter(cat => cat.fields.length > 0);

  async function handleBuild() {
    if (!reportName.trim() || canvasFields.length === 0) return;
    setStep('generating');
    let p = 0;
    const interval = setInterval(() => {
      p += 4;
      setProgressPct(Math.min(p, 98));
      if (p >= 100) {
        clearInterval(interval);
        setProgressPct(100);
        setTimeout(() => setStep('done'), 300);
      }
    }, 80);
  }

  const CATEGORY_COLORS: Record<string, string> = {
    'Member': '#1E40AF', 'Claims': '#1E3A5F', 'Provider': '#4C1D95', 'Financial': '#065F46',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: '#fff', borderRadius: 16, width: 860, height: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 12, background: '#FAFAFA' }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={17} color="#1E3A5F" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Custom Report Builder</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Select fields, define aggregations, preview and generate</div>
          </div>
          <input
            placeholder="Report name..."
            value={reportName}
            onChange={e => setReportName(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 13, color: '#0F172A', outline: 'none', width: 200 }}
          />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {step === 'build' && (
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Left: Field Tree */}
            <div style={{ width: 230, borderRight: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9' }}>
                <input
                  placeholder="Search fields..."
                  value={filterText}
                  onChange={e => setFilterText(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: '1px solid #E2E8F0', fontSize: 12, color: '#0F172A', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
                />
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                {filteredTree.map(cat => (
                  <div key={cat.category}>
                    <button
                      onClick={() => toggleCat(cat.category)}
                      style={{ width: '100%', padding: '7px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, textAlign: 'left' }}
                    >
                      <ChevronRight size={13} color="#94A3B8" style={{ transform: expandedCats.includes(cat.category) ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: CATEGORY_COLORS[cat.category] || '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{cat.category}</span>
                    </button>
                    {expandedCats.includes(cat.category) && cat.fields.map(field => {
                      const added = canvasFields.some(f => f.id === field.id);
                      return (
                        <button
                          key={field.id}
                          onClick={() => addField(field)}
                          style={{
                            width: '100%', padding: '6px 14px 6px 28px', background: added ? '#EFF6FF' : 'none',
                            border: 'none', cursor: added ? 'default' : 'pointer', display: 'flex',
                            alignItems: 'center', gap: 6, textAlign: 'left',
                          }}
                        >
                          <span style={{ fontSize: 12, color: added ? '#93C5FD' : '#374151' }}>{field.label}</span>
                          {!added && <Plus size={11} color="#94A3B8" style={{ marginLeft: 'auto' }} />}
                          {added && <span style={{ marginLeft: 'auto', fontSize: 10, color: '#3B82F6' }}>Added</span>}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Center: Canvas */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #F1F5F9' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Report Columns</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>({canvasFields.length} selected)</span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
                {canvasFields.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#CBD5E1', gap: 8 }}>
                    <Plus size={28} />
                    <div style={{ fontSize: 13 }}>Click fields from the left panel to add columns</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {canvasFields.map((f, i) => (
                      <div
                        key={f.uid}
                        onClick={() => setActiveField(f.uid)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px',
                          borderRadius: 8, border: activeField === f.uid ? `2px solid ${CATEGORY_COLORS[f.category] || '#1E3A5F'}` : '1px solid #E2E8F0',
                          background: activeField === f.uid ? '#F8FAFC' : '#fff', cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                      >
                        <GripVertical size={14} color="#CBD5E1" />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{f.label}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8' }}>{f.category}</div>
                        </div>
                        {f.aggregate && f.aggregate !== 'None' && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#1E3A5F', background: '#DBEAFE', borderRadius: 4, padding: '2px 6px' }}>{f.aggregate}</span>
                        )}
                        <div style={{ display: 'flex', gap: 2 }}>
                          <button onClick={e => { e.stopPropagation(); moveField(f.uid, 'up'); }} disabled={i === 0}
                            style={{ background: 'none', border: 'none', cursor: i === 0 ? 'not-allowed' : 'pointer', color: '#CBD5E1', padding: 2, fontSize: 12 }}>▲</button>
                          <button onClick={e => { e.stopPropagation(); moveField(f.uid, 'down'); }} disabled={i === canvasFields.length - 1}
                            style={{ background: 'none', border: 'none', cursor: i === canvasFields.length - 1 ? 'not-allowed' : 'pointer', color: '#CBD5E1', padding: 2, fontSize: 12 }}>▼</button>
                          <button onClick={e => { e.stopPropagation(); removeField(f.uid); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FDA4AF', padding: 2 }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Settings panel */}
            <div style={{ width: 220, display: 'flex', flexDirection: 'column', background: '#FAFAFA' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Column Settings</div>
              </div>
              <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
                {activeCanvasField ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>FIELD</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{activeCanvasField.label}</div>
                      <div style={{ fontSize: 11, color: CATEGORY_COLORS[activeCanvasField.category] || '#64748B', marginTop: 2 }}>{activeCanvasField.category}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6 }}>AGGREGATION</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {AGGREGATES.map(agg => (
                          <button
                            key={agg}
                            onClick={() => updateAggregate(activeCanvasField.uid, agg)}
                            style={{
                              padding: '6px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer', textAlign: 'left',
                              background: activeCanvasField.aggregate === agg ? '#EFF6FF' : '#fff',
                              color: activeCanvasField.aggregate === agg ? '#1E3A5F' : '#475569',
                              border: activeCanvasField.aggregate === agg ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                            }}
                          >{agg}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: '#CBD5E1', textAlign: 'center', marginTop: 40 }}>
                    Select a column to configure
                  </div>
                )}
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  style={{ width: '100%', padding: '8px 0', background: '#F0F9FF', color: '#0284C7', border: '1px solid #BAE6FD', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Eye size={13} /> Preview (5 rows)
                </button>
                <button
                  onClick={handleBuild}
                  disabled={!reportName.trim() || canvasFields.length === 0}
                  style={{
                    width: '100%', padding: '9px 0', background: (!reportName.trim() || canvasFields.length === 0) ? '#CBD5E1' : '#1E3A5F', color: '#fff',
                    border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: (!reportName.trim() || canvasFields.length === 0) ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <FileText size={14} /> Build Report
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'generating' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <svg width={80} height={80} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={40} cy={40} r={34} fill="none" stroke="#E2E8F0" strokeWidth={5} />
                <circle cx={40} cy={40} r={34} fill="none" stroke="#1E3A5F" strokeWidth={5}
                  strokeDasharray={`${(progressPct / 100) * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                  strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.15s ease' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#1E3A5F', fontFamily: 'DM Mono, monospace' }}>
                {progressPct}%
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A', marginBottom: 4 }}>Building Your Report</div>
              <div style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                <Loader size={13} style={{ animation: 'spin 1s linear infinite' }} />
                Processing {canvasFields.length} columns across all records...
              </div>
            </div>
            <div style={{ width: 320, background: '#F1F5F9', borderRadius: 4, height: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #1E3A5F, #2563EB)', borderRadius: 4, width: `${progressPct}%`, transition: 'width 0.15s ease' }} />
            </div>
          </div>
        )}

        {step === 'done' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ECFDF5', border: '2px solid #6EE7B7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={30} color="#059669" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{reportName || 'Custom Report'} Ready</div>
              <div style={{ fontSize: 13, color: '#64748B' }}>{canvasFields.length} columns exported as Excel • 2.3 MB</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { onSuccess(`Custom report "${reportName || 'Untitled'}" generated successfully`); onClose(); }}
                style={{ padding: '10px 24px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                Download Report
              </button>
              <button onClick={onClose} style={{ padding: '10px 20px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
