#!/usr/bin/env node

/**
 * Integrate all remaining inventor pages that weren't in the database
 */

const fs = require('fs');
const path = require('path');

console.log(`\n${'='.repeat(80)}`);
console.log('INTEGRATE REMAINING INVENTOR PAGES');
console.log(`${'='.repeat(80)}\n`);

// Read the inventors database to get list of integrated IDs
const inventorsDatabase = require('./inventors-database.js');
const integratedIds = new Set(inventorsDatabase.inventors.map(inv => inv.id));

console.log(`Database has ${integratedIds.size} inventors\n`);

// Get all unique categories
const categories = [...new Set(inventorsDatabase.inventors.map(inv => inv.category))].sort();

// Create enhanced navigation HTML
function createEnhancedNav() {
    return `<nav class="top-nav">
        <div class="nav-container">
            <a href="../index.html" class="nav-logo">💡 Heroes of Innovation</a>
            <div class="nav-links">
                <a href="../index.html">🏠 Home</a>
                <a href="../index.html">👥 Inventors</a>
                <a href="../index.html">💡 Inventions</a>
                <a href="../index.html#tagcloudSection">📚 Categories</a>
                <a href="../blog/index.html">📝 Blog</a>
            </div>
        </div>
    </nav>`;
}

// Create enhanced footer HTML
function createEnhancedFooter() {
    const categoryLinks = categories.map(cat =>
        `<li><a href="../index.html?category=${encodeURIComponent(cat)}">${cat}</a></li>`
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
                        <li><a href="../index.html">All Inventors</a></li>
                        <li><a href="../index.html">All Inventions</a></li>
                        <li><a href="../index.html#timelineSection">Timeline</a></li>
                        <li><a href="../index.html#tagcloudSection">Categories</a></li>
                        <li><a href="../index.html#statsDashboard">Statistics</a></li>
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
                        <li><a href="../index.html?region=north-america">🌎 North America</a></li>
                        <li><a href="../index.html?region=south-america">🌎 South America</a></li>
                        <li><a href="../index.html?region=caribbean">🏝️ Caribbean</a></li>
                        <li><a href="../index.html?region=central-america">🌎 Central America</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>&copy; 2025 Heroes of Innovation | Celebrating Black and Brown Inventors Across the Americas</p>
                <p>
                    <a href="../index.html">www.americaninventions.org</a> •
                    <a href="../index.html#about">About</a> •
                    <a href="../index.html#contact">Contact</a>
                </p>
            </div>
        </div>
    </footer>`;
}

// CSS for enhanced footer and breadcrumb
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

// Get all inventor files
const inventorDir = './inventor';
const allInventorFiles = fs.readdirSync(inventorDir).filter(f => f.endsWith('.html'));

// Find files not in database
const remainingFiles = allInventorFiles.filter(file => {
    const id = file.replace('.html', '');
    return !integratedIds.has(id);
});

console.log(`Found ${allInventorFiles.length} total inventor pages`);
console.log(`${integratedIds.size} already integrated`);
console.log(`${remainingFiles.length} need integration\n`);

let updatedCount = 0;

remainingFiles.forEach(file => {
    const filePath = path.join(inventorDir, file);

    try {
        let html = fs.readFileSync(filePath, 'utf8');

        // Check if already has the features (in case script was run before)
        if (html.includes('class="breadcrumb"') && html.includes('footer-container')) {
            console.log(`⊙ Skipped: ${file} (already integrated)`);
            return;
        }

        // Add footer CSS if not present
        if (!html.includes('footer-container')) {
            const styleClosePos = html.indexOf('</style>');
            if (styleClosePos !== -1) {
                html = html.slice(0, styleClosePos) + footerCSS + html.slice(styleClosePos);
            }
        }

        // Replace or add navigation
        if (html.includes('<nav class="top-nav">')) {
            html = html.replace(
                /<nav class="top-nav">[\s\S]*?<\/nav>/,
                createEnhancedNav()
            );
        } else {
            // Find body tag and insert after it
            const bodyMatch = html.match(/<body[^>]*>/);
            if (bodyMatch) {
                const bodyEndPos = html.indexOf('>', bodyMatch.index) + 1;
                html = html.slice(0, bodyEndPos) + '\n    ' + createEnhancedNav() + html.slice(bodyEndPos);
            }
        }

        // Add breadcrumb after nav (simple version without category since we don't have the data)
        if (!html.includes('class="breadcrumb"')) {
            const navEndMatch = html.match(/<\/nav>\s*\n/);
            if (navEndMatch) {
                const breadcrumb = `
    <!-- Breadcrumb -->
    <div class="container">
        <div class="breadcrumb">
            <a href="../index.html">Home</a>
            <span>›</span>
            <a href="../index.html">All Inventors</a>
            <span>›</span>
            <strong>${file.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
        </div>
    </div>
`;
                const insertPos = navEndMatch.index + navEndMatch[0].length;
                html = html.slice(0, insertPos) + breadcrumb + html.slice(insertPos);
            }
        }

        // Replace footer
        html = html.replace(
            /<footer>[\s\S]*?<\/footer>/,
            createEnhancedFooter()
        );

        // Write the updated file
        fs.writeFileSync(filePath, html);
        updatedCount++;
        console.log(`✓ Updated: ${file}`);

    } catch (error) {
        console.error(`✗ Error updating ${file}:`, error.message);
    }
});

console.log(`\n${'='.repeat(80)}`);
console.log('INTEGRATION COMPLETE!');
console.log(`${'='.repeat(80)}`);
console.log(`✓ Updated: ${updatedCount} pages`);
console.log(`${'='.repeat(80)}\n`);
