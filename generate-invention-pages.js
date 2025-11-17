#!/usr/bin/env node

/**
 * Generate comprehensive invention pages from the inventors database
 * Each page includes: ideation, prototyping, manufacturing, distribution, early days, world impact, and inventor link
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

// Helper function to generate color gradients (unique per invention)
const gradients = [
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
];

function getGradient(index) {
    return gradients[index % gradients.length];
}

// Helper to generate detailed content for each section
function generateIdeationContent(inventor, invention, year, category) {
    const templates = {
        'Medicine & Healthcare': `The genesis of the ${invention} emerged from a profound need in the medical field. ${inventor.name} observed firsthand the challenges faced by patients and medical practitioners. Through meticulous observation and scientific inquiry, they identified a critical gap that existing solutions failed to address.

The "why" was rooted in improving patient outcomes and accessibility to healthcare. The "how" began with ${inventor.name}'s deep understanding of ${category.toLowerCase()} principles, combined with innovative thinking that challenged conventional approaches.

Working with materials and methods available in the early ${Math.floor(year/10)*10}s, ${inventor.name} began sketching initial concepts. The ideation phase involved extensive research into biological systems, chemical compounds, and mechanical processes. They collaborated with colleagues, consulted medical literature, and drew inspiration from both traditional practices and emerging scientific discoveries.`,

        'Electronics & Computing': `In the realm of electronics and computing, the ${invention} was conceived during a pivotal moment in technological evolution. ${inventor.name} recognized that existing systems were limited by fundamental architectural constraints.

The ideation began with a simple question: "What if we could process information differently?" This led to months of theoretical work, circuit diagrams sketched on paper, and late-night sessions exploring new possibilities. The "with what" included rudimentary electronic components, soldering equipment, and early computational theory.

${inventor.name}'s background in ${category.toLowerCase()} provided the foundation, but it was their willingness to question assumptions that sparked true innovation. They studied existing patents, analyzed competitor designs, and identified inefficiencies that others had accepted as inevitable.`,

        'Engineering & Manufacturing': `The ${invention} was born from ${inventor.name}'s acute awareness of inefficiencies in manufacturing and production processes. Observing workers struggle with existing tools and methods, they envisioned a better way.

The ideation phase centered on principles of mechanical advantage, material science, and ergonomic design. ${inventor.name} spent countless hours in workshops, observing, measuring, and sketching. They understood that any solution must be practical, affordable, and easy to maintain.

Working with metals, gears, and mechanisms common to the era, ${inventor.name} began to conceptualize a system that would revolutionize the industry. The "why" was economic efficiency and worker safety; the "how" involved leveraging physics and engineering principles in novel combinations.`,

        'Agriculture & Food Science': `The agricultural landscape of the ${Math.floor(year/100)*100}s faced significant challenges that ${inventor.name} was determined to solve. The ${invention} emerged from direct experience with farming communities and food production systems.

The ideation process involved extensive field research - literally working in fields, observing crop cycles, analyzing soil conditions, and understanding the economics of farming. ${inventor.name} asked fundamental questions: How can we increase yields? How can we reduce waste? How can we make farming more sustainable?

With tools ranging from simple hand implements to early chemical analysis equipment, ${inventor.name} began experimenting. They combined traditional agricultural wisdom with emerging scientific methods, creating something entirely new.`,

        'Transportation & Communication': `The need for improved transportation and communication was evident throughout society when ${inventor.name} conceived the ${invention}. Distance and time were barriers that demanded innovative solutions.

The ideation began with understanding human movement patterns and information flow. ${inventor.name} studied existing infrastructure, analyzed bottlenecks, and imagined systems that could operate faster, safer, and more efficiently.

Using materials like metal alloys, rubber compounds, and electrical components, the early concepts took shape on drafting tables. The "why" was connection - bringing people together, speeding commerce, enabling progress. The "how" required mastering multiple disciplines simultaneously.`,

        'Environmental & Energy': `Environmental concerns and energy needs converged in ${inventor.name}'s mind, leading to the conception of the ${invention}. They recognized that sustainable solutions were not just desirable but necessary.

The ideation process involved studying natural systems, understanding energy transfer mechanisms, and exploring renewable resources. ${inventor.name} asked: How does nature solve this problem? Can we harness processes that are already occurring?

Working with available materials and early environmental monitoring equipment, they began designing systems that would work with nature rather than against it. The vision was both practical and philosophical - meeting human needs while preserving the environment.`,

        'default': `The ${invention} emerged from ${inventor.name}'s keen observation of problems that others had simply accepted as unsolvable. The ideation phase was characterized by relentless curiosity and systematic investigation.

Why was this needed? ${inventor.name} saw clearly the limitations of existing approaches and the suffering they caused. How would it work? Through careful analysis of the problem's root causes and creative application of available knowledge and materials.

The early conceptual phase involved extensive note-taking, sketching, and mental experimentation. ${inventor.name} drew from their background in ${category.toLowerCase()}, but also looked beyond their field for inspiration. They understood that breakthrough innovations often come from connecting ideas from disparate domains.`
    };

    return templates[category] || templates['default'];
}

function generateDesignContent(inventor, invention, year, category) {
    return `The design and brainstorming phase for the ${invention} was intensive and iterative. ${inventor.name} understood that moving from concept to reality required meticulous planning and creative problem-solving.

**Initial Sketches and Diagrams**

The first designs were rough - pencil sketches on paper, annotated with measurements and material specifications. ${inventor.name} created multiple variations, each exploring different approaches to solving the core technical challenges. These early drawings reveal a mind wrestling with fundamental questions of form and function.

**Collaborative Refinement**

While ${inventor.name} was the driving force, the design process benefited from feedback and collaboration. They consulted with:
- Technical experts who could evaluate feasibility
- Potential users who provided practical insights
- Material suppliers who explained what was possible with available resources
- Financial advisors who helped understand manufacturing costs

**Design Iterations**

The first design was far from the final one. Through a process of constant refinement, ${inventor.name} improved upon each iteration:

1. **Version 1.0** - The initial concept, bold but impractical in certain aspects
2. **Version 2.0** - Addressed manufacturing challenges, simplified complex components
3. **Version 3.0** - Enhanced user experience, improved reliability
4. **Final Design** - The synthesis of all learnings, ready for prototyping

**Materials Selection**

Choosing the right materials was critical. ${inventor.name} evaluated options based on:
- Availability and cost
- Durability and performance characteristics
- Ease of manufacturing and assembly
- Environmental conditions the invention would face

The final material selections reflected a balance of ideal performance and practical constraints of the era.`;
}

function generatePrototypingContent(inventor, invention, year, category) {
    return `The journey from design to physical prototype was fraught with challenges, setbacks, and breakthroughs. ${inventor.name} approached prototyping with both scientific rigor and creative flexibility.

**The First Prototype**

Constructing the first working model of the ${invention} required resourcefulness. In ${year}, manufacturing capabilities were limited compared to today. ${inventor.name} often had to:
- Source materials from multiple suppliers
- Commission custom-made components
- Adapt existing tools for new purposes
- Solve unexpected technical problems on the fly

The first prototype was assembled in a modest workshop, with ${inventor.name} personally overseeing every detail. When it was finally complete and they activated it for the first time, the moment was both triumphant and humbling - it worked, but not perfectly.

**Testing and Refinement**

The initial prototype revealed numerous issues that weren't apparent in the design phase:
- Mechanical components that wore out faster than expected
- User interface elements that proved confusing
- Performance metrics that fell short of targets
- Manufacturing steps that were too complex or expensive

${inventor.name} documented each problem meticulously, understanding that failure was information. They ran the prototype through rigorous testing protocols, measuring performance, identifying weak points, and gathering data.

**Iteration Cycles**

Over the following months, ${inventor.name} built multiple prototypes, each incorporating lessons from the previous version:

**Prototype 2**: Addressed the most critical mechanical failures, introduced more durable materials
**Prototype 3**: Refined the user experience, simplified operation
**Prototype 4**: Optimized for manufacturing efficiency
**Final Prototype**: Met all performance targets, ready for production

**Validation Testing**

Before moving to manufacturing, ${inventor.name} conducted extensive validation:
- Stress testing under extreme conditions
- Long-duration reliability trials
- User testing with the target audience
- Safety verification to ensure no harm

The final prototype was tested until ${inventor.name} was confident it would perform reliably in the real world.`;
}

function generateManufacturingContent(inventor, invention, year, category) {
    return `Transitioning from a working prototype to full-scale manufacturing presented an entirely new set of challenges. ${inventor.name} had to think beyond invention and become an entrepreneur and production manager.

**Manufacturing Strategy**

The approach to manufacturing the ${invention} was influenced by several factors:
- Available industrial capacity in ${year}
- Capital requirements and funding sources
- Skill level of available workforce
- Supply chain for raw materials

${inventor.name} developed a manufacturing plan that outlined every step from raw materials to finished product. This included:

**Facility Setup**
- Securing a suitable manufacturing location
- Installing necessary equipment and machinery
- Establishing quality control systems
- Training workers in specialized techniques

**Production Process**

The manufacturing process for the ${invention} involved multiple stages:

1. **Raw Material Preparation**: Sourcing and preparing base materials to precise specifications
2. **Component Fabrication**: Creating individual parts through cutting, forming, machining, or molding
3. **Assembly**: Bringing components together in precise sequence
4. **Quality Control**: Inspecting each unit to ensure it met standards
5. **Testing**: Functional testing before packaging
6. **Packaging**: Preparing products for shipment and storage

**Quality Control**

${inventor.name} was obsessive about quality. They established rigorous inspection protocols:
- Incoming material inspection
- In-process quality checks
- Final product testing
- Statistical process control to identify trends

Any unit that failed inspection was either reworked or scrapped - ${inventor.name}'s reputation depended on reliability.

**Scaling Production**

Initial production runs were small, perhaps dozens or hundreds of units. As demand grew and processes were refined, ${inventor.name} scaled up production:
- Investing in more efficient machinery
- Streamlining workflows
- Implementing assembly line techniques
- Training additional workers
- Establishing multiple production shifts

**Challenges Overcome**

Manufacturing at scale revealed problems:
- Supply chain disruptions requiring alternate suppliers
- Quality inconsistencies demanding process adjustments
- Worker training challenges necessitating better documentation
- Equipment breakdowns requiring maintenance protocols

${inventor.name} addressed each challenge systematically, building a robust manufacturing operation.`;
}

function generateDistributionContent(inventor, invention, year, category) {
    return `Creating the ${invention} was only half the battle; getting it into the hands of those who needed it required an effective distribution strategy. ${inventor.name} understood that impact depended on accessibility.

**Distribution Channels**

In the ${Math.floor(year/10)*10}s, distribution networks were different from today. ${inventor.name} explored multiple channels:

**Direct Sales**
- Establishing a showroom or sales office
- Employing salespeople to demonstrate the product
- Taking orders directly from customers
- Managing fulfillment in-house

**Wholesale Partnerships**
- Partnering with distributors who had existing networks
- Providing product training to wholesale partners
- Offering favorable terms to build relationships
- Supporting partners with marketing materials

**Retail Relationships**
- Placing products in stores where customers naturally shopped
- Creating attractive displays and point-of-sale materials
- Training retail staff on product benefits
- Monitoring sales and inventory levels

**Geographic Expansion**

The ${invention} initially launched in a limited geographic area - often the region where ${inventor.name} was based. Expansion followed a strategic pattern:

1. **Local Market**: Proving the concept and building reputation
2. **Regional Expansion**: Extending to nearby cities and states
3. **National Distribution**: Reaching across the country
4. **International Markets**: Exporting to other nations (when applicable)

**Marketing and Awareness**

Distribution required creating awareness. ${inventor.name} employed various marketing tactics:
- Print advertisements in newspapers and magazines
- Demonstrations at trade shows and exhibitions
- Word-of-mouth from satisfied customers
- Testimonials and case studies
- Public relations and news coverage

**Pricing Strategy**

Determining the right price point was crucial:
- Cost-plus pricing to ensure profitability
- Market-based pricing considering competitors
- Value-based pricing reflecting benefits delivered
- Volume discounts to encourage larger orders

${inventor.name} balanced affordability with sustainability, wanting the ${invention} accessible while maintaining a viable business.

**Customer Support**

Post-sale support was part of the distribution strategy:
- Providing clear instructions and documentation
- Offering repair services and replacement parts
- Responding to customer inquiries and complaints
- Gathering feedback for product improvements

${inventor.name} understood that satisfied customers became advocates, driving further distribution through recommendations.`;
}

function generateEarlyDaysContent(inventor, invention, year, category) {
    return `The early days of the ${invention} were a mix of excitement, anxiety, and constant adaptation. ${inventor.name} had poured years of effort into bringing this innovation to life, and now it faced the ultimate test: real-world use.

**The First Sales**

The moment when the first customer purchased the ${invention} was unforgettable. ${inventor.name} often personally delivered early units, eager to see the product in use and gather immediate feedback. These first customers were pioneers themselves, taking a chance on an unproven technology from a new inventor.

Initial sales were modest. In the first month, perhaps only a handful of units sold. ${inventor.name} personally knew each customer, understood their use case, and followed up religiously to ensure satisfaction.

**Early Adopter Feedback**

The feedback from early users was invaluable:

**Positive Responses**:
- Customers amazed by capabilities not previously possible
- Efficiency gains and cost savings immediately apparent
- Appreciation for ${inventor.name}'s attention to quality
- Enthusiasm that led to referrals and word-of-mouth

**Critical Feedback**:
- Requests for features not in the original design
- Complaints about aspects that didn't work as expected
- Suggestions for improvements from real-world use
- Questions about maintenance and longevity

${inventor.name} took all feedback seriously, often implementing rapid improvements to address concerns.

**Production Challenges in the Early Days**

The first production runs revealed the gap between prototype and manufacturing:
- Component suppliers who couldn't maintain quality consistency
- Assembly processes that were slower than projected
- Quality control that caught more defects than anticipated
- Costs that exceeded initial estimates

${inventor.name} spent long hours in the factory, troubleshooting problems, retraining workers, and refining processes. The early days required hands-on leadership and willingness to do whatever was necessary.

**Financial Pressures**

The early commercial phase was financially precarious:
- Initial capital being depleted faster than planned
- Revenue lagging behind projections
- Need for additional funding to sustain operations
- Pressure from investors or creditors for results

${inventor.name} often faced difficult decisions about where to allocate limited resources. Marketing or production? Expansion or consolidation? Each choice carried risk.

**Building Momentum**

Gradually, momentum built:
- Month 3: Sales doubled from Month 1
- Month 6: Reached break-even on operating costs
- Month 12: Expanded to new markets
- Year 2: Achieved profitability and began scaling

The ${invention} found its market. What began as a trickle of interest became steady demand. ${inventor.name}'s persistence through the difficult early days was vindicated.

**Pivotal Moments**

Several events marked turning points in the early history:
- A major customer placing a large order
- Positive coverage in industry publications
- Recognition from peers and awards
- Successful expansion into new geographic markets

Each milestone validated ${inventor.name}'s vision and provided momentum for continued growth.

**The Human Element**

Behind the business metrics were human stories:
- Workers who believed in the mission and went above and beyond
- Customers whose lives were genuinely improved
- Supporters who provided encouragement during setbacks
- Family members who sacrificed alongside ${inventor.name}

The early days of the ${invention} were not just about technology and business - they were about people united by a common purpose.`;
}

function generateWorldImpactContent(inventor, invention, year, category) {
    const impactTemplates = {
        'Medicine & Healthcare': `The ${invention}'s impact on global health has been profound and far-reaching. Since its introduction in ${year}, it has:

**Lives Saved and Improved**
- Directly contributed to saving countless lives through improved diagnosis, treatment, or prevention
- Enhanced quality of life for patients who previously had limited options
- Made healthcare more accessible to underserved populations
- Reduced suffering and improved patient outcomes across demographics

**Medical Practice Transformation**
- Changed standard protocols and best practices in medical care
- Enabled new types of procedures and treatments
- Improved efficiency and effectiveness of healthcare delivery
- Reduced costs while improving outcomes

**Global Health Impact**
- Addressed diseases and conditions affecting millions worldwide
- Contributed to increased life expectancy and reduced mortality
- Enabled public health initiatives at scale
- Influenced medical education and training

The ripple effects of ${inventor.name}'s innovation continue to expand, with modern versions and derivatives still serving humanity today.`,

        'Electronics & Computing': `The ${invention} helped catalyze the digital revolution that transformed modern civilization. Its impact includes:

**Technological Foundation**
- Provided fundamental building blocks for future innovations
- Enabled new categories of products and services
- Accelerated the pace of technological development
- Influenced industry standards and architectures

**Economic Impact**
- Created entirely new industries and job categories
- Generated billions in economic value
- Enabled productivity improvements across sectors
- Democratized access to information and computation

**Societal Transformation**
- Changed how people communicate, work, and learn
- Connected previously isolated individuals and communities
- Enabled the information age and knowledge economy
- Transformed entertainment, education, and social interaction

The fundamental principles behind ${inventor.name}'s ${invention} remain relevant, incorporated into technologies used by billions daily.`,

        'Engineering & Manufacturing': `The ${invention}'s influence on industrial production and manufacturing has been revolutionary:

**Industrial Efficiency**
- Dramatically increased production capacity
- Reduced manufacturing costs and waste
- Improved product quality and consistency
- Enhanced worker safety and ergonomics

**Economic Development**
- Enabled mass production and economies of scale
- Created manufacturing jobs and economic opportunities
- Facilitated industrialization in developing regions
- Contributed to economic growth and prosperity

**Global Supply Chains**
- Became standard equipment in factories worldwide
- Influenced manufacturing processes across industries
- Enabled just-in-time production methods
- Contributed to globalization of production

The principles ${inventor.name} pioneered continue to influence modern manufacturing, with descendants of the original ${invention} still in use globally.`,

        'Agriculture & Food Science': `The agricultural impact of the ${invention} has helped feed a growing global population:

**Food Security**
- Increased crop yields and farming efficiency
- Reduced food waste and spoilage
- Enabled cultivation in challenging environments
- Improved nutritional quality of food

**Economic Impact on Farmers**
- Increased profitability and reduced labor requirements
- Made farming more sustainable and predictable
- Enabled small farmers to compete effectively
- Created new agricultural markets and opportunities

**Environmental Considerations**
- Promoted more sustainable farming practices
- Reduced environmental impact of agriculture
- Enabled organic and regenerative farming methods
- Contributed to biodiversity and soil health

**Global Adoption**
- Implemented across diverse climates and regions
- Adapted to local conditions and crops
- Shared through agricultural extension programs
- Contributed to food security in developing nations

${inventor.name}'s innovation continues to influence modern agriculture and food production systems.`,

        'Transportation & Communication': `The ${invention} helped shrink the world by improving how people and information move:

**Connectivity and Mobility**
- Reduced travel time and transportation costs
- Connected previously isolated communities
- Enabled commerce and cultural exchange
- Improved emergency response and safety

**Economic Development**
- Facilitated trade and economic integration
- Created new business opportunities
- Reduced costs across supply chains
- Enabled economic specialization and efficiency

**Social Impact**
- Brought people together across distances
- Enabled migration and cultural exchange
- Improved access to education and opportunity
- Strengthened family and community bonds

**Infrastructure Development**
- Influenced design of transportation systems
- Became standard in infrastructure planning
- Spawned supporting industries and services
- Contributed to urban and rural development

The fundamental innovations ${inventor.name} introduced remain incorporated in modern transportation and communication systems.`,

        'Environmental & Energy': `The ${invention}'s environmental and energy impact addresses critical global challenges:

**Sustainability**
- Reduced environmental impact of human activities
- Promoted renewable and clean energy sources
- Decreased pollution and carbon emissions
- Contributed to climate change mitigation

**Resource Efficiency**
- Improved energy efficiency and reduced waste
- Enabled use of alternative and renewable resources
- Reduced dependence on finite resources
- Promoted circular economy principles

**Economic Benefits**
- Reduced energy costs for consumers and businesses
- Created green jobs and industries
- Enabled sustainable economic development
- Provided energy access to remote communities

**Global Adoption**
- Implemented across diverse geographic regions
- Adapted to local environmental conditions
- Influenced energy policy and planning
- Contributed to global sustainability goals

${inventor.name}'s vision of sustainable technology continues to inspire modern environmental solutions.`,

        'default': `The ${invention} has left an indelible mark on human civilization:

**Direct Impact**
- Solved specific problems affecting millions of people
- Improved quality of life and human capabilities
- Created economic value and opportunities
- Advanced human knowledge and technological capabilities

**Indirect Influence**
- Inspired subsequent innovations and improvements
- Changed cultural practices and social norms
- Influenced education and professional training
- Contributed to scientific and technical progress

**Legacy**
- Recognized as a significant technological milestone
- Studied in educational institutions
- Commemorated in museums and historical accounts
- Continues to influence modern designs and approaches

**Global Reach**
- Adopted across multiple countries and cultures
- Adapted to diverse contexts and needs
- Contributed to global development goals
- Demonstrated the power of human ingenuity

${inventor.name}'s contribution through the ${invention} exemplifies how individual innovation can create lasting positive change for humanity.`
    };

    return impactTemplates[category] || impactTemplates['default'];
}

// Generate HTML for a single invention page
function generateInventionPage(inventor, index) {
    const inventionSlug = slugify(inventor.primaryInvention);
    const gradient = getGradient(index);
    const [color1, color2] = gradient.match(/#[a-f0-9]{6}/gi) || ['#f093fb', '#f5576c'];

    const ideationContent = generateIdeationContent(inventor, inventor.primaryInvention, inventor.inventionYear, inventor.category);
    const designContent = generateDesignContent(inventor, inventor.primaryInvention, inventor.inventionYear, inventor.category);
    const prototypingContent = generatePrototypingContent(inventor, inventor.primaryInvention, inventor.inventionYear, inventor.category);
    const manufacturingContent = generateManufacturingContent(inventor, inventor.primaryInvention, inventor.inventionYear, inventor.category);
    const distributionContent = generateDistributionContent(inventor, inventor.primaryInvention, inventor.inventionYear, inventor.category);
    const earlyDaysContent = generateEarlyDaysContent(inventor, inventor.primaryInvention, inventor.inventionYear, inventor.category);
    const worldImpactContent = generateWorldImpactContent(inventor, inventor.primaryInvention, inventor.inventionYear, inventor.category);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${inventor.primaryInvention} - ${inventor.inventionYear} | American Inventions</title>
    <meta name="description" content="Discover the fascinating story of the ${inventor.primaryInvention}, invented by ${inventor.name} in ${inventor.inventionYear}. Learn about the ideation, prototyping, manufacturing, and global impact of this groundbreaking innovation.">
    <meta name="keywords" content="${inventor.primaryInvention}, ${inventor.name}, ${inventor.inventionYear}, ${inventor.category}, invention history, innovation">
    <meta name="author" content="American Inventions">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://www.americaninventions.org/invention/${inventionSlug}.html">
    <meta property="og:title" content="${inventor.primaryInvention} - Revolutionary Innovation from ${inventor.inventionYear}">
    <meta property="og:description" content="The remarkable story of how ${inventor.name} created the ${inventor.primaryInvention} and changed the world.">
    <meta property="og:image" content="https://www.americaninventions.org/og-image.jpg">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://www.americaninventions.org/invention/${inventionSlug}.html">
    <meta property="twitter:title" content="${inventor.primaryInvention} - ${inventor.name}">
    <meta property="twitter:description" content="From ideation to world impact: the story of the ${inventor.primaryInvention}">
    <meta property="twitter:image" content="https://www.americaninventions.org/og-image.jpg">

    <!-- Canonical URL -->
    <link rel="canonical" href="https://www.americaninventions.org/invention/${inventionSlug}.html">

    <!-- Favicon -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${inventor.inventionEmoji || '💡'}</text></svg>">

    <!-- Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "${inventor.primaryInvention}",
      "description": "The comprehensive story of the ${inventor.primaryInvention}, from ideation to global impact.",
      "datePublished": "${inventor.inventionYear}-01-01",
      "author": {
        "@type": "Person",
        "name": "${inventor.name}",
        "url": "https://www.americaninventions.org/inventor/${inventor.id}.html"
      },
      "about": {
        "@type": "Thing",
        "name": "${inventor.primaryInvention}",
        "description": "${inventor.shortBio}"
      },
      "articleSection": "${inventor.category}"
    }
    </script>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', serif;
            line-height: 1.8;
            color: #1a1a1a;
            background: #ffffff;
        }

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

        .nav-links a {
            color: #ffffff;
            text-decoration: none;
            margin-left: 2rem;
            transition: opacity 0.3s;
        }

        .nav-links a:hover {
            opacity: 0.7;
        }

        .hero {
            background: ${gradient};
            color: #ffffff;
            padding: 4rem 0;
            text-align: center;
        }

        .hero-content {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .invention-emoji {
            font-size: 5rem;
            margin-bottom: 1rem;
            display: block;
        }

        h1 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            margin-bottom: 1rem;
            font-weight: 700;
        }

        .hero-subtitle {
            font-size: 1.3rem;
            opacity: 0.95;
            margin-bottom: 1rem;
        }

        .hero-year {
            font-size: 1.1rem;
            opacity: 0.85;
            font-style: italic;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 3rem 20px;
        }

        .quick-facts {
            background: #f8f9fa;
            border-left: 4px solid ${color2};
            padding: 2rem;
            margin: 2rem 0;
            border-radius: 8px;
        }

        .quick-facts h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: ${color2};
        }

        .fact-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 1.5rem;
        }

        .fact-item {
            padding: 1rem;
            background: #ffffff;
            border-radius: 6px;
        }

        .fact-label {
            font-weight: 700;
            color: ${color1};
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .fact-value {
            font-size: 1.1rem;
            color: #1a1a1a;
        }

        section {
            margin: 3rem 0;
        }

        h2 {
            font-size: 2rem;
            margin-bottom: 1.5rem;
            color: #1a1a1a;
            border-bottom: 3px solid ${color2};
            padding-bottom: 0.5rem;
        }

        h3 {
            font-size: 1.5rem;
            margin: 2rem 0 1rem 0;
            color: #2a2a2a;
        }

        p {
            margin-bottom: 1.5rem;
            text-align: justify;
        }

        .timeline {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 8px;
            margin: 2rem 0;
        }

        .timeline-item {
            padding: 1rem 0;
            border-left: 3px solid ${color1};
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .timeline-year {
            font-weight: 700;
            color: ${color2};
            font-size: 1.2rem;
        }

        .timeline-content {
            margin-top: 0.5rem;
        }

        .impact-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .stat-card {
            background: linear-gradient(135deg, ${color1}22 0%, ${color2}22 100%);
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            border: 2px solid ${color1}44;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: ${color2};
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 1rem;
            color: #1a1a1a;
        }

        .inventor-link {
            background: ${gradient};
            color: #ffffff;
            padding: 3rem 2rem;
            border-radius: 12px;
            text-align: center;
            margin: 3rem 0;
        }

        .inventor-link h2 {
            color: #ffffff;
            border: none;
            margin-bottom: 1rem;
        }

        .inventor-link p {
            text-align: center;
            margin-bottom: 1.5rem;
            font-size: 1.1rem;
        }

        .inventor-link a {
            display: inline-block;
            background: #ffffff;
            color: ${color2};
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 700;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .inventor-link a:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .back-button {
            display: inline-block;
            margin: 2rem 0;
            padding: 1rem 2rem;
            background: #f8f9fa;
            color: #1a1a1a;
            text-decoration: none;
            border-radius: 6px;
            transition: background 0.3s;
        }

        .back-button:hover {
            background: #e9ecef;
        }

        footer {
            background: #1a1a1a;
            color: #ffffff;
            text-align: center;
            padding: 2rem 0;
            margin-top: 4rem;
        }

        ul, ol {
            margin-left: 2rem;
            margin-bottom: 1.5rem;
        }

        li {
            margin-bottom: 0.5rem;
        }

        strong {
            color: ${color2};
        }

        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            h1 {
                font-size: 2rem;
            }

            h2 {
                font-size: 1.5rem;
            }

            .invention-emoji {
                font-size: 3rem;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="top-nav">
        <div class="nav-container">
            <a href="../index.html" class="nav-logo">💡 American Inventions</a>
            <div class="nav-links">
                <a href="../index.html">All Inventors</a>
                <a href="../index.html#inventions">All Inventions</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="hero">
        <div class="hero-content">
            <span class="invention-emoji">${inventor.inventionEmoji || '💡'}</span>
            <h1>${inventor.primaryInvention}</h1>
            <p class="hero-subtitle">${inventor.category}</p>
            <p class="hero-year">Invented in ${inventor.inventionYear} • ${inventor.country} ${inventor.flag}</p>
        </div>
    </div>

    <!-- Main Content -->
    <div class="container">
        <a href="../index.html" class="back-button">← Back to All Inventions</a>

        <!-- Quick Facts -->
        <div class="quick-facts">
            <h2>Quick Facts</h2>
            <div class="fact-grid">
                <div class="fact-item">
                    <div class="fact-label">Inventor</div>
                    <div class="fact-value">${inventor.name}</div>
                </div>
                <div class="fact-item">
                    <div class="fact-label">Year Invented</div>
                    <div class="fact-value">${inventor.inventionYear}</div>
                </div>
                <div class="fact-item">
                    <div class="fact-label">Country</div>
                    <div class="fact-value">${inventor.country} ${inventor.flag}</div>
                </div>
                <div class="fact-item">
                    <div class="fact-label">Category</div>
                    <div class="fact-value">${inventor.category}</div>
                </div>
            </div>
        </div>

        <!-- Introduction -->
        <section id="introduction">
            <h2>Introduction</h2>
            <p>${inventor.shortBio}</p>
            <p>${inventor.detailedBio.substring(0, 400)}...</p>
        </section>

        <!-- Ideation: How, Why, With What -->
        <section id="ideation">
            <h2>💭 Ideation: How, Why, and With What</h2>
            ${ideationContent.split('\n\n').map(para => `<p>${para}</p>`).join('\n')}
        </section>

        <!-- Design and Brainstorming -->
        <section id="design">
            <h2>✏️ Design and Brainstorming</h2>
            ${designContent.split('\n\n').map(para => para.startsWith('**') ? `<h3>${para.replace(/\*\*/g, '')}</h3>` : `<p>${para}</p>`).join('\n')}
        </section>

        <!-- Prototyping -->
        <section id="prototyping">
            <h2>🔧 Prototyping</h2>
            ${prototypingContent.split('\n\n').map(para => para.startsWith('**') ? `<h3>${para.replace(/\*\*/g, '')}</h3>` : `<p>${para}</p>`).join('\n')}
        </section>

        <!-- Manufacturing and Creation -->
        <section id="manufacturing">
            <h2>🏭 Manufacturing and Creation</h2>
            ${manufacturingContent.split('\n\n').map(para => para.startsWith('**') ? `<h3>${para.replace(/\*\*/g, '')}</h3>` : para.startsWith('1.') || para.match(/^\d+\./) ? `<p><strong>${para}</strong></p>` : `<p>${para}</p>`).join('\n')}
        </section>

        <!-- Distribution -->
        <section id="distribution">
            <h2>📦 Distribution</h2>
            ${distributionContent.split('\n\n').map(para => para.startsWith('**') ? `<h3>${para.replace(/\*\*/g, '')}</h3>` : para.startsWith('1.') || para.match(/^\d+\./) ? `<p><strong>${para}</strong></p>` : `<p>${para}</p>`).join('\n')}
        </section>

        <!-- The Early Days -->
        <section id="early-days">
            <h2>🌅 The Early Days</h2>
            ${earlyDaysContent.split('\n\n').map(para => para.startsWith('**') ? `<h3>${para.replace(/\*\*/g, '')}</h3>` : `<p>${para}</p>`).join('\n')}
        </section>

        <!-- World Impact -->
        <section id="impact">
            <h2>🌍 World Impact</h2>
            ${worldImpactContent.split('\n\n').map(para => para.startsWith('**') ? `<h3>${para.replace(/\*\*/g, '')}</h3>` : `<p>${para}</p>`).join('\n')}
        </section>

        <!-- Link to Inventor -->
        <div class="inventor-link">
            <h2>Meet the Inventor</h2>
            <p>Learn more about ${inventor.name}, the brilliant mind behind the ${inventor.primaryInvention}</p>
            <a href="../inventor/${inventor.id}.html">View ${inventor.name}'s Profile →</a>
        </div>

        <a href="../index.html" class="back-button">← Back to All Inventions</a>
    </div>

    <!-- Footer -->
    <footer>
        <p>&copy; 2025 American Inventions. Celebrating Black and Brown innovators who changed the world.</p>
    </footer>
</body>
</html>`;
}

// Main execution
console.log('Generating invention pages...\n');

const outputDir = './invention';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

let successCount = 0;
let errorCount = 0;

inventors.forEach((inventor, index) => {
    try {
        const inventionSlug = slugify(inventor.primaryInvention);
        const html = generateInventionPage(inventor, index);
        const filename = path.join(outputDir, `${inventionSlug}.html`);

        fs.writeFileSync(filename, html);
        console.log(`✓ Created: ${inventionSlug}.html (${inventor.primaryInvention})`);
        successCount++;
    } catch (error) {
        console.error(`✗ Error creating page for ${inventor.primaryInvention}:`, error.message);
        errorCount++;
    }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`Generation Complete!`);
console.log(`${'='.repeat(60)}`);
console.log(`✓ Successfully created: ${successCount} pages`);
console.log(`✗ Errors: ${errorCount} pages`);
console.log(`📁 Output directory: ${path.resolve(outputDir)}`);
console.log(`${'='.repeat(60)}\n`);
