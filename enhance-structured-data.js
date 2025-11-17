#!/usr/bin/env node

/**
 * Enhance structured data (Schema.org) for SEO and AEO
 * Add BreadcrumbList, CollectionPage, and improve existing schemas
 */

const fs = require('fs');
const path = require('path');

console.log(`\n${'='.repeat(80)}`);
console.log('ENHANCE STRUCTURED DATA FOR SEO/AEO');
console.log(`${'='.repeat(80)}\n`);

const inventorsDatabase = require('./inventors-database.js');
const inventors = inventorsDatabase.inventors;

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Generate BreadcrumbList schema
function generateBreadcrumbSchema(category, currentName, currentUrl) {
    return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.americaninventions.org/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "${category}",
          "item": "https://www.americaninventions.org/?category=${encodeURIComponent(category)}"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${currentName}",
          "item": "${currentUrl}"
        }
      ]
    }
    </script>`;
}

// Generate Organization schema for homepage
function generateOrganizationSchema() {
    return `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Heroes of Innovation",
      "alternateName": "American Inventions",
      "url": "https://www.americaninventions.org",
      "logo": "https://www.americaninventions.org/og-image.jpg",
      "description": "Celebrating the revolutionary contributions of Black and Brown inventors across the Americas. Discover the untold stories of innovation that shaped our modern world.",
      "sameAs": [
        "https://www.facebook.com/americaninventions",
        "https://twitter.com/americaninvent",
        "https://www.instagram.com/americaninventions"
      ],
      "foundingDate": "2025",
      "founders": []
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Heroes of Innovation",
      "url": "https://www.americaninventions.org",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.americaninventions.org/?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Black and Brown Inventors Database",
      "description": "Comprehensive database of ${inventors.length} Black and Brown inventors who changed the world",
      "url": "https://www.americaninventions.org",
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": ${inventors.length},
        "itemListElement": [
          ${inventors.slice(0, 10).map((inv, idx) => `{
            "@type": "Person",
            "position": ${idx + 1},
            "name": "${inv.name}",
            "description": "${inv.shortBio.replace(/"/g, '\\"')}",
            "url": "https://www.americaninventions.org/inventor/${inv.id}.html"
          }`).join(',\n          ')}
        ]
      }
    }
    </script>`;
}

let stats = {
    breadcrumbs: 0,
    organization: 0,
    enhanced: 0
};

// Add structured data to index.html
console.log('Enhancing main page...');
try {
    let html = fs.readFileSync('./index.html', 'utf8');

    // Add Organization and WebSite schema if not present
    if (!html.includes('"@type": "Organization"')) {
        const headClosePos = html.indexOf('</head>');
        if (headClosePos !== -1) {
            html = html.slice(0, headClosePos) + generateOrganizationSchema() + '\n' + html.slice(headClosePos);
            fs.writeFileSync('./index.html', html);
            stats.organization++;
            console.log('✓ Added Organization and CollectionPage schema to index.html');
        }
    }
} catch (error) {
    console.error('Error enhancing index.html:', error.message);
}

// Add breadcrumb schema to inventor pages
console.log('\nEnhancing inventor pages...');
inventors.forEach(inventor => {
    const inventorFile = path.join('./inventor', `${inventor.id}.html`);

    if (!fs.existsSync(inventorFile)) return;

    try {
        let html = fs.readFileSync(inventorFile, 'utf8');

        // Add BreadcrumbList schema if not present
        if (!html.includes('"@type": "BreadcrumbList"')) {
            const headClosePos = html.indexOf('</head>');
            if (headClosePos !== -1) {
                const breadcrumbSchema = generateBreadcrumbSchema(
                    inventor.category,
                    inventor.name,
                    `https://www.americaninventions.org/inventor/${inventor.id}.html`
                );
                html = html.slice(0, headClosePos) + breadcrumbSchema + '\n' + html.slice(headClosePos);
                fs.writeFileSync(inventorFile, html);
                stats.breadcrumbs++;
            }
        }
    } catch (error) {
        // Silently skip files that don't exist or have errors
    }
});
console.log(`✓ Added BreadcrumbList schema to ${stats.breadcrumbs} inventor pages`);

// Add breadcrumb schema to invention pages
console.log('\nEnhancing invention pages...');
let inventionBreadcrumbs = 0;
inventors.forEach(inventor => {
    const inventionSlug = slugify(inventor.primaryInvention);
    const inventionFile = path.join('./invention', `${inventionSlug}.html`);

    if (!fs.existsSync(inventionFile)) return;

    try {
        let html = fs.readFileSync(inventionFile, 'utf8');

        // Add BreadcrumbList schema if not present
        if (!html.includes('"@type": "BreadcrumbList"')) {
            const headClosePos = html.indexOf('</head>');
            if (headClosePos !== -1) {
                const breadcrumbSchema = generateBreadcrumbSchema(
                    inventor.category,
                    inventor.primaryInvention,
                    `https://www.americaninventions.org/invention/${inventionSlug}.html`
                );
                html = html.slice(0, headClosePos) + breadcrumbSchema + '\n' + html.slice(headClosePos);
                fs.writeFileSync(inventionFile, html);
                inventionBreadcrumbs++;
            }
        }
    } catch (error) {
        // Silently skip files that don't exist or have errors
    }
});
console.log(`✓ Added BreadcrumbList schema to ${inventionBreadcrumbs} invention pages`);

console.log(`\n${'='.repeat(80)}`);
console.log('STRUCTURED DATA ENHANCEMENT COMPLETE!');
console.log(`${'='.repeat(80)}`);
console.log(`Schemas added:`);
console.log(`  ✓ Organization schema: 1 page`);
console.log(`  ✓ WebSite schema: 1 page`);
console.log(`  ✓ CollectionPage schema: 1 page`);
console.log(`  ✓ BreadcrumbList schema: ${stats.breadcrumbs + inventionBreadcrumbs} pages`);
console.log(`\nSEO/AEO benefits:`);
console.log(`  • Better search engine understanding`);
console.log(`  • Rich snippets in search results`);
console.log(`  • Voice search optimization`);
console.log(`  • Knowledge panel eligibility`);
console.log(`  • Answer box potential`);
console.log(`${'='.repeat(80)}\n`);
