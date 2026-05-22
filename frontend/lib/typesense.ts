import Typesense from 'typesense'

export const typesense = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST!,
    port: 443,
    protocol: 'https',
  }],
  apiKey: process.env.TYPESENSE_API_KEY!,
  connectionTimeoutSeconds: 5,
})

export const LISTINGS_SCHEMA = {
  name: 'listings',
  fields: [
    { name: 'id',           type: 'string' },
    { name: 'title',        type: 'string' },
    { name: 'description',  type: 'string', optional: true },
    { name: 'price',        type: 'float',  optional: true },
    { name: 'price_per_m2', type: 'float',  optional: true },
    { name: 'area',         type: 'float',  optional: true },
    { name: 'category',     type: 'string', facet: true },
    { name: 'city',         type: 'string', facet: true },
    { name: 'address',      type: 'string', optional: true },
    { name: 'source',       type: 'string', facet: true },
    { name: 'ai_score',     type: 'float',  optional: true },
  ],
  default_sorting_field: 'ai_score',
}
