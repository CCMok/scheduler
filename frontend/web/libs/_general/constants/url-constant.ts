export const BASE_URL = (() => {
  if (process.env.SITE_DOMAIN) {
    return `https://${process.env.SITE_DOMAIN}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
})()