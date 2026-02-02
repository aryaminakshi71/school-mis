import { generateSitemap, getSchoolMISRoutes } from '@/lib/sitemap'

export async function GET() {
  const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'https://school-mis.your-domain.com'
  const routes = getSchoolMISRoutes()
  const sitemap = generateSitemap(routes, baseUrl)

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
