export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/proof-sheet', '/api/'],
        },
        sitemap: 'https://mydailygarage.com/sitemap.xml',
    }
}
