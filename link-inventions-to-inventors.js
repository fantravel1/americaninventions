#!/usr/bin/env node

/**
 * Add invention page links to all inventor pages
 * This adds a highlighted section linking to the detailed invention page
 */

const fs = require('fs');
const path = require('path');

// Read the inventors database
const inventorsDatabase = require('./inventors-database.js');
const inventors = inventorsDatabase.inventors;

console.log(`Found ${inventors.length} inventors in database`);

// Helper function to convert invention name to slug
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Process each inventor page
let successCount = 0;
let errorCount = 0;
let notFoundCount = 0;

inventors.forEach((inventor, index) => {
    const inventorFile = path.join('./inventor', `${inventor.id}.html`);

    // Check if the inventor page exists
    if (!fs.existsSync(inventorFile)) {
        console.log(`⊘ Skipped: ${inventor.id}.html (file not found)`);
        notFoundCount++;
        return;
    }

    try {
        // Read the inventor page
        let html = fs.readFileSync(inventorFile, 'utf8');

        // Check if invention link already exists
        if (html.includes('id="invention-details"')) {
            console.log(`⊙ Skipped: ${inventor.id}.html (already has invention link)`);
            return;
        }

        const inventionSlug = slugify(inventor.primaryInvention);

        // Create the invention details section HTML
        const inventionSection = `
        <!-- Invention Details Link -->
        <section id="invention-details">
            <h2>📘 Explore the ${inventor.primaryInvention}</h2>
            <div class="invention-highlight">
                <div class="invention-highlight-content">
                    <span class="invention-highlight-emoji">${inventor.inventionEmoji || '💡'}</span>
                    <h3>Dive Deep into the ${inventor.primaryInvention}</h3>
                    <p>Discover the fascinating journey of this groundbreaking invention - from initial ideation and brainstorming, through prototyping and manufacturing challenges, to its distribution and early days in the market. Learn about the world-changing impact it has had on society.</p>
                    <p>Our comprehensive invention page covers:</p>
                    <ul>
                        <li><strong>💭 Ideation & Brainstorming:</strong> The "how," "why," and "with what" behind the invention</li>
                        <li><strong>✏️ Design Process:</strong> Sketches, iterations, and creative problem-solving</li>
                        <li><strong>🔧 Prototyping:</strong> From first models to working prototypes</li>
                        <li><strong>🏭 Manufacturing:</strong> Production challenges and scaling up</li>
                        <li><strong>📦 Distribution:</strong> Getting the invention to market</li>
                        <li><strong>🌅 Early Days:</strong> First sales, feedback, and growing momentum</li>
                        <li><strong>🌍 World Impact:</strong> How this invention changed lives globally</li>
                    </ul>
                    <a href="../invention/${inventionSlug}.html" class="invention-details-button">
                        View Complete Invention Story →
                    </a>
                </div>
            </div>
        </section>
`;

        // Find where to insert (before the "Related Inventors" section or FAQ section)
        let insertPosition = html.indexOf('<section id="related">');

        // If no related section, try FAQ
        if (insertPosition === -1) {
            insertPosition = html.indexOf('<section id="faq">');
        }

        // If still not found, try before the back button
        if (insertPosition === -1) {
            insertPosition = html.lastIndexOf('<a href="../index.html" class="back-button">');
        }

        if (insertPosition === -1) {
            console.error(`✗ Error: Could not find insertion point in ${inventor.id}.html`);
            errorCount++;
            return;
        }

        // Also add the CSS for the invention highlight section
        const css = `
        .invention-highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 3rem 2rem;
            border-radius: 12px;
            margin: 2rem 0;
            color: #ffffff;
        }

        .invention-highlight-content {
            max-width: 100%;
        }

        .invention-highlight-emoji {
            font-size: 4rem;
            display: block;
            margin-bottom: 1rem;
        }

        .invention-highlight h3 {
            color: #ffffff;
            font-size: 1.8rem;
            margin-bottom: 1rem;
        }

        .invention-highlight p {
            color: #ffffff;
            opacity: 0.95;
            margin-bottom: 1rem;
        }

        .invention-highlight ul {
            margin: 1.5rem 0;
            padding-left: 1.5rem;
        }

        .invention-highlight li {
            color: #ffffff;
            margin-bottom: 0.8rem;
            line-height: 1.6;
        }

        .invention-highlight strong {
            color: #ffd700;
        }

        .invention-details-button {
            display: inline-block;
            background: #ffffff;
            color: #667eea;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 700;
            margin-top: 1rem;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .invention-details-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
`;

        // Find the closing </style> tag and insert CSS before it
        const styleClosePosition = html.indexOf('</style>');
        if (styleClosePosition !== -1) {
            html = html.slice(0, styleClosePosition) + css + html.slice(styleClosePosition);
        }

        // Insert the invention section
        html = html.slice(0, insertPosition) + inventionSection + '\n' + html.slice(insertPosition);

        // Write the updated file
        fs.writeFileSync(inventorFile, html);
        console.log(`✓ Updated: ${inventor.id}.html (added link to ${inventionSlug}.html)`);
        successCount++;

    } catch (error) {
        console.error(`✗ Error updating ${inventor.id}.html:`, error.message);
        errorCount++;
    }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`Linking Complete!`);
console.log(`${'='.repeat(60)}`);
console.log(`✓ Successfully updated: ${successCount} pages`);
console.log(`⊘ Skipped (not found): ${notFoundCount} pages`);
console.log(`✗ Errors: ${errorCount} pages`);
console.log(`${'='.repeat(60)}\n`);
