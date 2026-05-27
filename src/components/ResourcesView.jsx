const COMPLIANCE = [
  { emoji: '🏛️', name: 'ASIC — Register company', desc: 'Pty Ltd registration. Get your ACN and ABN here first.', cost: '$538 AUD', urgency: 'now', url: 'https://asic.gov.au' },
  { emoji: '🌾', name: 'DAFF — Biosecurity import', desc: 'Mandatory for importing food/agriculture into Australia.', cost: 'Free to register', urgency: 'now', url: 'https://www.agriculture.gov.au/biosecurity-trade/import' },
  { emoji: '🏷️', name: 'FSANZ — Food labelling', desc: 'Nutrition panel, allergens, country of origin — all mandatory.', cost: 'Free', urgency: 'now', url: 'https://www.foodstandards.gov.au/consumer/labelling' },
  { emoji: '™️', name: 'IP Australia — Trademark search', desc: 'Check your brand name before committing. TM app ~$250.', cost: '$250–500 AUD', urgency: 'now', url: 'https://www.ipaustralia.gov.au' },
]

const TOOLS = [
  {
    category: 'Brand & strategy',
    items: [
      { emoji: '✦', name: 'Claude (Jordan)', desc: 'Brand strategy, copy, pitch decks, product naming.', cost: 'Included', urgency: 'now', url: 'https://claude.ai' },
      { emoji: '🎨', name: 'Ideogram', desc: 'AI image generation. Best for logo concepts and packaging mockups.', cost: 'Free tier', urgency: 'now', url: 'https://ideogram.ai' },
      { emoji: '🖼️', name: 'Midjourney', desc: 'Photorealistic AI imagery — farm scenes, lifestyle shots.', cost: '~$12 USD/mo', urgency: 'soon', url: 'https://midjourney.com' },
      { emoji: '📐', name: 'Figma', desc: 'Design tool for brand guidelines, packaging layout.', cost: 'Free', urgency: 'soon', url: 'https://figma.com' },
      { emoji: '🖼️', name: 'Canva Pro', desc: 'Quick packaging mockups and social content.', cost: '~$22 AUD/mo', urgency: 'soon', url: 'https://canva.com' },
    ]
  },
  {
    category: 'Website & commerce',
    items: [
      { emoji: '🛍️', name: 'Shopify', desc: 'Your storefront. Start with Basic plan.', cost: '$39 AUD/mo', urgency: 'now', url: 'https://shopify.com' },
      { emoji: '🌐', name: 'Namecheap', desc: 'Domain registration. ~$15/yr for .com.au', cost: '~$15 AUD/yr', urgency: 'now', url: 'https://namecheap.com' },
      { emoji: '⚡', name: 'GitHub + Vercel', desc: 'Code your Shopify theme with Claude Code, auto-deploy on push.', cost: 'Free', urgency: 'now', url: 'https://github.com' },
    ]
  },
  {
    category: 'Packaging',
    items: [
      { emoji: '📦', name: 'Pakko', desc: 'Short-run digital printing for coffee bags. MOQ ~100 units.', cost: '$3–6/bag', urgency: 'soon', url: 'https://pakko.com.au' },
      { emoji: '🔧', name: 'Smartmockups', desc: 'Photorealistic bag mockups before printing.', cost: 'Free tier', urgency: 'soon', url: 'https://smartmockups.com' },
    ]
  },
  {
    category: 'Marketing & email',
    items: [
      { emoji: '📧', name: 'Klaviyo', desc: 'Email marketing. Free under 250 contacts. Use for welcome sequences.', cost: 'Free to start', urgency: 'now', url: 'https://klaviyo.com' },
      { emoji: '📱', name: 'Buffer', desc: 'Schedule Instagram and TikTok posts in advance.', cost: 'Free tier', urgency: 'soon', url: 'https://buffer.com' },
      { emoji: '🎬', name: 'Runway ML', desc: 'AI video for brand film B-roll. Farm footage + AI = compelling content.', cost: '~$22 AUD/mo', urgency: 'later', url: 'https://runwayml.com' },
      { emoji: '🔄', name: 'ReCharge', desc: 'Subscriptions on Shopify. Your recurring revenue moat.', cost: '$99 USD/mo + %', urgency: 'later', url: 'https://rechargepayments.com' },
    ]
  },
  {
    category: 'Fulfillment & ops',
    items: [
      { emoji: '🚚', name: 'Shippit', desc: 'Shopify-connected order management. Auto-books couriers.', cost: '$0 setup', urgency: 'now', url: 'https://shippit.com' },
      { emoji: '📬', name: 'Sendle', desc: 'Australia-wide courier with Shopify integration.', cost: 'Per shipment', urgency: 'now', url: 'https://sendle.com' },
      { emoji: '⭐', name: 'Judge.me', desc: 'Post-purchase reviews on Shopify product pages.', cost: 'Free plan', urgency: 'later', url: 'https://judge.me' },
      { emoji: '💰', name: 'Wise Business', desc: 'Multi-currency account. Great for paying Vietnamese suppliers.', cost: 'Free to open', urgency: 'now', url: 'https://wise.com/au/business/' },
      { emoji: '📊', name: 'Xero', desc: 'Accounting software. Track GST and expenses from day one.', cost: '~$32 AUD/mo', urgency: 'now', url: 'https://xero.com/au' },
    ]
  },
]

const MONTHLY = [
  { item: 'Shopify Basic', cost: '$39' },
  { item: 'Klaviyo (free to 250 contacts)', cost: '$0' },
  { item: 'Canva Pro', cost: '$22' },
  { item: 'Ideogram (free tier)', cost: '$0' },
  { item: 'Runway ML (when needed)', cost: '$22' },
  { item: 'Buffer free tier', cost: '$0' },
  { item: 'GitHub + Vercel', cost: '$0' },
  { item: 'Xero Starter', cost: '$32' },
]

const urgencyLabel = { now: 'Needed now', soon: 'When ready', later: 'Optional' }

export default function ResourcesView() {
  const total = MONTHLY.reduce((s, r) => {
    const n = parseFloat(r.cost.replace('$','')) || 0
    return s + n
  }, 0)

  return (
    <div>
      <div className="page-header">
        <div className="page-header-eyebrow">Reference</div>
        <div className="page-header-title">Tool stack</div>
        <div className="page-header-sub">Every tool we're using — what it does, what it costs, when you need it</div>
      </div>

      <div className="page-content">

        {/* Compliance — priority section */}
        <div className="section-label" style={{ paddingTop: 0 }}>Australian compliance — do these first</div>
        <div className="resources-grid" style={{ marginBottom: 28 }}>
          {COMPLIANCE.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="resource-tool-item" style={{ textDecoration: 'none' }}>
              <div className="resource-tool-dot">{item.emoji}</div>
              <div className="resource-tool-body">
                <div className="resource-tool-name">{item.name}</div>
                <div className="resource-tool-desc">{item.desc}</div>
                <div className="resource-tool-meta">
                  <span className="resource-cost">{item.cost}</span>
                  <span className="urgency-tag urgency-now">{urgencyLabel[item.urgency]}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Monthly overhead */}
        <div className="section-label">Monthly overhead estimate</div>
        <div className="fin-card" style={{ marginBottom: 28 }}>
          <div className="fin-card-body" style={{ padding: 0 }}>
            {MONTHLY.map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 18px', borderBottom: i < MONTHLY.length - 1 ? '1px solid var(--border)' : 'none'
              }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.item}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{row.cost} <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>AUD/mo</span></span>
              </div>
            ))}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 18px', background: 'var(--bg-raised)', borderTop: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>Total fixed overhead</span>
              <span style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 18, color: 'var(--accent)' }}>~${total} AUD/mo</span>
            </div>
          </div>
        </div>

        {/* Tool categories */}
        {TOOLS.map((group, gi) => (
          <div key={gi}>
            <div className="section-label">{group.category}</div>
            <div className="resource-tool-list" style={{ marginBottom: 20 }}>
              {group.items.map((item, ii) => (
                <a key={ii} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="resource-tool-item" style={{ textDecoration: 'none' }}>
                  <div className="resource-tool-dot">{item.emoji}</div>
                  <div className="resource-tool-body">
                    <div className="resource-tool-name">{item.name}</div>
                    <div className="resource-tool-desc">{item.desc}</div>
                    <div className="resource-tool-meta">
                      <span className="resource-cost">{item.cost}</span>
                      <span className={`urgency-tag urgency-${item.urgency}`}>{urgencyLabel[item.urgency]}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0, alignSelf: 'center' }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}
