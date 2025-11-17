#!/usr/bin/env node

/**
 * Enhance the hero section on index.html with:
 * - Eye-catching gradient background
 * - Better visual hierarchy
 * - Animated elements
 * - Top navigation menu
 * - Call-to-action buttons
 * - Improved mobile responsiveness
 * - Real stats from database
 */

const fs = require('fs');
const path = require('path');

console.log(`\n${'='.repeat(80)}`);
console.log('ENHANCE HERO SECTION & ADD TOP NAVIGATION');
console.log(`${'='.repeat(80)}\n`);

// Read inventors database for real stats
const inventorsDatabase = require('./inventors-database.js');
const inventors = inventorsDatabase.inventors;

// Calculate real stats
const stats = {
    inventors: inventors.length,
    countries: [...new Set(inventors.map(inv => inv.country))].length,
    inventions: inventors.length, // One primary invention per inventor
    categories: [...new Set(inventors.map(inv => inv.category))].length,
    years: new Date().getFullYear() - 1800 // 1800 to now
};

console.log('Real Statistics from Database:');
console.log(`  Inventors: ${stats.inventors}`);
console.log(`  Countries: ${stats.countries}`);
console.log(`  Inventions: ${stats.inventions}`);
console.log(`  Categories: ${stats.categories}`);
console.log(`  Years: ${stats.years}`);
console.log('');

// Read index.html
let html = fs.readFileSync('./index.html', 'utf8');

// New enhanced hero CSS
const enhancedHeroCSS = `
        /* Enhanced Hero Section */
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            color: #ffffff;
            padding: 4rem 0 3rem;
            position: relative;
            overflow: hidden;
            text-align: center;
        }

        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Animated background pattern */
        header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background:
                radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
            animation: pulse 8s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }

        .header-content {
            position: relative;
            z-index: 2;
            animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .hero-icon {
            font-size: 6rem;
            margin-bottom: 1rem;
            display: inline-block;
            animation: float 3s ease-in-out infinite;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        h1 {
            font-size: clamp(2.5rem, 6vw, 5rem);
            font-weight: 800;
            margin-bottom: 1rem;
            letter-spacing: -0.02em;
            text-shadow: 0 2px 20px rgba(0,0,0,0.3);
            background: linear-gradient(to right, #ffffff, #f0f0f0, #ffffff);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shine 3s linear infinite;
        }

        @keyframes shine {
            to {
                background-position: 200% center;
            }
        }

        .subtitle {
            font-size: clamp(1.1rem, 2.5vw, 1.6rem);
            opacity: 0.95;
            margin-bottom: 2.5rem;
            font-weight: 400;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }

        .hero-cta {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin: 2rem 0;
            flex-wrap: wrap;
        }

        .cta-button {
            padding: 1rem 2.5rem;
            font-size: 1.1rem;
            font-weight: 600;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .cta-primary {
            background: #ffffff;
            color: #667eea;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .cta-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 25px rgba(0,0,0,0.3);
            background: #f0f0f0;
        }

        .cta-secondary {
            background: rgba(255,255,255,0.2);
            color: #ffffff;
            border: 2px solid #ffffff;
            backdrop-filter: blur(10px);
        }

        .cta-secondary:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-3px);
        }

        .hero-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 3rem;
            max-width: 1000px;
            margin-left: auto;
            margin-right: auto;
            padding: 0 1rem;
        }

        .stat-item {
            text-align: center;
            padding: 2rem 1rem;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 20px;
            transition: all 0.3s ease;
            animation: fadeInUp 1s ease-out;
            animation-fill-mode: both;
        }

        .stat-item:nth-child(1) { animation-delay: 0.1s; }
        .stat-item:nth-child(2) { animation-delay: 0.2s; }
        .stat-item:nth-child(3) { animation-delay: 0.3s; }
        .stat-item:nth-child(4) { animation-delay: 0.4s; }

        .stat-item:hover {
            background: rgba(255,255,255,0.25);
            border-color: rgba(255,255,255,0.5);
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .stat-number {
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 800;
            display: block;
            margin-bottom: 0.5rem;
            color: #ffffff;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .stat-label {
            font-size: clamp(0.85rem, 1.5vw, 1rem);
            opacity: 0.95;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-weight: 600;
            color: #ffffff;
        }

        /* Top Navigation Bar */
        .top-navbar {
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 20px rgba(0,0,0,0.3);
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .top-navbar-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navbar-logo {
            font-size: 1.3rem;
            font-weight: 700;
            color: #ffffff;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: opacity 0.3s;
        }

        .navbar-logo:hover {
            opacity: 0.8;
        }

        .navbar-menu {
            display: flex;
            gap: 2rem;
            align-items: center;
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .navbar-menu a {
            color: #ffffff;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s;
            padding: 0.5rem 1rem;
            border-radius: 6px;
        }

        .navbar-menu a:hover {
            background: rgba(255,255,255,0.1);
            color: #00f2fe;
        }

        /* Mobile styles */
        @media (max-width: 768px) {
            header {
                padding: 3rem 0 2rem;
            }

            .hero-icon {
                font-size: 4rem;
            }

            h1 {
                font-size: 2.5rem;
            }

            .subtitle {
                font-size: 1.1rem;
                padding: 0 1rem;
            }

            .hero-cta {
                flex-direction: column;
                padding: 0 1rem;
            }

            .cta-button {
                width: 100%;
                justify-content: center;
            }

            .hero-stats {
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }

            .stat-item {
                padding: 1.5rem 1rem;
            }

            .stat-number {
                font-size: 2rem;
            }

            .stat-label {
                font-size: 0.75rem;
            }

            .navbar-menu {
                display: none; /* Will use hamburger menu */
            }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
            .hero-stats {
                grid-template-columns: repeat(2, 1fr);
            }
        }`;

// New enhanced hero HTML structure
const enhancedHeroHTML = `    <!-- Top Navigation Bar -->
    <nav class="top-navbar">
        <div class="top-navbar-container">
            <a href="#" class="navbar-logo">
                💡 Heroes of Innovation
            </a>
            <ul class="navbar-menu">
                <li><a href="#inventorsGrid">Inventors</a></li>
                <li><a href="#inventionsGrid">Inventions</a></li>
                <li><a href="#tagcloudSection">Categories</a></li>
                <li><a href="#timelineSection">Timeline</a></li>
                <li><a href="blog/index.html">Blog</a></li>
            </ul>
            <button class="mobile-menu-toggle" aria-label="Toggle menu">☰</button>
        </div>
    </nav>

    <header>
        <div class="container">
            <div class="header-content">
                <div class="hero-icon">💡</div>
                <h1>Heroes of Innovation</h1>
                <p class="subtitle">Celebrating the Revolutionary Contributions of ${stats.inventors} Black and Brown Inventors Who Changed the World</p>

                <div class="hero-cta">
                    <a href="#inventorsGrid" class="cta-button cta-primary">
                        <span>👥</span> Explore Inventors
                    </a>
                    <a href="#tagcloudSection" class="cta-button cta-secondary">
                        <span>📚</span> Browse Categories
                    </a>
                </div>

                <div class="hero-stats" id="heroStats">
                    <div class="stat-item">
                        <span class="stat-number">${stats.inventors}</span>
                        <span class="stat-label">Inventors</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.countries}</span>
                        <span class="stat-label">Countries</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.categories}</span>
                        <span class="stat-label">Categories</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${stats.years}+</span>
                        <span class="stat-label">Years of Innovation</span>
                    </div>
                </div>
            </div>
        </div>
    </header>`;

// Replace the old header section
const oldHeaderPattern = /<header>[\s\S]*?<\/header>/;
html = html.replace(oldHeaderPattern, enhancedHeroHTML);

// Replace the old header CSS
const oldHeaderCSSPattern = /\/\* Header \*\/[\s\S]*?\/\* Navigation \*/;
html = html.replace(oldHeaderCSSPattern, enhancedHeroCSS + '\n        /* Navigation */');

// Write the updated file
fs.writeFileSync('./index.html', html);

console.log('✓ Enhanced hero section with:');
console.log('  - Animated gradient background');
console.log('  - Floating icon animation');
console.log('  - Shimmering title effect');
console.log('  - Call-to-action buttons');
console.log('  - Glass-morphism stat cards');
console.log('  - Real statistics from database');
console.log('  - Top navigation bar');
console.log('  - Improved mobile responsiveness');
console.log('  - Fade-in animations');
console.log('');

console.log(`${'='.repeat(80)}`);
console.log('HERO SECTION ENHANCEMENT COMPLETE!');
console.log(`${'='.repeat(80)}\n`);
