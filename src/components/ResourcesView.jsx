import { TOOL_STACK } from '../data/phases.js'

const LINKS = [
  { category: 'Business setup', items: [
    { name: 'ASIC — register company', url: 'https://asic.gov.au' },
    { name: 'IP Australia — trademark search', url: 'https://www.ipaustralia.gov.au' },
    { name: 'DAFF — biosecurity import', url: 'https://www.agriculture.gov.au/biosecurity-trade/import' },
    { name: 'FSANZ — food labeling standards', url: 'https://www.foodstandards.gov.au/consumer/labelling' },
  ]},
  { category: 'Brand & design', items: [
    { name: 'Ideogram — AI image generation', url: 'https://ideogram.ai' },
    { name: 'Midjourney', url: 'https://midjourney.com' },
    { name: 'Figma — free design tool', url: 'https://figma.com' },
    { name: 'Canva Pro', url: 'https://canva.com' },
    { name: 'Pakko — short-run packaging', url: 'https://pakko.com.au' },
  ]},
  { category: 'Website & code', items: [
    { name: 'Shopify', url: 'https://shopify.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Vercel', url: 'https://vercel.com' },
    { name: 'Namecheap — domains', url: 'https://namecheap.com' },
  ]},
  { category: 'Marketing & email', items: [
    { name: 'Klaviyo — email marketing', url: 'https://klaviyo.com' },
    { name: 'Buffer — social scheduling', url: 'https://buffer.com' },
    { name: 'Runway ML — AI video', url: 'https://runwayml.com' },
    { name: 'ReCharge — subscriptions', url: 'https://rechargepayments.com' },
  ]},
  { category: 'Fulfillment', items: [
    { name: 'Shippit — AU order management', url: 'https://shippit.com' },
    { name: 'Sendle — courier', url: 'https://sendle.com' },
    { name: 'Judge.me — product reviews', url: 'https://judge.me' },
    { name: 'Wise Business — banking', url: 'https://wise.com/au/business/' },
  ]},
]

const MONTHLY_COSTS = [
  { item: 'Shopify Basic', cost: '$39 AUD' },
  { item: 'Klaviyo (free to 500 contacts)', cost: '$0' },
  { item: 'Ideogram / Midjourney', cost: '~$30 AUD' },
  { item: 'Canva Pro', cost: '~$22 AUD' },
  { item: 'Runway ML basic', cost: '~$22 AUD' },
  { item: 'Buffer free tier', cost: '$0' },
  { item: 'GitHub free', cost: '$0' },
  { item: 'Vercel hobby tier', cost: '$0' },
]

export default function ResourcesView() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-eyebrow">Reference</div>
        <div className="page-header-title">Tool stack</div>
        <div className="page-header-sub">Everything we're using — links, costs, rationale</div>
      </div>
      <div className="page-content">

        <div className="section-label">Monthly budget estimate</div>
        <div className="task-list" style={{ marginBottom: 28 }}>
          {MONTHLY_COSTS.map((row, i) => (
            <div key={i} className="task-item" style={{ cursor: 'default' }}>
              <div className="task-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="task-name">{row.item}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>{row.cost}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="task-item" style={{ cursor: 'default', background: 'var(--bg-raised)' }}>
            <div className="task-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="task-name" style={{ fontWeight: 500 }}>Total fixed overhead</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>~$113 AUD/month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section-label">Quick-access links</div>
        <div className="resources-grid">
          {LINKS.map((group, gi) => (
            <div key={gi} className="resource-card">
              <div className="resource-card-category">{group.category}</div>
              <div className="resource-tool-list">
                {group.items.map((item, ii) => (
                  <a
                    key={ii}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-tool-item"
                    style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 13 }}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--border-strong)', flexShrink: 0, display: 'inline-block' }} />
                    {item.name} ↗
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
