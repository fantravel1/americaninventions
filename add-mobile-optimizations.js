#!/usr/bin/env node

/**
 * Add mobile optimizations to all pages:
 * - Hamburger menu for mobile
 * - Touch-friendly buttons
 * - Mobile-responsive CSS
 * - Meta viewport verification
 */

const fs = require('fs');
const path = require('path');

console.log(`\n${'='.repeat(80)}`);
console.log('ADD MOBILE OPTIMIZATIONS');
console.log(`${'='.repeat(80)}\n`);

// Mobile menu CSS and JavaScript
const mobileMenuCSS = `
        /* Mobile Menu Toggle */
        .mobile-menu-toggle {
            display: none;
            background: transparent;
            border: none;
            color: #ffffff;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            transition: transform 0.3s;
        }

        .mobile-menu-toggle:active {
            transform: scale(0.95);
        }

        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block;
            }

            .nav-links {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: #000000;
                flex-direction: column;
                padding: 1rem 0;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                gap: 0;
            }

            .nav-links.active {
                display: flex;
            }

            .nav-links a {
                padding: 1rem 1.5rem;
                border-bottom: 1px solid #222;
                margin: 0;
            }

            .nav-links a:last-child {
                border-bottom: none;
            }

            .nav-container {
                position: relative;
            }

            /* Touch-friendly buttons */
            button, .filter-btn, .view-toggle-btn {
                min-height: 44px;
                min-width: 44px;
            }

            /* Larger touch targets for cards */
            .inventor-card, .invention-card, .related-card {
                padding: 1.5rem;
            }

            /* Better mobile spacing */
            .hero {
                padding: 2rem 0;
            }

            .container {
                padding: 0 1rem;
            }

            h1 {
                font-size: 1.75rem;
            }

            h2 {
                font-size: 1.5rem;
            }

            /* Mobile-friendly footer */
            .footer-main {
                grid-template-columns: 1fr;
                gap: 2rem;
            }

            /* Prevent horizontal scroll */
            body {
                overflow-x: hidden;
            }

            /* Make tables scrollable */
            table {
                display: block;
                overflow-x: auto;
                white-space: nowrap;
            }
        }

        /* Touch feedback for all interactive elements */
        @media (hover: none) {
            a:active, button:active, .filter-btn:active {
                opacity: 0.7;
            }
        }
`;

const mobileMenuJS = `
    // Mobile menu toggle functionality
    function initMobileMenu() {
        const nav = document.querySelector('.top-nav');
        if (!nav) return;

        const navLinks = nav.querySelector('.nav-links');
        if (!navLinks) return;

        // Check if toggle button already exists
        if (nav.querySelector('.mobile-menu-toggle')) return;

        // Create mobile menu toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
        toggleBtn.innerHTML = '☰';

        // Insert toggle button before nav links
        const navContainer = nav.querySelector('.nav-container');
        navContainer.insertBefore(toggleBtn, navLinks);

        // Toggle menu on button click
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            toggleBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target)) {
                navLinks.classList.remove('active');
                toggleBtn.innerHTML = '☰';
            }
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggleBtn.innerHTML = '☰';
            });
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }
`;

// Process all HTML files
function processHTMLFile(filePath, fileType) {
    try {
        let html = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Ensure meta viewport exists
        if (!html.includes('name="viewport"')) {
            const headMatch = html.match(/<head[^>]*>/);
            if (headMatch) {
                const headEndPos = html.indexOf('>', headMatch.index) + 1;
                const viewportTag = '\n    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">';
                html = html.slice(0, headEndPos) + viewportTag + html.slice(headEndPos);
                modified = true;
            }
        }

        // Add mobile CSS if not present
        if (html.includes('.top-nav') && !html.includes('mobile-menu-toggle')) {
            const styleClosePos = html.indexOf('</style>');
            if (styleClosePos !== -1) {
                html = html.slice(0, styleClosePos) + mobileMenuCSS + html.slice(styleClosePos);
                modified = true;
            }
        }

        // Add mobile menu JS if not present
        if (html.includes('.top-nav') && !html.includes('initMobileMenu')) {
            const bodyClosePos = html.lastIndexOf('</body>');
            if (bodyClosePos !== -1) {
                const script = `\n    <script>\n    ${mobileMenuJS}\n    </script>\n`;
                html = html.slice(0, bodyClosePos) + script + html.slice(bodyClosePos);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, html);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

let stats = {
    inventors: 0,
    inventions: 0,
    blog: 0,
    main: 0
};

// Process index.html
console.log('Processing main pages...');
if (processHTMLFile('./index.html', 'main')) {
    stats.main++;
    console.log('✓ index.html');
}

// Process inventor pages
console.log('\nProcessing inventor pages...');
const inventorDir = './inventor';
const inventorFiles = fs.readdirSync(inventorDir).filter(f => f.endsWith('.html'));
inventorFiles.forEach(file => {
    if (processHTMLFile(path.join(inventorDir, file), 'inventor')) {
        stats.inventors++;
    }
});
console.log(`✓ Processed ${stats.inventors} inventor pages`);

// Process invention pages
console.log('\nProcessing invention pages...');
const inventionDir = './invention';
const inventionFiles = fs.readdirSync(inventionDir).filter(f => f.endsWith('.html'));
inventionFiles.forEach(file => {
    if (processHTMLFile(path.join(inventionDir, file), 'invention')) {
        stats.inventions++;
    }
});
console.log(`✓ Processed ${stats.inventions} invention pages`);

// Process blog pages
console.log('\nProcessing blog pages...');
const blogDir = './blog';
const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
blogFiles.forEach(file => {
    if (processHTMLFile(path.join(blogDir, file), 'blog')) {
        stats.blog++;
    }
});
console.log(`✓ Processed ${stats.blog} blog pages`);

console.log(`\n${'='.repeat(80)}`);
console.log('MOBILE OPTIMIZATIONS COMPLETE!');
console.log(`${'='.repeat(80)}`);
console.log(`Pages updated:`);
console.log(`  • Main: ${stats.main}`);
console.log(`  • Inventors: ${stats.inventors}`);
console.log(`  • Inventions: ${stats.inventions}`);
console.log(`  • Blog: ${stats.blog}`);
console.log(`  • Total: ${stats.main + stats.inventors + stats.inventions + stats.blog}`);
console.log(`\nMobile features added:`);
console.log(`  ✓ Hamburger menu for mobile navigation`);
console.log(`  ✓ Touch-friendly button sizes (44px minimum)`);
console.log(`  ✓ Responsive layout improvements`);
console.log(`  ✓ Meta viewport tags`);
console.log(`  ✓ Prevent horizontal scroll`);
console.log(`  ✓ Touch feedback for interactive elements`);
console.log(`${'='.repeat(80)}\n`);
