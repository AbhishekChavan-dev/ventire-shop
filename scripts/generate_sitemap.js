import fs from 'node:fs/promises';
import { MongoClient } from 'mongodb';

// We will use process.env directly. 
// When running locally, use: node --env-file=.env scripts/generate-sitemap.js

async function generateSitemap() {
  // Replace with your actual MongoDB URI if the env-file flag isn't used
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    return;
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db(); 
    
    // Fetch products from your 'products' collection
    const products = await db.collection('products').find({}).toArray();

    const baseUrl = 'https://ventirein/';

    // 1. Static Routes
    const staticPages = ['', '/story', '/about', '/shop', '/contact'];

    const staticXml = staticPages
      .map((page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`)
      .join('');

    // 2. Dynamic Product Routes
    const productXml = products
      .map((product) => `
  <url>
    <loc>${baseUrl}/product/${product.slug || product._id}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>0.9</priority>
  </url>`)
      .join('');

    // 3. Combine
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${productXml}
</urlset>`;

    await fs.writeFile('public/sitemap.xml', sitemap);
    console.log('✅ Sitemap generated: public/sitemap.xml');

  } catch (error) {
    console.error('❌ Generation failed:', error);
  } finally {
    await client.close();
  }
}

generateSitemap();