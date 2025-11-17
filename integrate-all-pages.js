#!/usr/bin/env node

/**
 * Comprehensive integration of all pages:
 * - Unified header/footer across all pages
 * - Enhanced navigation menus
 * - Category interlinking
 * - Related content sections
 * - Breadcrumb navigation
 */

const fs = require('fs');
const path = require('path');

// Read the inventors database
const inventorsDatabase = require('./inventors-database.js');
const inventors = inventorsDatabase.inventors;

console.log(`\n${'='.repeat(80)}`);
console.log('COMPREHENSIVE SITE INTEGRATION');
console.log(`${'='.repeat(80)}\n`);
console.log(`Found ${inventors.length} inventors in database\n`);

// Helper function to slugify
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Get all unique categories
const categories = [...new Set(inventors.map(inv => inv.category))].sort();
console.log(`Categories found: ${categories.join(', ')}\n`);

// Create enhanced navigation HTML
function createEnhancedNav(currentPage = 'home') {
    return `<nav class="top-nav">
        <div class="nav-container">
            <a href="${currentPage === 'home' ? '#' : '../index.html'}" class="nav-logo">💡 Heroes of Innovation</a>
            <div class="nav-links">
                <a href="${currentPage === 'home' ? '#' : '../index.html'}">🏠 Home</a>
                <a href="${currentPage === 'home' ? '#inventionsGrid' : '../index.html'}">👥 Inventors</a>
                <a href="${currentPage === 'home' ? '#inventionsGrid' : '../index.html'}">💡 Inventions</a>
                <a href="${currentPage === 'home' ? '#categories' : '../index.html#tagcloudSection'}">📚 Categories</a>
                <a href="${currentPage === 'home' ? 'blog/index.html' : '../blog/index.html'}">📝 Blog</a>
            </div>
        </div>
    </nav>`;
}

// Create enhanced footer HTML
function createEnhancedFooter(currentPage = 'home') {
    const categoryLinks = categories.map(cat =>
        `<li><a href="${currentPage === 'home' ? '#' : '../index.html'}?category=${encodeURIComponent(cat)}">${cat}</a></li>`
    ).join('\n                        ');

    return `<footer>
        <div class="footer-container">
            <div class="footer-main">
                <div class="footer-brand">
                    <h3>💡 Heroes of Innovation</h3>
                    <p class="footer-description">
                        Celebrating the revolutionary contributions of Black and Brown inventors across the Americas.
                        Discover the untold stories of innovation that shaped our modern world and continue to inspire future generations.
                    </p>
                </div>

                <div class="footer-section">
                    <h4>Explore</h4>
                    <ul>
                        <li><a href="${currentPage === 'home' ? '#' : '../index.html'}">All Inventors</a></li>
                        <li><a href="${currentPage === 'home' ? '#inventionsGrid' : '../index.html'}">All Inventions</a></li>
                        <li><a href="${currentPage === 'home' ? '#timelineSection' : '../index.html#timelineSection'}">Timeline</a></li>
                        <li><a href="${currentPage === 'home' ? '#tagcloudSection' : '../index.html#tagcloudSection'}">Categories</a></li>
                        <li><a href="${currentPage === 'home' ? '#statsDashboard' : '../index.html#statsDashboard'}">Statistics</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Categories</h4>
                    <ul>
                        ${categoryLinks}
                    </ul>
                </div>

                <div class="footer-section">
                    <h4>Regions</h4>
                    <ul>
                        <li><a href="${currentPage === 'home' ? '#' : '../index.html'}?region=north-america">🌎 North America</a></li>
                        <li><a href="${currentPage === 'home' ? '#' : '../index.html'}?region=south-america">🌎 South America</a></li>
                        <li><a href="${currentPage === 'home' ? '#' : '../index.html'}?region=caribbean">🏝️ Caribbean</a></li>
                        <li><a href="${currentPage === 'home' ? '#' : '../index.html'}?region=central-america">🌎 Central America</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2025 Heroes of Innovation | Celebrating Black and Brown Inventors Across the Americas</p>
                <p>
                    <a href="${currentPage === 'home' ? '#' : '../index.html'}">www.americaninventions.org</a> •
                    <a href="${currentPage === 'home' ? '#about' : '../index.html#about'}">About</a> •
                    <a href="${currentPage === 'home' ? '#contact' : '../index.html#contact'}">Contact</a>
                </p>
            </div>
        </div>
    </footer>`;
}

// CSS for enhanced footer
const footerCSS = `
        /* Enhanced Footer */
        footer {
            background: #1a1a1a;
            color: #ffffff;
            margin-top: 4rem;
            padding: 3rem 0 1rem;
        }

        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .footer-main {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 3rem;
            margin-bottom: 2rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #333;
        }

        .footer-brand h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #ffffff;
        }

        .footer-description {
            font-size: 0.9rem;
            line-height: 1.6;
            color: #aaa;
            margin-bottom: 1rem;
        }

        .footer-section h4 {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: #ffffff;
        }

        .footer-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-section li {
            margin-bottom: 0.5rem;
        }

        .footer-section a {
            color: #aaa;
            text-decoration: none;
            transition: color 0.3s;
            font-size: 0.9rem;
        }

        .footer-section a:hover {
            color: #667eea;
        }

        .footer-bottom {
            text-align: center;
            padding-top: 1.5rem;
            font-size: 0.9rem;
            color: #888;
        }

        .footer-bottom a {
            color: #667eea;
            text-decoration: none;
        }

        .footer-bottom a:hover {
            text-decoration: underline;
        }

        @media (max-width: 768px) {
            .footer-main {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
        }

        /* Category Badge */
        .category-badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
            margin: 0.5rem 0;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .category-badge:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        /* Breadcrumb */
        .breadcrumb {
            padding: 1rem 0;
            font-size: 0.9rem;
            color: #666;
        }

        .breadcrumb a {
            color: #667eea;
            text-decoration: none;
        }

        .breadcrumb a:hover {
            text-decoration: underline;
        }

        .breadcrumb span {
            margin: 0 0.5rem;
        }
`;

// Get related inventors in the same category
function getRelatedInventors(currentInventor, limit = 3) {
    return inventors
        .filter(inv =>
            inv.id !== currentInventor.id &&
            inv.category === currentInventor.category
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);
}

// Get related inventions in the same category
function getRelatedInventions(currentInvention, currentCategory, limit = 3) {
    return inventors
        .filter(inv =>
            inv.primaryInvention !== currentInvention &&
            inv.category === currentCategory
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, limit);
}

// Process inventor pages
let inventorPagesUpdated = 0;
let inventorPagesSkipped = 0;

console.log('Processing inventor pages...\n');

inventors.forEach((inventor) => {
    const inventorFile = path.join('./inventor', `${inventor.id}.html`);

    if (!fs.existsSync(inventorFile)) {
        inventorPagesSkipped++;
        return;
    }

    try {
        let html = fs.readFileSync(inventorFile, 'utf8');

        // Check if already processed (look for breadcrumb instead)
        if (html.includes('class="breadcrumb"') && html.includes('related-inventions')) {
            return;
        }

        // Add footer CSS if not present
        if (!html.includes('footer-container')) {
            const styleClosePos = html.indexOf('</style>');
            if (styleClosePos !== -1) {
                html = html.slice(0, styleClosePos) + footerCSS + html.slice(styleClosePos);
            }
        }

        // Replace navigation
        html = html.replace(
            /<nav class="top-nav">[\s\S]*?<\/nav>/,
            createEnhancedNav('inventor')
        );

        // Add breadcrumb after nav
        const breadcrumb = `\n    <!-- Breadcrumb -->\n    <div class="container">\n        <div class="breadcrumb">\n            <a href="../index.html">Home</a>\n            <span>›</span>\n            <a href="../index.html?category=${encodeURIComponent(inventor.category)}">  ${inventor.category}</a>\n            <span>›</span>\n            <strong>${inventor.name}</strong>\n        </div>\n    </div>\n`;

        html = html.replace(
            /(<nav class="top-nav">[\s\S]*?<\/nav>)/,
            '$1' + breadcrumb
        );

        // Add category badge in hero section
        const categoryBadge = `\n            <a href="../index.html?category=${encodeURIComponent(inventor.category)}" class="category-badge">${inventor.category}</a>`;

        html = html.replace(
            /(<span class="hero-flag">.*?<\/span>)/,
            '$1' + categoryBadge
        );

        // Add related inventions section before the "Related Inventors" section
        const relatedInventions = getRelatedInventions(inventor.primaryInvention, inventor.category);

        if (relatedInventions.length > 0) {
            const relatedInventionsHTML = `
        <!-- Related Inventions in Same Category -->
        <section id="related-inventions">
            <h2>More ${inventor.category} Inventions</h2>
            <div class="related-grid">
                ${relatedInventions.map(inv => {
                    const invSlug = slugify(inv.primaryInvention);
                    return `<a href="../invention/${invSlug}.html" class="related-card">
                    <span class="related-emoji">${inv.inventionEmoji || '💡'}</span>
                    <div class="related-name">${inv.primaryInvention}</div>
                    <div class="related-invention">by ${inv.name} (${inv.inventionYear})</div>
                </a>`;
                }).join('\n                ')}
            </div>
        </section>
`;

            // Insert before related inventors section
            html = html.replace(
                /<section id="related">/,
                relatedInventionsHTML + '\n        <section id="related">'
            );
        }

        // Replace footer
        html = html.replace(
            /<footer>[\s\S]*?<\/footer>/,
            createEnhancedFooter('inventor')
        );

        // Write the updated file
        fs.writeFileSync(inventorFile, html);
        inventorPagesUpdated++;
        console.log(`✓ Updated: ${inventor.id}.html`);

    } catch (error) {
        console.error(`✗ Error updating ${inventor.id}.html:`, error.message);
    }
});

console.log(`\nInventor pages: ${inventorPagesUpdated} updated, ${inventorPagesSkipped} skipped\n`);

// Process invention pages
let inventionPagesUpdated = 0;
let inventionPagesSkipped = 0;

console.log('Processing invention pages...\n');

inventors.forEach((inventor) => {
    const inventionSlug = slugify(inventor.primaryInvention);
    const inventionFile = path.join('./invention', `${inventionSlug}.html`);

    if (!fs.existsSync(inventionFile)) {
        inventionPagesSkipped++;
        return;
    }

    try {
        let html = fs.readFileSync(inventionFile, 'utf8');

        // Check if already processed (look for breadcrumb instead)
        if (html.includes('class="breadcrumb"') && html.includes('related-inventors')) {
            return;
        }

        // Add footer CSS if not present
        if (!html.includes('footer-container')) {
            const styleClosePos = html.indexOf('</style>');
            if (styleClosePos !== -1) {
                html = html.slice(0, styleClosePos) + footerCSS + html.slice(styleClosePos);
            }
        }

        // Replace navigation
        html = html.replace(
            /<nav class="top-nav">[\s\S]*?<\/nav>/,
            createEnhancedNav('invention')
        );

        // Add breadcrumb after nav
        const breadcrumb = `\n    <!-- Breadcrumb -->\n    <div class="container">\n        <div class="breadcrumb">\n            <a href="../index.html">Home</a>\n            <span>›</span>\n            <a href="../index.html?category=${encodeURIComponent(inventor.category)}">${inventor.category}</a>\n            <span>›</span>\n            <strong>${inventor.primaryInvention}</strong>\n        </div>\n    </div>\n`;

        html = html.replace(
            /(<nav class="top-nav">[\s\S]*?<\/nav>)/,
            '$1' + breadcrumb
        );

        // Add category badge in hero section
        const categoryBadge = `\n            <a href="../index.html?category=${encodeURIComponent(inventor.category)}" class="category-badge">${inventor.category}</a>`;

        html = html.replace(
            /(<p class="hero-year">.*?<\/p>)/,
            '$1' + categoryBadge
        );

        // Add related inventors section before the inventor link section
        const relatedInventors = getRelatedInventors(inventor);

        if (relatedInventors.length > 0) {
            const relatedInventorsHTML = `
        <!-- Related Inventors in Same Category -->
        <section id="related-inventors">
            <h2>More ${inventor.category} Inventors</h2>
            <div class="related-grid">
                ${relatedInventors.map(inv => {
                    return `<a href="../inventor/${inv.id}.html" class="related-card">
                    <span class="related-emoji">${inv.inventionEmoji || '💡'}</span>
                    <div class="related-name">${inv.name}</div>
                    <div class="related-invention">${inv.primaryInvention} (${inv.inventionYear})</div>
                </a>`;
                }).join('\n                ')}
            </div>
        </section>
`;

            // Insert before the inventor-link section
            html = html.replace(
                /<div class="inventor-link">/,
                relatedInventorsHTML + '\n        <div class="inventor-link">'
            );
        }

        // Replace footer
        html = html.replace(
            /<footer>[\s\S]*?<\/footer>/,
            createEnhancedFooter('invention')
        );

        // Write the updated file
        fs.writeFileSync(inventionFile, html);
        inventionPagesUpdated++;
        console.log(`✓ Updated: ${inventionSlug}.html`);

    } catch (error) {
        console.error(`✗ Error updating ${inventionSlug}.html:`, error.message);
    }
});

console.log(`\nInvention pages: ${inventionPagesUpdated} updated, ${inventionPagesSkipped} skipped\n`);

console.log(`${'='.repeat(80)}`);
console.log('INTEGRATION COMPLETE!');
console.log(`${'='.repeat(80)}`);
console.log(`✓ Inventor pages updated: ${inventorPagesUpdated}`);
console.log(`✓ Invention pages updated: ${inventionPagesUpdated}`);
console.log(`✓ Categories integrated: ${categories.length}`);
console.log(`\nEnhancements added:`);
console.log(`  • Unified navigation across all pages`);
console.log(`  • Enhanced footer with category and region links`);
console.log(`  • Breadcrumb navigation for better UX`);
console.log(`  • Category badges with filtering links`);
console.log(`  • Related inventions on inventor pages`);
console.log(`  • Related inventors on invention pages`);
console.log(`  • Consistent branding and styling`);
console.log(`${'='.repeat(80)}\n`);
