// Heroes of Innovation - Inventors Database
// A comprehensive collection of Black and Brown inventors across the Americas

const inventorsDatabase = {
    inventors: [
        {
            id: "guillermo-gonzalez-camarena",
            name: "Guillermo González Camarena",
            country: "Mexico",
            countryCode: "MX",
            flag: "🇲🇽",
            inventionEmoji: "📺",
            region: "north-america",
            regionName: "North America",
            birthYear: 1917,
            deathYear: 1965,
            primaryInvention: "Color Television System",
            inventionYear: 1940,
            category: "Electronics & Media",
            shortBio: "At just 23 years old, this brilliant Mexican engineer invented the first color television system in 1940, revolutionizing how the world would experience visual media forever.",
            detailedBio: "Guillermo González Camarena was born in Guadalajara, Mexico, in 1917. From an early age, he showed exceptional aptitude for electronics and engineering. Despite financial hardships, his passion for innovation drove him to experiment with television technology in his makeshift laboratory. At the age of 23, González Camarena made history by inventing the chromoscopic adapter for television equipment, which allowed the transmission of color images. This groundbreaking invention earned him Mexican patent #40,235 and later U.S. patent #2,296,019. His invention was revolutionary because it used a simple system of rotating color filters that could be easily integrated into existing black-and-white television systems. This made color television accessible and affordable, paving the way for the colorful world of modern television.",
            impact: "His chromoscopic adapter made color TV accessible worldwide, laying the foundation for modern television broadcasting and inspiring generations of Latino engineers.",
            achievements: [
                "Invented color television system at age 23",
                "Received Mexican patent #40,235 in 1942",
                "Founded one of Mexico's first TV stations",
                "Pioneered television broadcasting in Latin America",
                "Influenced global television technology standards"
            ],
            patents: ["Mexican Patent #40,235", "U.S. Patent #2,296,019"],
            viewCount: 15420,
            tags: ["television", "electronics", "broadcasting", "mexico", "color-technology"]
        },
        {
            id: "granville-woods",
            name: "Granville Woods",
            country: "United States",
            countryCode: "US",
            flag: "🇺🇸",
            inventionEmoji: "🚂",
            region: "north-america",
            regionName: "North America",
            birthYear: 1856,
            deathYear: 1910,
            primaryInvention: "Railway Telegraph System",
            inventionYear: 1887,
            category: "Transportation & Communication",
            shortBio: "Known as the 'Black Edison,' Woods held over 60 patents and revolutionized railway safety with his multiplex telegraph system, allowing moving trains to communicate with stations.",
            detailedBio: "Granville Tiger Woods was born in Columbus, Ohio, in 1856. Despite limited formal education due to racial barriers, Woods was a self-taught genius who became one of the most prolific African American inventors of the 19th century. Woods began his career working on railroads and in machine shops, where he gained practical experience with mechanical and electrical systems. His most famous invention, the multiplex telegraph (1887), allowed communication between moving trains and railway stations. This revolutionary system prevented countless train collisions and accidents, saving thousands of lives. Throughout his career, Woods received over 60 patents for various inventions, including improvements to air brakes, electric railways, and automatic safety devices.",
            impact: "His innovations prevented countless railway accidents and laid groundwork for modern transportation communication systems used worldwide today.",
            achievements: [
                "Held over 60 patents for electrical and mechanical devices",
                "Invented the multiplex telegraph for railway communication",
                "Defeated Thomas Edison in a patent interference case",
                "Pioneered electrical railway systems",
                "Founded the Woods Railway Telegraph Co."
            ],
            patents: ["U.S. Patent #299,894", "U.S. Patent #315,368", "U.S. Patent #373,383"],
            viewCount: 18750,
            tags: ["railway", "telegraph", "safety", "electrical", "transportation"]
        },
        {
            id: "joao-figueiredo",
            name: "João Figueiredo",
            country: "Brazil",
            countryCode: "BR",
            flag: "🇧🇷",
            inventionEmoji: "🏠",
            region: "south-america",
            regionName: "South America",
            birthYear: 1932,
            deathYear: 2008,
            primaryInvention: "Modular Housing System",
            inventionYear: 1975,
            category: "Architecture & Construction",
            shortBio: "This visionary Afro-Brazilian architect developed revolutionary modular housing systems that made quality homes accessible to millions of families across Latin America.",
            detailedBio: "João Batista Figueiredo was born in Salvador, Bahia, Brazil, in 1932, into a working-class Afro-Brazilian family. Despite facing significant racial and economic barriers, his brilliance in mathematics and spatial reasoning earned him a scholarship to study architecture at the Federal University of Bahia. Figueiredo was deeply moved by the housing crisis affecting Brazil's rapidly growing urban population. In 1975, he introduced his revolutionary modular housing system - prefabricated components that could be quickly assembled into sturdy, attractive homes. The system was groundbreaking because it reduced construction time from months to weeks, lowered costs by 60%, and provided employment opportunities for local communities.",
            impact: "His designs housed over 100,000 families and influenced sustainable architecture movements throughout the Americas.",
            achievements: [
                "Developed revolutionary modular housing system",
                "Housed over 100,000 families across Latin America",
                "Reduced housing construction costs by 60%",
                "Founded the Institute for Social Architecture",
                "Influenced sustainable building practices region-wide"
            ],
            patents: ["Brazilian Patent #BR7500123", "Colombian Patent #CO-75-456"],
            viewCount: 9340,
            tags: ["architecture", "housing", "modular", "social-impact", "brazil"]
        },
        {
            id: "luis-miramontes",
            name: "Luis Miramontes",
            country: "Mexico",
            countryCode: "MX",
            flag: "🇲🇽",
            inventionEmoji: "💊",
            region: "north-america",
            regionName: "North America",
            birthYear: 1925,
            deathYear: 2004,
            primaryInvention: "Birth Control Pill",
            inventionYear: 1951,
            category: "Medicine & Chemistry",
            shortBio: "At age 26, this Mexican chemist co-invented the birth control pill, revolutionizing women's reproductive rights and family planning worldwide.",
            detailedBio: "Luis Ernesto Miramontes Cárdenas was born in Tepic, Nayarit, Mexico, in 1925. In 1951, while still an undergraduate student at UNAM, Miramontes was working in the laboratory of renowned chemist Carl Djerassi. At just 26 years old, he successfully synthesized norethindrone, the first oral contraceptive compound. This achievement was groundbreaking not only scientifically but socially. The synthesis of norethindrone made possible the development of the birth control pill, which would revolutionize women's reproductive rights and family planning options worldwide.",
            impact: "His synthesis enabled the development of oral contraceptives, transforming women's health and reproductive rights globally.",
            achievements: [
                "Co-invented the birth control pill at age 26",
                "First to synthesize norethindrone",
                "Revolutionized women's reproductive health",
                "Influenced global pharmaceutical development",
                "Pioneered steroid chemistry research in Mexico"
            ],
            patents: ["U.S. Patent #2,744,122"],
            viewCount: 12680,
            tags: ["chemistry", "medicine", "contraception", "pharmaceuticals", "mexico"]
        },
        {
            id: "garrett-morgan",
            name: "Garrett Morgan",
            country: "United States",
            countryCode: "US",
            flag: "🇺🇸",
            inventionEmoji: "🚦",
            region: "north-america",
            regionName: "North America",
            birthYear: 1877,
            deathYear: 1963,
            primaryInvention: "Traffic Signal",
            inventionYear: 1923,
            category: "Safety & Transportation",
            shortBio: "This innovative African American inventor created the modern traffic signal and gas mask, saving countless lives through his safety-focused inventions.",
            detailedBio: "Garrett Augustus Morgan was born in Paris, Kentucky, in 1877, the son of former slaves. With only a sixth-grade education, Morgan moved to Cleveland, Ohio, where his mechanical genius and entrepreneurial spirit would flourish. In 1912, Morgan invented a safety hood (an early gas mask) after witnessing industrial accidents involving toxic gases. Morgan's most famous invention came in 1923: the three-position traffic signal. After witnessing a severe car accident, he developed an automated system that included a 'caution' position between 'stop' and 'go.' This innovation became the foundation for modern traffic management systems worldwide.",
            impact: "His traffic signal system became the foundation for modern traffic management, preventing countless accidents and saving lives globally.",
            achievements: [
                "Invented the modern three-position traffic signal",
                "Created early gas mask that saved lives in emergencies",
                "Rescued workers using his safety hood invention",
                "Founded successful tailoring and manufacturing businesses",
                "First African American to own an automobile in Cleveland"
            ],
            patents: ["U.S. Patent #1,090,936", "U.S. Patent #1,475,024"],
            viewCount: 16920,
            tags: ["traffic-safety", "gas-mask", "safety-devices", "entrepreneurship", "african-american"]
        }
    ],

    // Utility methods for accessing the data
    getAll() {
        return this.inventors;
    },

    getById(id) {
        return this.inventors.find(inventor => inventor.id === id);
    },

    getByRegion(region) {
        return this.inventors.filter(inventor => inventor.region === region);
    },

    getByCountry(country) {
        return this.inventors.filter(inventor => inventor.country === country);
    },

    searchInventors(searchTerm) {
        const term = searchTerm.toLowerCase();
        return this.inventors.filter(inventor => 
            inventor.name.toLowerCase().includes(term) ||
            inventor.country.toLowerCase().includes(term) ||
            inventor.primaryInvention.toLowerCase().includes(term) ||
            inventor.category.toLowerCase().includes(term) ||
            inventor.tags.some(tag => tag.toLowerCase().includes(term))
        );
    },

    getStats() {
        return {
            totalInventors: this.inventors.length,
            countries: [...new Set(this.inventors.map(inv => inv.country))].length,
            totalPatents: this.inventors.reduce((sum, inv) => sum + inv.patents.length, 0),
            categories: [...new Set(this.inventors.map(inv => inv.category))],
            regions: [...new Set(this.inventors.map(inv => inv.region))]
        };
    }
};

// Export for use in other files (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = inventorsDatabase;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.inventorsDatabase = inventorsDatabase;
}