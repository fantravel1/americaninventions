#!/usr/bin/env node

/**
 * Generate sitemap.xml and robots.txt for SEO
 */

const fs = require('fs');
const path = require('path');

console.log(`\n${'='.repeat(80)}`);
console.log('GENERATE SITEMAP.XML AND ROBOTS.TXT');
console.log(`${'='.repeat(80)}\n`);

const inventorsDatabase = require('./inventors-database.js');
const inventors = inventorsDatabase.inventors;

const BASE_URL = 'https://www.americaninventions.org';

// Helper function to slugify
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Generate sitemap.xml
const urls = [];

// Add main pages
urls.push({
    loc: `${BASE_URL}/`,
    changefreq: 'daily',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
});

urls.push({
    loc: `${BASE_URL}/blog/index.html`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
});

// Add all inventor pages
const inventorDir = './inventor';
const inventorFiles = fs.readdirSync(inventorDir).filter(f => f.endsWith('.html'));

inventorFiles.forEach(file => {
    urls.push({
        loc: `${BASE_URL}/inventor/${file}`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: new Date().toISOString().split('T')[0]
    });
});

// Add all invention pages
inventors.forEach(inventor => {
    const inventionSlug = slugify(inventor.primaryInvention);
    urls.push({
        loc: `${BASE_URL}/invention/${inventionSlug}.html`,
        changefreq: 'monthly',
        priority: '0.7',
        lastmod: new Date().toISOString().split('T')[0]
    });
});

// Add blog posts
const blogDir = './blog';
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html');

blogFiles.forEach(file => {
    urls.push({
        loc: `${BASE_URL}/blog/${file}`,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: new Date().toISOString().split('T')[0]
    });
});

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(url => `    <url>
        <loc>${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('./sitemap.xml', sitemap);
console.log(`✓ Generated sitemap.xml with ${urls.length} URLs`);

// Generate robots.txt
const robots = `# robots.txt for americaninventions.org

User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay (be nice to servers)
Crawl-delay: 1

# Disallow admin or temporary files
Disallow: /generate-*.js
Disallow: /integrate-*.js
Disallow: /add-*.js
Disallow: /fix-*.js
Disallow: /update-*.js
Disallow: /verify-*.js
Disallow: /*.js$
Disallow: /node_modules/
Disallow: /.git/

# Allow all HTML pages
Allow: /*.html$
Allow: /inventor/*.html$
Allow: /invention/*.html$
Allow: /blog/*.html$
`;

fs.writeFileSync('./robots.txt', robots);
console.log(`✓ Generated robots.txt`);

console.log(`\n${'='.repeat(80)}`);
console.log('SEO FILES GENERATED!');
console.log(`${'='.repeat(80)}`);
console.log(`Total URLs in sitemap: ${urls.length}`);
console.log(`  • Main pages: 2`);
console.log(`  • Inventor pages: ${inventorFiles.length}`);
console.log(`  • Invention pages: ${inventors.length}`);
console.log(`  • Blog posts: ${blogFiles.length}`);
console.log(`${'='.repeat(80)}\n`);
