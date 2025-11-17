#!/usr/bin/env node

/**
 * Fix and verify integration across all pages
 * - Fix spacing issues in breadcrumb
 * - Verify all enhancements are present
 * - Generate integration report
 */

const fs = require('fs');
const path = require('path');

// Read the inventors database
const inventorsDatabase = require('./inventors-database.js');
const inventors = inventorsDatabase.inventors;

console.log(`\n${'='.repeat(80)}`);
console.log('FIX AND VERIFY INTEGRATION');
console.log(`${'='.repeat(80)}\n`);

let inventorPagesFixed = 0;
let inventionPagesFixed = 0;
const issues = [];

// Fix inventor pages
console.log('Fixing and verifying inventor pages...\n');

inventors.forEach((inventor) => {
    const inventorFile = path.join('./inventor', `${inventor.id}.html`);

    if (!fs.existsSync(inventorFile)) {
        return;
    }

    try {
        let html = fs.readFileSync(inventorFile, 'utf8');
        let modified = false;

        // Fix spacing issue in breadcrumb
        if (html.includes('}>  ${inventor.category}</a>')) {
            html = html.replace(
                />\s\s+([^<]+)<\/a>/g,
                (match, p1) => `>${p1.trim()}</a>`
            );
            modified = true;
        }

        // Verify all key components are present
        const checks = {
            breadcrumb: html.includes('class="breadcrumb"'),
            categoryBadge: html.includes('category-badge'),
            relatedInventions: html.includes('related-inventions'),
            enhancedFooter: html.includes('footer-container'),
            enhancedNav: html.includes('Heroes of Innovation')
        };

        const missingComponents = Object.keys(checks).filter(k => !checks[k]);
        if (missingComponents.length > 0) {
            issues.push({
                file: inventor.id,
                type: 'inventor',
                missing: missingComponents
            });
        }

        if (modified) {
            fs.writeFileSync(inventorFile, html);
            inventorPagesFixed++;
            console.log(`✓ Fixed: ${inventor.id}.html`);
        }

    } catch (error) {
        issues.push({
            file: inventor.id,
            type: 'inventor',
            error: error.message
        });
    }
});

// Fix invention pages
console.log('\nFixing and verifying invention pages...\n');

function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

inventors.forEach((inventor) => {
    const inventionSlug = slugify(inventor.primaryInvention);
    const inventionFile = path.join('./invention', `${inventionSlug}.html`);

    if (!fs.existsSync(inventionFile)) {
        return;
    }

    try {
        let html = fs.readFileSync(inventionFile, 'utf8');
        let modified = false;

        // Fix spacing issue in breadcrumb
        if (html.includes('}>  ')) {
            html = html.replace(
                />\s\s+([^<]+)<\/a>/g,
                (match, p1) => `>${p1.trim()}</a>`
            );
            modified = true;
        }

        // Verify all key components are present
        const checks = {
            breadcrumb: html.includes('class="breadcrumb"'),
            categoryBadge: html.includes('category-badge'),
            relatedInventors: html.includes('related-inventors'),
            enhancedFooter: html.includes('footer-container'),
            enhancedNav: html.includes('Heroes of Innovation')
        };

        const missingComponents = Object.keys(checks).filter(k => !checks[k]);
        if (missingComponents.length > 0) {
            issues.push({
                file: inventionSlug,
                type: 'invention',
                missing: missingComponents
            });
        }

        if (modified) {
            fs.writeFileSync(inventionFile, html);
            inventionPagesFixed++;
            console.log(`✓ Fixed: ${inventionSlug}.html`);
        }

    } catch (error) {
        issues.push({
            file: inventionSlug,
            type: 'invention',
            error: error.message
        });
    }
});

// Generate report
console.log(`\n${'='.repeat(80)}`);
console.log('INTEGRATION REPORT');
console.log(`${'='.repeat(80)}`);
console.log(`✓ Inventor pages fixed: ${inventorPagesFixed}`);
console.log(`✓ Invention pages fixed: ${inventionPagesFixed}`);

if (issues.length > 0) {
    console.log(`\n⚠ Issues found: ${issues.length}\n`);
    issues.forEach(issue => {
        console.log(`  ${issue.type}: ${issue.file}`);
        if (issue.missing) {
            console.log(`    Missing: ${issue.missing.join(', ')}`);
        }
        if (issue.error) {
            console.log(`    Error: ${issue.error}`);
        }
    });
} else {
    console.log(`\n✓ No issues found! All pages properly integrated.`);
}

console.log(`\n${'='.repeat(80)}\n`);
