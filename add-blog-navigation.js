#!/usr/bin/env node

/**
 * Add unified navigation header to all blog pages
 */

const fs = require('fs');
const path = require('path');

console.log(`\n${'='.repeat(80)}`);
console.log('ADD UNIFIED NAVIGATION TO BLOG PAGES');
console.log(`${'='.repeat(80)}\n`);

// Create unified navigation HTML for blog pages
function createBlogNav() {
    return `<!-- Unified Navigation -->
    <nav class="top-nav">
        <div class="nav-container">
            <a href="../index.html" class="nav-logo">💡 Heroes of Innovation</a>
            <div class="nav-links">
                <a href="../index.html">🏠 Home</a>
                <a href="../index.html">👥 Inventors</a>
                <a href="../index.html">💡 Inventions</a>
                <a href="../index.html#tagcloudSection">📚 Categories</a>
                <a href="index.html">📝 Blog</a>
            </div>
        </div>
    </nav>
`;
}

// CSS for navigation
const navCSS = `
        /* Unified Top Navigation */
        .top-nav {
            background: #000000;
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .nav-logo {
            color: #ffffff;
            text-decoration: none;
            font-size: 1.2rem;
            font-weight: 700;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
        }

        .nav-links a {
            color: #ffffff;
            text-decoration: none;
            transition: opacity 0.3s;
            font-size: 0.95rem;
        }

        .nav-links a:hover {
            opacity: 0.7;
        }

        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
        }
`;

// Get all blog HTML files
const blogDir = './blog';
const blogFiles = fs.readdirSync(blogDir).filter(file => file.endsWith('.html'));

console.log(`Found ${blogFiles.length} blog pages\n`);

let updatedCount = 0;
let skippedCount = 0;

blogFiles.forEach(file => {
    const filePath = path.join(blogDir, file);

    try {
        let html = fs.readFileSync(filePath, 'utf8');

        // Check if already has unified navigation
        if (html.includes('class="top-nav"')) {
            console.log(`⊙ Skipped: ${file} (already has navigation)`);
            skippedCount++;
            return;
        }

        // Add navigation CSS if not present
        if (!html.includes('.top-nav')) {
            const styleClosePos = html.indexOf('</style>');
            if (styleClosePos !== -1) {
                html = html.slice(0, styleClosePos) + navCSS + html.slice(styleClosePos);
            }
        }

        // Add navigation before the header or body content
        const bodyMatch = html.match(/<body[^>]*>/);
        if (bodyMatch) {
            const bodyEndPos = html.indexOf('>', bodyMatch.index) + 1;
            html = html.slice(0, bodyEndPos) + '\n' + createBlogNav() + html.slice(bodyEndPos);

            fs.writeFileSync(filePath, html);
            updatedCount++;
            console.log(`✓ Updated: ${file}`);
        } else {
            console.log(`✗ Error: ${file} - Could not find <body> tag`);
        }

    } catch (error) {
        console.error(`✗ Error updating ${file}:`, error.message);
    }
});

console.log(`\n${'='.repeat(80)}`);
console.log('BLOG NAVIGATION UPDATE COMPLETE!');
console.log(`${'='.repeat(80)}`);
console.log(`✓ Updated: ${updatedCount} pages`);
console.log(`⊙ Skipped: ${skippedCount} pages`);
console.log(`${'='.repeat(80)}\n`);
