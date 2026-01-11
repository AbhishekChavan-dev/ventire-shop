import fs from 'fs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function generateSitemap() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(); // Uses DB from URI
    const products = await db.collection('products').find({}).toArray();

    const baseUrl = 'https://ventire-shop.vercel.app';

    // 1. Define your static pages
    const staticPages = [
      '',
      '/about',
      '/story',
      '/shop',
      '/contact',
    ];

    // 2. Map static pages to XML
    const staticXml = staticPages
      .map((page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`)
      .join('');

    // 3. Map dynamic products to XML
    const productXml = products
      .map((product) => `
  <url>
    <loc>${baseUrl}/product/${product.slug || product._id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`)
      .join('');

    // 4. Combine into final XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${productXml}
</urlset>`;

    // 5. Write to public folder
    fs.writeFileSync('public/sitemap.xml', sitemap);
    console.log('✅ Sitemap.xml generated successfully in /public');

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  } finally {
    await client.close();
  }
}

generateSitemap();