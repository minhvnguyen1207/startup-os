import { useState, useMemo } from 'react'

const DEFAULT_COSTS = {
  fobPerKg: 4.50,
  freightPerKg: 0.85,
  brokerPerShipment: 400,
  avgShipmentKg: 200,
  dutyPct: 0,
  gstPct: 10,
  threePlPerKg: 1.20,
  packagingPerKg: 2.50,
  shopifyFeePct: 2,
  shippingPerOrder: 9.00,
  avgOrderGrams: 500,
}

const DEFAULT_BUDGET = [
  { id: 'setup',     label: 'Company registration + legal',  budgeted: 2000,  spent: 0 },
  { id: 'inventory', label: 'First inventory order',          budgeted: 15000, spent: 0 },
  { id: 'brand',     label: 'Branding + packaging design',    budgeted: 4000,  spent: 0 },
  { id: 'photo',     label: 'Vietnam photography trip',       budgeted: 3500,  spent: 0 },
  { id: 'shopify',   label: 'Shopify setup + apps',           budgeted: 1200,  spent: 0 },
  { id: 'marketing', label: 'Marketing — first 3 months',     budgeted: 4500,  spent: 0 },
  { id: 'contingency', label: 'Contingency buffer',           budgeted: 3000,  spent: 0 },
]

const DEFAULT_FORECAST = {
  startOrders: 20,
  growthPct: 15,
  avgOrderValue: 45,
  fixedMonthly: 500,
  launchMonthOffset: 0, // months from now
}

function FinRow({ label, value, onChange, suffix = '', prefix = '$', step = '0.01', hint }) {
  return (
    <div className="fin-row">
      <div>
        <div className="fin-row-label">{label}</div>
        {hint && <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {prefix && <span className="fin-input-suffix">{prefix}</span>}
        <input
          type="number" step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="fin-input"
        />
        {suffix && <span className="fin-input-suffix">{suffix}</span>}
      </div>
    </div>
  )
}

// ─── COSTS TAB ────────────────────────────────────────────────────────────────
function CostsTab({ financial, setFinancial }) {
  const c = { ...DEFAULT_COSTS, ...financial.costs }

  function upd(key, val) {
    setFinancial(f => ({ ...f, costs: { ...c, [key]: val } }))
  }

  const brokerPerKg  = c.avgShipmentKg ? c.brokerPerShipment / c.avgShipmentKg : 0
  const base         = c.fobPerKg + c.freightPerKg + brokerPerKg
  const dutyAmt      = base * (c.dutyPct / 100)
  const afterDuty    = base + dutyAmt
  const gstAmt       = afterDuty * (c.gstPct / 100)
  const landed       = afterDuty + gstAmt + c.threePlPerKg + c.packagingPerKg

  const orderKg      = c.avgOrderGrams / 1000
  const rawCost      = landed * orderKg
  const shopifyFee   = (c.avgOrderValue || 0) * (c.shopifyFeePct / 100)
  const grossProfit  = (c.avgOrderValue || 0) - rawCost - shopifyFee - c.shippingPerOrder
  const margin       = c.avgOrderValue ? (grossProfit / c.avgOrderValue * 100) : 0

  return (
    <div>
      <div className="fin-card">
        <div className="fin-card-header"><span className="fin-card-title">Landed cost inputs · per kg</span></div>
        <div className="fin-card-body">
          <FinRow label="FOB price / kg"         value={c.fobPerKg}         onChange={v => upd('fobPerKg', v)}         hint="What you pay the farm in Vietnam" />
          <FinRow label="Sea freight / kg"        value={c.freightPerKg}     onChange={v => upd('freightPerKg', v)} />
          <FinRow label="Customs broker / shipment" value={c.brokerPerShipment} onChange={v => upd('brokerPerShipment', v)} hint="~$300–500 per shipment" />
          <FinRow label="Avg shipment size"        value={c.avgShipmentKg}   onChange={v => upd('avgShipmentKg', v)} prefix="" suffix="kg" step="1" />
          <FinRow label="Import duty"              value={c.dutyPct}         onChange={v => upd('dutyPct', v)}         prefix="" suffix="%" hint="Currently 0% for coffee into AU" />
          <FinRow label="GST"                      value={c.gstPct}          onChange={v => upd('gstPct', v)}          prefix="" suffix="%" />
          <FinRow label="3PL warehousing / kg"     value={c.threePlPerKg}    onChange={v => upd('threePlPerKg', v)} />
          <FinRow label="Packaging / kg"           value={c.packagingPerKg}  onChange={v => upd('packagingPerKg', v)} hint="Bag + valve + label amortised" />
        </div>
      </div>

      <div className="fin-result">
        <div className="fin-result-label">Landed cost per kg</div>
        <div className="fin-result-value">${landed.toFixed(2)}</div>
        <div className="fin-result-grid">
          {[
            { label: '250g retail @ 4×', value: `$${(landed * 0.25 * 4).toFixed(2)}` },
            { label: '500g retail @ 4×', value: `$${(landed * 0.5  * 4).toFixed(2)}` },
            { label: '1kg wholesale @ 2×', value: `$${(landed * 2).toFixed(2)}` },
          ].map((item, i) => (
            <div key={i}>
              <div className="fin-result-item-label">{item.label}</div>
              <div className="fin-result-item-value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="fin-card">
        <div className="fin-card-header"><span className="fin-card-title">Unit economics · per order</span></div>
        <div className="fin-card-body">
          <FinRow label="Average order value"      value={c.avgOrderValue || 45} onChange={v => upd('avgOrderValue', v)} />
          <FinRow label="Avg order size"           value={c.avgOrderGrams}       onChange={v => upd('avgOrderGrams', v)} prefix="" suffix="g" step="50" />
          <FinRow label="Shopify transaction fee"  value={c.shopifyFeePct}       onChange={v => upd('shopifyFeePct', v)} prefix="" suffix="%" />
          <FinRow label="Shipping to customer"     value={c.shippingPerOrder}    onChange={v => upd('shippingPerOrder', v)} />
        </div>
      </div>

      <div className="fin-result">
        <div className="fin-result-label">Gross profit per order</div>
        <div className="fin-result-value" style={{ color: grossProfit > 0 ? 'var(--text-primary)' : 'var(--danger)' }}>
          ${grossProfit.toFixed(2)}
        </div>
        <div className="fin-result-grid">
          {[
            { label: 'Gross margin', value: `${margin.toFixed(1)}%` },
            { label: 'Product cost', value: `$${rawCost.toFixed(2)}` },
            { label: 'Fees + shipping', value: `$${(shopifyFee + c.shippingPerOrder).toFixed(2)}` },
          ].map((item, i) => (
            <div key={i}>
              <div className="fin-result-item-label">{item.label}</div>
              <div className="fin-result-item-value" style={{ color: i === 0 && margin > 0 ? 'var(--green)' : 'var(--accent)' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── BUDGET TAB ───────────────────────────────────────────────────────────────
function BudgetTab({ financial, setFinancial }) {
  const budget = financial.budget?.length ? financial.budget : DEFAULT_BUDGET

  function updBudget(id, key, val) {
    setFinancial(f => ({
      ...f,
      budget: (f.budget || DEFAULT_BUDGET).map(b => b.id === id ? { ...b, [key]: val } : b)
    }))
  }

  const totalBudgeted = budget.reduce((s, b) => s + (parseFloat(b.budgeted) || 0), 0)
  const totalSpent    = budget.reduce((s, b) => s + (parseFloat(b.spent) || 0), 0)
  const overallPct    = totalBudgeted ? Math.min(100, Math.round(totalSpent / totalBudgeted * 100)) : 0

  return (
    <div>
      <div className="fin-result" style={{ marginBottom: 16 }}>
        <div className="fin-result-label">Total invested so far</div>
        <div className="fin-result-value">${totalSpent.toLocaleString()}</div>
        <div className="fin-result-grid">
          <div>
            <div className="fin-result-item-label">Budget allocated</div>
            <div className="fin-result-item-value">${totalBudgeted.toLocaleString()}</div>
          </div>
          <div>
            <div className="fin-result-item-label">Remaining</div>
            <div className="fin-result-item-value" style={{ color: totalBudgeted - totalSpent >= 0 ? 'var(--green)' : 'var(--danger)' }}>
              ${Math.abs(totalBudgeted - totalSpent).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="fin-result-item-label">Used</div>
            <div className="fin-result-item-value">{overallPct}%</div>
          </div>
        </div>
      </div>

      <div className="fin-card">
        <div className="fin-card-header">
          <span className="fin-card-title">Startup budget tracker</span>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Edit budget &amp; actual spent</span>
        </div>
        <div style={{ padding: 0 }}>
          {budget.map(item => {
            const pct  = item.budgeted ? Math.min(100, Math.round((item.spent / item.budgeted) * 100)) : 0
            const over = parseFloat(item.spent) > parseFloat(item.budgeted)
            return (
              <div key={item.id} className="fin-budget-row">
                <div className="fin-budget-top">
                  <span className="fin-budget-label">{item.label}</span>
                  <span className="fin-budget-amounts" style={{ color: over ? 'var(--danger)' : undefined }}>
                    ${(parseFloat(item.spent)||0).toLocaleString()} / ${(parseFloat(item.budgeted)||0).toLocaleString()}
                  </span>
                </div>
                <div className="fin-budget-bar">
                  <div className="fin-budget-bar-fill" style={{ width: `${pct}%`, background: over ? 'var(--danger)' : 'var(--accent)' }} />
                </div>
                <div className="fin-budget-inputs">
                  <input type="number" className="fin-input" style={{ width: '100%', textAlign: 'left' }}
                    placeholder="Budgeted $" value={item.budgeted}
                    onChange={e => updBudget(item.id, 'budgeted', parseFloat(e.target.value) || 0)} />
                  <input type="number" className="fin-input" style={{ width: '100%', textAlign: 'left' }}
                    placeholder="Actual spent $" value={item.spent}
                    onChange={e => updBudget(item.id, 'spent', parseFloat(e.target.value) || 0)} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── FORECAST TAB ─────────────────────────────────────────────────────────────
function ForecastTab({ financial, setFinancial }) {
  const f = { ...DEFAULT_FORECAST, ...financial.forecast }

  function upd(key, val) {
    setFinancial(fin => ({ ...fin, forecast: { ...f, [key]: val } }))
  }

  const costs  = { ...DEFAULT_COSTS, ...financial.costs }
  const orderKg     = (costs.avgOrderGrams || 500) / 1000
  const brokerPerKg = costs.avgShipmentKg ? costs.brokerPerShipment / costs.avgShipmentKg : 0
  const base        = costs.fobPerKg + costs.freightPerKg + brokerPerKg
  const afterDuty   = base * (1 + costs.dutyPct / 100)
  const landed      = afterDuty * (1 + costs.gstPct / 100) + costs.threePlPerKg + costs.packagingPerKg
  const shopifyFee  = f.avgOrderValue * (costs.shopifyFeePct / 100)
  const varCostPerOrder = landed * orderKg + shopifyFee + costs.shippingPerOrder
  const grossMarginPct  = f.avgOrderValue ? (f.avgOrderValue - varCostPerOrder) / f.avgOrderValue : 0
  const breakEvenRevenue = grossMarginPct > 0 ? f.fixedMonthly / grossMarginPct : 0
  const breakEvenOrders  = f.avgOrderValue ? Math.ceil(breakEvenRevenue / f.avgOrderValue) : 0

  // 12 month projection
  const months = useMemo(() => {
    const rows = []
    let orders = f.startOrders
    let cumRevenue = 0
    for (let i = 0; i < 12; i++) {
      const revenue  = Math.round(orders * f.avgOrderValue)
      const varCosts = Math.round(orders * varCostPerOrder)
      const profit   = revenue - varCosts - f.fixedMonthly
      cumRevenue += revenue
      rows.push({ month: i + 1, orders: Math.round(orders), revenue, varCosts, profit, cumRevenue })
      orders = orders * (1 + f.growthPct / 100)
    }
    return rows
  }, [f.startOrders, f.growthPct, f.avgOrderValue, f.fixedMonthly, varCostPerOrder])

  const visaTarget  = 300000
  const visaRevenue = months[months.length - 1]?.cumRevenue || 0
  const visaPct     = Math.min(100, Math.round(visaRevenue / visaTarget * 100))
  const monthHit188 = months.find(m => m.cumRevenue >= visaTarget)

  return (
    <div>
      {/* Inputs */}
      <div className="fin-card">
        <div className="fin-card-header"><span className="fin-card-title">Forecast assumptions</span></div>
        <div className="fin-card-body">
          <FinRow label="Orders in month 1"      value={f.startOrders}   onChange={v => upd('startOrders', v)}   prefix="" suffix="orders" step="1" />
          <FinRow label="Monthly growth rate"    value={f.growthPct}     onChange={v => upd('growthPct', v)}     prefix="" suffix="%" step="1" />
          <FinRow label="Average order value"    value={f.avgOrderValue} onChange={v => upd('avgOrderValue', v)} />
          <FinRow label="Fixed monthly overhead" value={f.fixedMonthly}  onChange={v => upd('fixedMonthly', v)}  hint="Apps, ads, warehouse, etc." />
        </div>
      </div>

      {/* Break-even */}
      <div className="fin-result" style={{ marginBottom: 16 }}>
        <div className="fin-result-label">Break-even point</div>
        <div className="fin-result-value">{breakEvenOrders} <span style={{ fontSize: 18, color: 'var(--text-tertiary)' }}>orders/mo</span></div>
        <div className="fin-result-grid">
          <div>
            <div className="fin-result-item-label">Break-even revenue</div>
            <div className="fin-result-item-value">${Math.round(breakEvenRevenue).toLocaleString()}</div>
          </div>
          <div>
            <div className="fin-result-item-label">Gross margin</div>
            <div className="fin-result-item-value">{(grossMarginPct * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="fin-result-item-label">Var. cost / order</div>
            <div className="fin-result-item-value">${varCostPerOrder.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* 12-month table */}
      <div className="fin-card" style={{ marginBottom: 16 }}>
        <div className="fin-card-header">
          <span className="fin-card-title">12-month projection</span>
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>Based on your assumptions above</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="forecast-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>Net profit</th>
                <th>Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {months.map(m => (
                <tr key={m.month} className={m.cumRevenue >= visaTarget && months[m.month - 2]?.cumRevenue < visaTarget ? 'target' : ''}>
                  <td>M{m.month}</td>
                  <td>{m.orders}</td>
                  <td>${m.revenue.toLocaleString()}</td>
                  <td style={{ color: m.profit > 0 ? 'var(--green)' : 'var(--danger)' }}>
                    {m.profit >= 0 ? '+' : ''}${m.profit.toLocaleString()}
                  </td>
                  <td>${m.cumRevenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 188A visa tracker */}
      <div className="fin-card">
        <div className="fin-card-header"><span className="fin-card-title">188A visa threshold tracker · $300K AUD</span></div>
        <div className="visa-ring-section">
          <svg width={90} height={90} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
            <circle cx={45} cy={45} r={38} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
            <circle cx={45} cy={45} r={38} fill="none"
              stroke={visaPct >= 100 ? 'var(--green)' : 'var(--accent)'} strokeWidth={7}
              strokeDasharray={2 * Math.PI * 38}
              strokeDashoffset={2 * Math.PI * 38 * (1 - visaPct / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
          </svg>
          <div>
            <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 32, fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1 }}>
              {visaPct}%
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 5 }}>
              ${visaRevenue.toLocaleString()} of $300,000 AUD projected in 12 months
            </div>
            {monthHit188 ? (
              <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 6 }}>
                ✓ Threshold hit in month {monthHit188.month} at current growth rate
              </div>
            ) : (
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 6 }}>
                Increase growth rate or average order value to hit threshold sooner
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function FinancialView({ financial, setFinancial }) {
  const [tab, setTab] = useState('costs')

  return (
    <div>
      <div className="page-header">
        <div className="page-header-eyebrow">Business</div>
        <div className="page-header-title">Financial</div>
        <div className="page-header-sub">Landed cost · startup budget · 12-month revenue forecast</div>
      </div>

      <div className="fin-tabs">
        {[
          { id: 'costs',    label: 'Costs & margins' },
          { id: 'budget',   label: 'Startup budget' },
          { id: 'forecast', label: 'Forecast & visa' },
        ].map(t => (
          <button key={t.id} className={`fin-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="page-content">
        {tab === 'costs'    && <CostsTab    financial={financial} setFinancial={setFinancial} />}
        {tab === 'budget'   && <BudgetTab   financial={financial} setFinancial={setFinancial} />}
        {tab === 'forecast' && <ForecastTab financial={financial} setFinancial={setFinancial} />}
      </div>
    </div>
  )
}
