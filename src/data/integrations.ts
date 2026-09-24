export interface Integration {
  id: string
  name: string
  category: string
  color: string
  glyph: string
  description: string
}

/** Generic data-source tiles (monogram glyphs so we don't ship third-party trademarks). */
export const INTEGRATIONS: Integration[] = [
  { id: 'postgres', name: 'Postgres', category: 'Database', color: 'oklch(0.6 0.13 250)', glyph: 'Pg', description: 'Sync tables and views' },
  { id: 'stripe', name: 'Stripe', category: 'Payments', color: 'oklch(0.58 0.2 285)', glyph: 'St', description: 'Revenue, MRR and churn' },
  { id: 'shopify', name: 'Shopify', category: 'Commerce', color: 'oklch(0.65 0.17 140)', glyph: 'Sh', description: 'Orders and products' },
  { id: 'segment', name: 'Segment', category: 'Events', color: 'oklch(0.7 0.14 170)', glyph: 'Sg', description: 'Stream product events' },
  { id: 'snowflake', name: 'Snowflake', category: 'Warehouse', color: 'oklch(0.72 0.13 225)', glyph: 'Sf', description: 'Query your warehouse' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', color: 'oklch(0.68 0.19 40)', glyph: 'Hs', description: 'Contacts and deals' },
  { id: 'ga', name: 'Web Analytics', category: 'Traffic', color: 'oklch(0.75 0.16 75)', glyph: 'Wa', description: 'Sessions and sources' },
  { id: 'slack', name: 'Slack', category: 'Alerts', color: 'oklch(0.55 0.18 330)', glyph: 'Sl', description: 'Send alerts to channels' },
]
