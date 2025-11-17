#!/usr/bin/env node

/**
 * Update index.html to include invention navigation and view toggle
 */

const fs = require('fs');
const path = require('path');

// Read the index.html file
let html = fs.readFileSync('./index.html', 'utf8');

// Check if already updated
if (html.includes('id="viewToggle"')) {
    console.log('⊙ index.html already has invention view toggle');
    process.exit(0);
}

// Read the inventors database
const inventorsDatabase = require('./inventors-database.js');
const inventors = inventorsDatabase.inventors;

// Helper function to slugify
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

console.log('Updating index.html with invention navigation...\n');

// 1. Add CSS for view toggle and inventions grid
const viewToggleCSS = `
        /* View Toggle */
        .view-toggle {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            background: #1a1a1a;
            padding: 0.3rem;
            border-radius: 8px;
        }

        .view-toggle-btn {
            padding: 0.5rem 1.5rem;
            background: transparent;
            color: #ffffff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.3s;
        }

        .view-toggle-btn:hover {
            background: #333;
        }

        .view-toggle-btn.active {
            background: #667eea;
        }

        /* Inventions Grid */
        .inventions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem 0;
        }

        .invention-card {
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 2rem;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .invention-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            border-color: #667eea;
        }

        .invention-emoji {
            font-size: 4rem;
            margin-bottom: 1rem;
        }

        .invention-name {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #1a1a1a;
        }

        .invention-category {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 0.5rem;
        }

        .invention-year {
            font-size: 0.9rem;
            color: #999;
            margin-bottom: 1rem;
        }

        .invention-inventor {
            font-size: 0.95rem;
            color: #667eea;
            font-style: italic;
        }

        .hidden {
            display: none !important;
        }
`;

// Find the closing </style> tag and insert CSS
const styleClosePosition = html.indexOf('</style>');
if (styleClosePosition === -1) {
    console.error('✗ Error: Could not find </style> tag');
    process.exit(1);
}
html = html.slice(0, styleClosePosition) + viewToggleCSS + html.slice(styleClosePosition);
console.log('✓ Added CSS for view toggle and inventions grid');

// 2. Add view toggle button to navigation
const navPattern = /<div class="nav-container">/;
const navMatch = html.match(navPattern);
if (!navMatch) {
    console.error('✗ Error: Could not find nav-container');
    process.exit(1);
}

const viewToggleHTML = `<div class="nav-container">
                <div class="view-toggle" id="viewToggle">
                    <button class="view-toggle-btn active" data-view="inventors">👥 Inventors</button>
                    <button class="view-toggle-btn" data-view="inventions">💡 Inventions</button>
                </div>
                <div style="flex: 1;"></div>`;

html = html.replace(/<div class="nav-container">/, viewToggleHTML);
console.log('✓ Added view toggle buttons to navigation');

// 3. Add inventions grid container after inventors grid
const inventorsGridPattern = /<div id="inventorsGrid" class="inventors-grid">/;
const inventionsGridHTML = `
            <div id="inventionsGrid" class="inventions-grid hidden">
                <!-- Invention cards will be populated here -->
            </div>`;

html = html.replace(
    /<div id="inventorsGrid" class="inventors-grid">\s*<!-- Inventor cards will be populated here -->\s*<\/div>/,
    `<div id="inventorsGrid" class="inventors-grid">
                <!-- Inventor cards will be populated here -->
            </div>
${inventionsGridHTML}`
);
console.log('✓ Added inventions grid container');

// 4. Add JavaScript to populate inventions and handle view toggle
const inventionsJavaScript = `
    // Inventions data
    const inventionsData = ${JSON.stringify(
        inventors.map(inv => ({
            id: slugify(inv.primaryInvention),
            name: inv.primaryInvention,
            emoji: inv.inventionEmoji || '💡',
            year: inv.inventionYear,
            category: inv.category,
            inventor: inv.name,
            inventorId: inv.id,
            country: inv.country,
            flag: inv.flag
        })),
        null,
        4
    )};

    // Populate inventions grid
    function populateInventionsGrid() {
        const grid = document.getElementById('inventionsGrid');
        if (!grid) return;

        grid.innerHTML = inventionsData
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(invention => \`
                <a href="invention/\${invention.id}.html" class="invention-card">
                    <span class="invention-emoji">\${invention.emoji}</span>
                    <div class="invention-name">\${invention.name}</div>
                    <div class="invention-category">\${invention.category}</div>
                    <div class="invention-year">\${invention.year} • \${invention.country} \${invention.flag}</div>
                    <div class="invention-inventor">by \${invention.inventor}</div>
                </a>
            \`).join('');
    }

    // View toggle functionality
    function setupViewToggle() {
        const toggleButtons = document.querySelectorAll('.view-toggle-btn');
        const inventorsGrid = document.getElementById('inventorsGrid');
        const inventionsGrid = document.getElementById('inventionsGrid');
        const advancedControls = document.querySelector('.advanced-controls');
        const timelineSection = document.getElementById('timelineSection');
        const tagcloudSection = document.getElementById('tagcloudSection');
        const statsDashboard = document.getElementById('statsDashboard');
        const resultsInfo = document.querySelector('.results-info');
        const filters = document.querySelector('.filters');

        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;

                // Update active state
                toggleButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (view === 'inventors') {
                    // Show inventors view
                    inventorsGrid.classList.remove('hidden');
                    inventionsGrid.classList.add('hidden');
                    if (advancedControls) advancedControls.style.display = 'block';
                    if (timelineSection) timelineSection.style.display = 'block';
                    if (tagcloudSection) tagcloudSection.style.display = 'block';
                    if (statsDashboard) statsDashboard.style.display = 'block';
                    if (resultsInfo) resultsInfo.style.display = 'flex';
                    if (filters) filters.style.display = 'flex';
                } else {
                    // Show inventions view
                    inventorsGrid.classList.add('hidden');
                    inventionsGrid.classList.remove('hidden');
                    if (advancedControls) advancedControls.style.display = 'none';
                    if (timelineSection) timelineSection.style.display = 'none';
                    if (tagcloudSection) tagcloudSection.style.display = 'none';
                    if (statsDashboard) statsDashboard.style.display = 'none';
                    if (resultsInfo) resultsInfo.style.display = 'none';
                    if (filters) filters.style.display = 'none';
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            populateInventionsGrid();
            setupViewToggle();
        });
    } else {
        populateInventionsGrid();
        setupViewToggle();
    }
`;

// Find where to insert the JavaScript (before closing </script> tag at the end)
const scriptEndPattern = /<\/script>\s*<\/body>/;
const scriptMatch = html.match(scriptEndPattern);
if (!scriptMatch) {
    console.error('✗ Error: Could not find script closing tag');
    process.exit(1);
}

html = html.replace(scriptEndPattern, inventionsJavaScript + '\n    </script>\n</body>');
console.log('✓ Added JavaScript for inventions view');

// Write the updated file
fs.writeFileSync('./index.html', html);

console.log('\n' + '='.repeat(60));
console.log('✓ Successfully updated index.html with invention navigation!');
console.log('='.repeat(60));
console.log(`Added ${inventors.length} inventions to the view`);
console.log('Users can now toggle between Inventors and Inventions views');
console.log('='.repeat(60) + '\n');
