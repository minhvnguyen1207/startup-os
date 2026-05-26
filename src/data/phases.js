export const PHASES = [
  {
    id: 'foundation',
    title: 'Foundation',
    subtitle: 'Business & legal setup',
    timeline: 'Weeks 1–4',
    color: '#888780',
    icon: '⬡',
    sections: [
      {
        label: 'Business structure',
        tasks: [
          { id: 'abn', name: 'Register company / ABN', detail: 'Set up your legal entity. Pty Ltd recommended for liability protection.', tool: 'ASIC online', link: 'https://asic.gov.au', blocker: true },
          { id: 'bank', name: 'Open business bank account', detail: 'Separate from personal finances from day one.', tool: 'Wise Business or ANZ', link: 'https://wise.com/au/business/' },
          { id: 'xero', name: 'Set up accounting software', detail: 'Track expenses and GST from the start.', tool: 'Xero', link: 'https://xero.com/au' },
        ]
      },
      {
        label: 'Import & compliance',
        tasks: [
          { id: 'roasted-vs-green', name: 'Decide: importing roasted or green beans?', detail: 'Critical decision. Green = need AU roasting partner. Roasted = simpler import but less flexibility.', tool: 'Internal', blocker: true, gap: true },
          { id: 'daff', name: 'DAFF biosecurity clearance for roasted coffee', detail: 'Low-risk commodity but documentation still required. Lodge via DAFF before first shipment.', tool: 'DAFF Biosecurity', link: 'https://www.agriculture.gov.au/biosecurity-trade/import', blocker: true },
          { id: 'fsanz', name: 'FSANZ food labeling checklist', detail: 'Mandatory: nutrition information panel, allergen declaration, country of origin, business address, net weight.', tool: 'FSANZ + Claude', link: 'https://www.foodstandards.gov.au/consumer/labelling', blocker: true },
          { id: 'broker', name: 'Customs broker shortlist', detail: 'A broker handles import duties and documentation. Get 3 quotes. Budget ~$300–500 per shipment.', tool: 'Flexport / local broker', link: 'https://flexport.com' },
        ]
      },
      {
        label: 'Supply chain',
        tasks: [
          { id: 'first-shipment', name: 'Confirm first shipment volume + timeline with father', detail: 'Lock in weight, export date, and shipping method (sea freight recommended for 10t+).', tool: 'Call / WhatsApp' },
          { id: 'au-roaster', name: 'Source AU roasting partner (if importing green)', detail: 'Approach specialty roasters in Melbourne. Negotiate contract roasting per batch.', tool: 'Cold outreach', gap: true },
          { id: '3pl', name: 'Get 3PL / warehousing quotes in Melbourne', detail: 'You need somewhere to store stock and fulfill orders. Shippit 3PL or Hubbed are good starting points.', tool: 'Shippit', link: 'https://www.shippit.com', gap: true },
        ]
      }
    ]
  },
  {
    id: 'brand',
    title: 'Brand identity',
    subtitle: 'Name, visual system, packaging',
    timeline: 'Weeks 2–6',
    color: '#534AB7',
    icon: '◈',
    sections: [
      {
        label: 'Naming & verbal identity',
        tasks: [
          { id: 'brand-name', name: 'Finalise brand name + trademark search', detail: 'Run IP Australia search before committing. Budget $250–500 for TM application once confirmed.', tool: 'IP Australia', link: 'https://www.ipaustralia.gov.au' },
          { id: 'brand-story', name: 'Write brand story / origin narrative', detail: '"Drink the place" — father-son, Dak Lak specificity, generational knowledge. Claude session recommended.', tool: 'Claude (Jordan)' },
          { id: 'tagline', name: 'Develop tagline + messaging framework', detail: 'Tagline, 3 core messages, tone of voice. One Claude session to nail this.', tool: 'Claude (Jordan)' },
          { id: 'tov', name: 'Define tone of voice with examples', detail: 'Write 10 example sentences in brand voice. Becomes the reference for all copy.', tool: 'Claude (Jordan)' },
        ]
      },
      {
        label: 'Visual identity',
        tasks: [
          { id: 'moodboard', name: 'Generate mood board + aesthetic direction', detail: 'Lab aesthetic direction. Use Ideogram or Midjourney. Reference: Replica perfume, FutureLab Nutrition.', tool: 'Ideogram / Midjourney', link: 'https://ideogram.ai' },
          { id: 'logo', name: 'Logo concepts (3 directions)', detail: 'Generate in Ideogram then refine in Figma. Minimal, geometric, ownable mark.', tool: 'Ideogram + Figma' },
          { id: 'brand-guide', name: 'Build brand guidelines document', detail: 'Colors, typography, grid, logo usage, photography style. Use Claude docx skill.', tool: 'Figma + Claude' },
          { id: 'flavor-scale', name: 'Create flavor intensity scale visual asset', detail: 'Your whitespace differentiator. 5-axis scale: sour, bitter, caffeine, mandarin, sweet. Make it beautiful.', tool: 'Figma / Canva' },
        ]
      },
      {
        label: 'Packaging',
        tasks: [
          { id: 'pack-format', name: 'Define packaging format', detail: 'Bag size (250g / 1kg?), valve type (degassing), closure (zip vs heat seal), material (kraft vs foil).', tool: 'Supplier quotes', gap: true },
          { id: 'pack-concepts', name: 'Generate packaging concepts via AI', detail: 'Create 3–5 label concepts in Ideogram + mock on bag template in Canva.', tool: 'Midjourney + Canva' },
          { id: 'pack-printer', name: 'Source packaging printer in AU', detail: 'Pakko for digital short-run. MOQ ~100 bags. Budget ~$3–6/bag for premium digital print.', tool: 'Pakko', link: 'https://pakko.com.au', gap: true },
          { id: 'fsanz-label', name: 'FSANZ-compliant label design', detail: 'All mandatory fields must be present. Cross-check with FSANZ checklist before print.', tool: 'Canva + Claude' },
          { id: 'sample-print', name: 'Order sample print run (50–100 bags)', detail: 'Do not scale until you\'ve held the physical product and tested it.', tool: 'Pakko / local printer' },
        ]
      }
    ]
  },
  {
    id: 'digital',
    title: 'Digital store',
    subtitle: 'Shopify + Claude Code pipeline',
    timeline: 'Weeks 4–10',
    color: '#0F6E56',
    icon: '⬡',
    sections: [
      {
        label: 'Shopify setup',
        tasks: [
          { id: 'shopify-trial', name: 'Start Shopify trial + choose theme base', detail: 'Start with Dawn or Debut as a base. Claude Code will heavily customise on top.', tool: 'Shopify', link: 'https://shopify.com' },
          { id: 'domain', name: 'Connect custom domain', detail: 'Buy from Namecheap (~$15/yr). Connect via Shopify DNS settings.', tool: 'Namecheap', link: 'https://namecheap.com' },
          { id: 'payments', name: 'Set up Shopify Payments + Afterpay', detail: 'Afterpay increases AOV for premium products. Takes 5 mins to enable.', tool: 'Shopify dashboard' },
          { id: 'shipping', name: 'Configure shipping zones (AU + NZ)', detail: 'Free shipping threshold (e.g. $60+) increases average order value.', tool: 'Shopify + Sendle', link: 'https://sendle.com' },
        ]
      },
      {
        label: 'Claude Code → GitHub → Shopify pipeline',
        tasks: [
          { id: 'github-repo', name: 'Set up GitHub repo for Shopify theme', detail: 'Use Shopify CLI to pull current theme. Push to GitHub. This becomes the source of truth.', tool: 'GitHub + Shopify CLI', link: 'https://github.com' },
          { id: 'github-actions', name: 'Configure GitHub Actions for auto-deploy', detail: 'On push to main, auto-deploys to Shopify via Shopify Theme Deploy action. Zero manual deploy.', tool: 'Claude Code + GitHub Actions' },
          { id: 'hero-section', name: 'Build immersive hero section (Dak Lak transport)', detail: 'Parallax scroll + ambient sound toggle + full-bleed video/imagery. This is the brand moment.', tool: 'Claude Code (HTML/JS/Liquid)' },
          { id: 'flavor-selector', name: 'Build flavor intensity selector on product page', detail: 'Interactive radar/bar showing the 5-axis flavor profile per SKU. Custom Shopify metafields.', tool: 'Claude Code' },
          { id: 'origin-section', name: 'Build origin scroll section', detail: 'Horizontal scroll or sticky narrative — Dak Lak → Melbourne. Father-son story with map and imagery.', tool: 'Claude Code' },
        ]
      },
      {
        label: 'Content & product',
        tasks: [
          { id: 'product-copy', name: 'Write all product copy (3–5 SKUs)', detail: 'Each product needs: name, tasting notes, farm story, brew guide. Use Claude for drafts.', tool: 'Claude (Jordan)' },
          { id: 'ai-lifestyle', name: 'Create AI lifestyle imagery for store', detail: 'Dak Lak farm scenes, morning ritual, product shots. Use Midjourney v6 for photorealistic output.', tool: 'Midjourney', link: 'https://midjourney.com' },
          { id: 'product-photos', name: 'Shoot real product photos', detail: 'iPhone 15 Pro + natural light + white/kraft surface. Edit in Lightroom Mobile (free). No studio needed.', tool: 'iPhone + Lightroom Mobile' },
          { id: 'email-capture', name: 'Set up email capture + welcome sequence', detail: 'Popup on exit intent. 3-email welcome series: brand story → brew guide → first purchase offer.', tool: 'Klaviyo', link: 'https://klaviyo.com' },
          { id: 'subscription', name: 'Set up subscription option (ReCharge)', detail: 'Recurring revenue is critical. Even 20% subscribers changes your cash flow fundamentally.', tool: 'ReCharge', link: 'https://rechargepayments.com', gap: true },
        ]
      }
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing & launch',
    subtitle: 'Content, social, pre-launch cohort',
    timeline: 'Weeks 8–16',
    color: '#993C1D',
    icon: '◇',
    sections: [
      {
        label: 'Pre-launch list',
        tasks: [
          { id: 'waitlist', name: 'Build email waitlist (target: 200 before launch)', detail: 'Set up a single landing page with email capture before the store is live. Offer early access discount.', tool: 'Shopify + Klaviyo', gap: true },
          { id: 'network-outreach', name: 'Personal network outreach', detail: 'Friends, uni network, Vietnamese-Australian community in Melbourne. DM 50 people personally.', tool: 'Manual + Claude draft DMs' },
          { id: 'communities', name: 'Post in Melbourne food / coffee communities', detail: 'r/melbourne, Melbourne Coffee Roasters FB group, Broadsheet community. Authentic story, no hard sell.', tool: 'Manual' },
        ]
      },
      {
        label: 'Content engine',
        tasks: [
          { id: 'brand-video', name: 'Create brand film (Dak Lak + AI footage)', detail: 'Combine father\'s farm footage with Runway/Kling AI-generated B-roll. 60–90 seconds. This is your hero asset.', tool: 'Runway ML / Kling + CapCut', link: 'https://runwayml.com' },
          { id: 'content-calendar', name: 'Write 4-week Instagram content calendar', detail: '3 posts/week. Mix: origin content, product, education (brew guides), behind-the-scenes.', tool: 'Claude + Buffer', link: 'https://buffer.com' },
          { id: 'tiktok', name: 'Set up TikTok (behind-scenes + father-son story)', detail: 'Raw, authentic. Father processing beans in Dak Lak. The human story nobody else has.', tool: 'CapCut + TikTok' },
          { id: 'sensory-reels', name: 'Create "transport" sensory reel series', detail: 'ASMR-style: pouring, grinding, brewing. Pair with ambient Dak Lak sounds. High-engagement format.', tool: 'Runway ML + CapCut' },
        ]
      },
      {
        label: 'Launch',
        tasks: [
          { id: 'soft-launch', name: 'Soft launch to waitlist (discount code)', detail: '48hr exclusive window for waitlist. 15% off first order. Creates urgency and rewards early sign-ups.', tool: 'Klaviyo' },
          { id: 'pr-pitch', name: 'PR pitch to Melbourne food press', detail: 'Broadsheet, Time Out Melbourne, The Age Food. Personal story angle. Claude drafts the pitch.', tool: 'Claude + cold email' },
          { id: 'influencer-samples', name: 'Send samples to Melbourne coffee micro-influencers', detail: '5–10 accounts, 5k–30k followers. Coffee enthusiast niche. No paid deals — product gifting only.', tool: 'Manual + Klaviyo tracking', gap: true },
          { id: 'public-launch', name: 'Public launch across all channels', detail: 'Coordinated post across IG, TikTok, email. Same day. Build the moment.', tool: 'Buffer + Klaviyo' },
        ]
      }
    ]
  },
  {
    id: 'operations',
    title: 'Operations',
    subtitle: 'Fulfillment, B2B, feedback loops',
    timeline: 'Ongoing',
    color: '#3B6D11',
    icon: '◉',
    sections: [
      {
        label: 'Fulfillment',
        tasks: [
          { id: 'shippit-setup', name: 'Set up Shippit for order management', detail: 'Connects to Shopify. Auto-books couriers (Sendle, AusPost, DHL). $0 setup cost.', tool: 'Shippit', link: 'https://shippit.com' },
          { id: 'pack-sop', name: 'Create SOP for packing + dispatch', detail: 'Written process so both of you can run it consistently. Reduces errors as volume grows.', tool: 'Claude (write the doc)' },
          { id: 'returns-flow', name: 'Set up returns flow', detail: 'Shopify returns portal + clear policy page. Response time standard = 24hrs.', tool: 'Shopify + Claude draft policy' },
        ]
      },
      {
        label: 'B2B pipeline',
        tasks: [
          { id: 'cafe-list', name: 'Build cafe outreach list (Melbourne independents)', detail: 'Target 30–50 independent specialty cafes in Fitzroy, Collingwood, CBD, Brunswick.', tool: 'Google Maps + Claude', gap: true },
          { id: 'wholesale-deck', name: 'Create B2B price sheet + wholesale deck', detail: 'Clean 1-page PDF rate card + 5-slide deck. Claude pptx skill handles this.', tool: 'Claude + pptx/docx skill' },
          { id: 'cafe-drops', name: 'Run 5 cafe sample drops (in person)', detail: 'Walk in, introduce yourself, leave product + card. The father-son story lands in person.', tool: 'Manual' },
        ]
      },
      {
        label: 'Feedback & growth',
        tasks: [
          { id: 'reviews', name: 'Set up post-purchase review flow', detail: 'Judge.me app (Shopify). 7-day post-delivery email. Reviews on product pages = social proof.', tool: 'Judge.me', link: 'https://judge.me' },
          { id: 'monthly-review', name: 'Monthly brand + product review session', detail: 'What\'s working, what\'s not, what to change. Regular Cowork session with Jordan.', tool: 'Claude Cowork' },
          { id: 'subscription-ratio', name: 'Track subscription vs one-time purchase ratio', detail: 'Target: 25%+ subscribers within 6 months. Indicator of product-market fit.', tool: 'Shopify analytics + ReCharge' },
        ]
      }
    ]
  }
]

export const TOOL_STACK = [
  { category: 'Brand & strategy', tools: ['Claude Cowork (Jordan)', 'Ideogram', 'Figma (free)'] },
  { category: 'Website', tools: ['Shopify', 'Claude Code', 'GitHub', 'GitHub Actions'] },
  { category: 'Design & packaging', tools: ['Canva Pro', 'Midjourney', 'Pakko'] },
  { category: 'Video & content', tools: ['Runway ML', 'Kling AI', 'CapCut'] },
  { category: 'Email & CRM', tools: ['Klaviyo (free tier)', 'Buffer'] },
  { category: 'Fulfillment', tools: ['Shopify', 'Shippit', 'Sendle'] },
]
