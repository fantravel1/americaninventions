#!/usr/bin/env node

/**
 * Verify all pages have proper navigation and create comprehensive report
 */

const fs = require('fs');
const path = require('path');

console.log(`\n${'='.repeat(80)}`);
console.log('COMPREHENSIVE NAVIGATION VERIFICATION');
console.log(`${'='.repeat(80)}\n`);

const results = {
    index: { file: 'index.html', hasNav: false, hasSearch: false },
    inventors: [],
    inventions: [],
    blog: []
};

// Check index.html
try {
    const indexHtml = fs.readFileSync('./index.html', 'utf8');
    results.index.hasNav = indexHtml.includes('class="search-nav"') || indexHtml.includes('nav-container');
    results.index.hasSearch = indexHtml.includes('searchInput');
} catch (error) {
    console.error('Error checking index.html:', error.message);
}

// Check inventor pages
const inventorDir = './inventor';
if (fs.existsSync(inventorDir)) {
    const inventorFiles = fs.readdirSync(inventorDir).filter(f => f.endsWith('.html'));
    inventorFiles.forEach(file => {
        try {
            const html = fs.readFileSync(path.join(inventorDir, file), 'utf8');
            results.inventors.push({
                file,
                hasNav: html.includes('class="top-nav"'),
                hasBreadcrumb: html.includes('class="breadcrumb"'),
                hasFooter: html.includes('footer-container'),
                hasRelated: html.includes('related-inventions')
            });
        } catch (error) {
            console.error(`Error checking ${file}:`, error.message);
        }
    });
}

// Check invention pages
const inventionDir = './invention';
if (fs.existsSync(inventionDir)) {
    const inventionFiles = fs.readdirSync(inventionDir).filter(f => f.endsWith('.html'));
    inventionFiles.forEach(file => {
        try {
            const html = fs.readFileSync(path.join(inventionDir, file), 'utf8');
            results.inventions.push({
                file,
                hasNav: html.includes('class="top-nav"'),
                hasBreadcrumb: html.includes('class="breadcrumb"'),
                hasFooter: html.includes('footer-container'),
                hasRelated: html.includes('related-inventors')
            });
        } catch (error) {
            console.error(`Error checking ${file}:`, error.message);
        }
    });
}

// Check blog pages
const blogDir = './blog';
if (fs.existsSync(blogDir)) {
    const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));
    blogFiles.forEach(file => {
        try {
            const html = fs.readFileSync(path.join(blogDir, file), 'utf8');
            results.blog.push({
                file,
                hasNav: html.includes('class="top-nav"')
            });
        } catch (error) {
            console.error(`Error checking ${file}:`, error.message);
        }
    });
}

// Generate report
console.log('📊 NAVIGATION VERIFICATION REPORT\n');

console.log('Index Page:');
console.log(`  ✓ Navigation: ${results.index.hasNav ? 'YES' : 'NO'}`);
console.log(`  ✓ Search: ${results.index.hasSearch ? 'YES' : 'NO'}`);
console.log('');

console.log(`Inventor Pages (${results.inventors.length} total):`);
const inventorIssues = results.inventors.filter(p => !p.hasNav || !p.hasBreadcrumb || !p.hasFooter || !p.hasRelated);
if (inventorIssues.length === 0) {
    console.log('  ✓ All inventor pages have complete navigation');
} else {
    console.log(`  ⚠ ${inventorIssues.length} pages have issues:`);
    inventorIssues.slice(0, 5).forEach(p => {
        console.log(`    - ${p.file}`);
        if (!p.hasNav) console.log(`      Missing: Navigation`);
        if (!p.hasBreadcrumb) console.log(`      Missing: Breadcrumb`);
        if (!p.hasFooter) console.log(`      Missing: Enhanced footer`);
        if (!p.hasRelated) console.log(`      Missing: Related inventions`);
    });
    if (inventorIssues.length > 5) {
        console.log(`    ... and ${inventorIssues.length - 5} more`);
    }
}
console.log('');

console.log(`Invention Pages (${results.inventions.length} total):`);
const inventionIssues = results.inventions.filter(p => !p.hasNav || !p.hasBreadcrumb || !p.hasFooter || !p.hasRelated);
if (inventionIssues.length === 0) {
    console.log('  ✓ All invention pages have complete navigation');
} else {
    console.log(`  ⚠ ${inventionIssues.length} pages have issues:`);
    inventionIssues.slice(0, 5).forEach(p => {
        console.log(`    - ${p.file}`);
        if (!p.hasNav) console.log(`      Missing: Navigation`);
        if (!p.hasBreadcrumb) console.log(`      Missing: Breadcrumb`);
        if (!p.hasFooter) console.log(`      Missing: Enhanced footer`);
        if (!p.hasRelated) console.log(`      Missing: Related inventors`);
    });
    if (inventionIssues.length > 5) {
        console.log(`    ... and ${inventionIssues.length - 5} more`);
    }
}
console.log('');

console.log(`Blog Pages (${results.blog.length} total):`);
const blogIssues = results.blog.filter(p => !p.hasNav);
if (blogIssues.length === 0) {
    console.log('  ✓ All blog pages have navigation');
} else {
    console.log(`  ⚠ ${blogIssues.length} pages missing navigation:`);
    blogIssues.forEach(p => console.log(`    - ${p.file}`));
}
console.log('');

console.log(`${'='.repeat(80)}`);
console.log('SUMMARY');
console.log(`${'='.repeat(80)}`);
console.log(`Total Pages: ${1 + results.inventors.length + results.inventions.length + results.blog.length}`);
console.log(`  • Index: 1`);
console.log(`  • Inventors: ${results.inventors.length}`);
console.log(`  • Inventions: ${results.inventions.length}`);
console.log(`  • Blog: ${results.blog.length}`);
console.log('');

const allIssues = inventorIssues.length + inventionIssues.length + blogIssues.length;
if (allIssues === 0) {
    console.log('✅ ALL PAGES HAVE COMPLETE NAVIGATION!');
} else {
    console.log(`⚠️  ${allIssues} pages have navigation issues`);
}
console.log(`${'='.repeat(80)}\n`);
