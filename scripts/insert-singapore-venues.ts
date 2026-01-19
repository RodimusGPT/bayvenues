/**
 * Insert Singapore wedding venues into Supabase
 * Usage: npx tsx scripts/insert-singapore-venues.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tpgruvfobcgzictihwrp.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

interface VenueInsert {
  id: string;
  name: string;
  region: string;
  subregion: string;
  address: string;
  description: string;
  capacity_min: number;
  capacity_max: number;
  price_min: number;
  price_max: number;
  price_unit: string;
  website: string;
  source: string;
}

const singaporeVenues: VenueInsert[] = [
  // Luxury Hotels - Singapore
  { id: 'sg-001', name: 'The St. Regis Singapore', region: 'Singapore', subregion: 'Orchard', address: '29 Tanglin Road, Singapore 247911', description: 'Five-star luxury hotel featuring the opulent John Jacob Ballroom with stunning chandeliers and bespoke furnishings. Singapore\'s first and only ballroom with two skylights, plus Caroline\'s Mansion for intimate ceremonies.', capacity_min: 50, capacity_max: 1000, price_min: 200, price_max: 500, price_unit: 'per_person', website: 'https://www.marriott.com/en-us/hotels/sinxr-the-st-regis-singapore/weddings/', source: 'scrape' },
  { id: 'sg-002', name: 'Raffles Hotel Singapore', region: 'Singapore', subregion: 'City Hall', address: '1 Beach Road, Singapore 189673', description: 'Iconic colonial-style hotel established in 1887, offering a unique blend of timeless elegance and modern luxury. Features tropical gardens for outdoor ceremonies and grand ballrooms for glamorous receptions.', capacity_min: 50, capacity_max: 400, price_min: 250, price_max: 600, price_unit: 'per_person', website: 'https://www.raffles.com/singapore/', source: 'scrape' },
  { id: 'sg-003', name: 'Marina Bay Sands', region: 'Singapore', subregion: 'Marina Bay', address: '10 Bayfront Avenue, Singapore 018956', description: 'The ultimate setting for luxurious weddings with Singapore\'s breathtaking skyline. Exchange vows outdoors before moving into elegant ballroom receptions with celebrity chef dining.', capacity_min: 100, capacity_max: 6000, price_min: 200, price_max: 500, price_unit: 'per_person', website: 'https://www.marinabaysands.com/wedding.html', source: 'scrape' },
  { id: 'sg-004', name: 'The Fullerton Hotel Singapore', region: 'Singapore', subregion: 'Marina Bay', address: '1 Fullerton Square, Singapore 049178', description: 'Grand heritage hotel housed in a beautifully restored neoclassical building. Majestic old-world charm with Palladian facade, pillar-less Ballroom, Straits Room, and al fresco East Garden terrace.', capacity_min: 50, capacity_max: 480, price_min: 180, price_max: 400, price_unit: 'per_person', website: 'https://www.fullertonhotels.com/the-fullerton-hotel-singapore', source: 'scrape' },
  { id: 'sg-005', name: 'Shangri-La Singapore', region: 'Singapore', subregion: 'Orchard', address: '22 Orange Grove Road, Singapore 258350', description: 'Epitome of grandeur with sprawling pillar-less grand ballroom, 15 function rooms, and stunning tropical gardens. Perfect blend of indoor elegance and outdoor tropical charm.', capacity_min: 60, capacity_max: 1000, price_min: 180, price_max: 450, price_unit: 'per_person', website: 'https://www.shangri-la.com/singapore/shangrila/', source: 'scrape' },
  { id: 'sg-006', name: 'The Ritz-Carlton, Millenia Singapore', region: 'Singapore', subregion: 'Marina Bay', address: '7 Raffles Avenue, Singapore 039799', description: 'Wedding celebrations giving a nod to traditions new and old. Features Grand Ballroom with attached foyer, evocative Garden Pavilion, and outdoor pool area for dinner and dancing.', capacity_min: 50, capacity_max: 1000, price_min: 200, price_max: 500, price_unit: 'per_person', website: 'https://www.ritzcarlton.com/en/hotels/sinrz-the-ritz-carlton-millenia-singapore/', source: 'scrape' },
  { id: 'sg-007', name: 'Mandarin Oriental Singapore', region: 'Singapore', subregion: 'Marina Bay', address: '5 Raffles Avenue, Marina Square, Singapore 039797', description: 'Prime location overlooking Marina Bay with stunning views and beautifully appointed event spaces. Grand ballrooms, intimate function rooms, exceptional service, and world-class amenities.', capacity_min: 50, capacity_max: 350, price_min: 200, price_max: 450, price_unit: 'per_person', website: 'https://www.mandarinoriental.com/en/singapore/marina-bay', source: 'scrape' },
  { id: 'sg-008', name: 'JW Marriott Hotel Singapore South Beach', region: 'Singapore', subregion: 'City Hall', address: '30 Beach Road, Singapore 189763', description: 'Uniquely blends historic heritage with modern style near Marina Bay. Standout Grand Ballroom features the iconic 11,520-light Forest of Lights installation with LED wall and outdoor courtyards.', capacity_min: 50, capacity_max: 300, price_min: 180, price_max: 400, price_unit: 'per_person', website: 'https://www.marriott.com/en-us/hotels/sinjw-jw-marriott-hotel-singapore-south-beach/', source: 'scrape' },
  { id: 'sg-009', name: 'Four Seasons Hotel Singapore', region: 'Singapore', subregion: 'Orchard', address: '190 Orchard Boulevard, Singapore 248646', description: 'Refined luxury hotel on Orchard Boulevard offering sophisticated wedding celebrations with impeccable service, elegant ballrooms, and lush garden settings.', capacity_min: 50, capacity_max: 280, price_min: 250, price_max: 550, price_unit: 'per_person', website: 'https://www.fourseasons.com/singapore/', source: 'scrape' },
  { id: 'sg-010', name: 'InterContinental Singapore', region: 'Singapore', subregion: 'Bugis', address: '80 Middle Road, Singapore 188966', description: 'Features glittering chandeliers, colonial French windows, and textured gold walls. Grand staircase and end-to-end Wedding Journey planning services.', capacity_min: 40, capacity_max: 320, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://www.ihg.com/intercontinental/hotels/us/en/singapore/sinpr/hoteldetail', source: 'scrape' },
  { id: 'sg-011', name: 'Singapore Marriott Tang Plaza Hotel', region: 'Singapore', subregion: 'Orchard', address: '320 Orchard Road, Singapore 238865', description: 'Iconic architecture in the heart of Orchard Road with versatile wedding venues. Grand Ballroom accommodates up to 550 guests with more intimate spaces available.', capacity_min: 50, capacity_max: 550, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://www.marriott.com/en-us/hotels/sindt-singapore-marriott-tang-plaza-hotel/', source: 'scrape' },
  { id: 'sg-012', name: 'Conrad Centennial Singapore', region: 'Singapore', subregion: 'Marina Bay', address: '2 Temasek Boulevard, Singapore 038982', description: 'Contemporary luxury hotel offering sophisticated wedding venues with stunning Marina Bay views. Multiple ballroom and function room options.', capacity_min: 60, capacity_max: 400, price_min: 180, price_max: 400, price_unit: 'per_person', website: 'https://www.hilton.com/en/hotels/sincdci-conrad-centennial-singapore/', source: 'scrape' },
  { id: 'sg-013', name: 'Andaz Singapore', region: 'Singapore', subregion: 'Bugis', address: '5 Fraser Street, Singapore 189354', description: 'Personal style concept hotel with naturally lit venues including The Glasshouse and Garden Studio. Modern, artistic atmosphere for unique celebrations.', capacity_min: 50, capacity_max: 280, price_min: 160, price_max: 380, price_unit: 'per_person', website: 'https://www.hyatt.com/andaz/sinaz-andaz-singapore', source: 'scrape' },
  { id: 'sg-014', name: 'Pan Pacific Singapore', region: 'Singapore', subregion: 'Marina Bay', address: '7 Raffles Boulevard, Marina Square, Singapore 039595', description: 'Award-winning hotel with Pacific Ballroom and stunning harbour views. Modern elegance with comprehensive wedding packages.', capacity_min: 50, capacity_max: 650, price_min: 150, price_max: 380, price_unit: 'per_person', website: 'https://www.panpacific.com/en/hotels-and-resorts/pp-singapore.html', source: 'scrape' },
  { id: 'sg-015', name: 'PARKROYAL COLLECTION Pickering', region: 'Singapore', subregion: 'Chinatown', address: '3 Upper Pickering Street, Singapore 058289', description: 'Award-winning garden hotel featuring terraced gardens, reflecting pools, and William Pickering ballroom. Unique vertical gardens and poolside terrace options.', capacity_min: 50, capacity_max: 300, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://www.panpacific.com/en/hotels-and-resorts/pr-collection-pickering.html', source: 'scrape' },
  { id: 'sg-016', name: 'Hilton Singapore Orchard', region: 'Singapore', subregion: 'Orchard', address: '333 Orchard Road, Singapore 238867', description: 'Prime Orchard Road location with versatile wedding venues. Modern elegance and comprehensive wedding services.', capacity_min: 50, capacity_max: 650, price_min: 150, price_max: 380, price_unit: 'per_person', website: 'https://www.hilton.com/en/hotels/sinhitw-hilton-singapore-orchard/', source: 'scrape' },
  { id: 'sg-017', name: 'The Fullerton Bay Hotel Singapore', region: 'Singapore', subregion: 'Marina Bay', address: '80 Collyer Quay, Singapore 049326', description: 'Boutique waterfront hotel with spectacular Marina Bay views. Intimate luxury with stunning rooftop venue Lantern and elegant ballroom.', capacity_min: 30, capacity_max: 600, price_min: 200, price_max: 500, price_unit: 'per_person', website: 'https://www.fullertonhotels.com/fullerton-bay-hotel-singapore', source: 'scrape' },
  { id: 'sg-018', name: 'Singapore EDITION', region: 'Singapore', subregion: 'Orchard', address: '38 Cuscaden Road, Singapore 249731', description: 'Ian Schrager\'s luxury design hotel with FYSH restaurant conservatory featuring 300+ plants and sustainable seafood focus. Contemporary sophistication.', capacity_min: 50, capacity_max: 340, price_min: 180, price_max: 450, price_unit: 'per_person', website: 'https://www.editionhotels.com/singapore/', source: 'scrape' },
  // Heritage & Unique
  { id: 'sg-019', name: 'CHIJMES Hall', region: 'Singapore', subregion: 'City Hall', address: '30 Victoria Street, Singapore 187996', description: 'Beautifully restored early 19th-century Gothic chapel and national monument. Features intricately-stained glass windows, high ceilings, and historic charm.', capacity_min: 50, capacity_max: 400, price_min: 150, price_max: 400, price_unit: 'per_person', website: 'https://www.chijmes.com.sg/', source: 'scrape' },
  { id: 'sg-020', name: 'The Alkaff Mansion', region: 'Singapore', subregion: 'Telok Blangah', address: '10 Telok Blangah Green, Singapore 109178', description: 'Century-old Tudor-style mansion atop Telok Blangah Hill. European-styled fountains, gazebo, expansive courtyard, and The Grounds with private waterfall. Ideal for garden weddings.', capacity_min: 50, capacity_max: 550, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://thealkaffmansion.sg/', source: 'scrape' },
  { id: 'sg-021', name: 'Burkill Hall', region: 'Singapore', subregion: 'Botanic Gardens', address: '1 Cluny Road, Singapore Botanic Gardens, Singapore 259569', description: 'Restored two-storey colonial bungalow within the National Orchid Garden at Singapore Botanic Gardens. Perfect for flower lovers seeking intimate garden ceremonies.', capacity_min: 30, capacity_max: 100, price_min: 100, price_max: 300, price_unit: 'per_person', website: 'https://www.nparks.gov.sg/sbg/burkill-hall', source: 'scrape' },
  { id: 'sg-022', name: 'Wheeler\'s Tropikana', region: 'Singapore', subregion: 'Gillman Barracks', address: '9A Lock Road, Gillman Barracks, Singapore 108926', description: 'Balinese-inspired tropical venue at former military barracks. Rustic alfresco areas, pool lawn, spacious indoor spaces, and Australasian cuisine.', capacity_min: 50, capacity_max: 230, price_min: 120, price_max: 280, price_unit: 'per_person', website: 'https://wheelerstropikana.com/', source: 'scrape' },
  { id: 'sg-023', name: 'One Rochester', region: 'Singapore', subregion: 'Rochester Park', address: '1 Rochester Park, Singapore 139212', description: 'Historical 1930s bungalow in Rochester Park offering lush garden settings and charming colonial architecture for romantic celebrations.', capacity_min: 40, capacity_max: 200, price_min: 120, price_max: 300, price_unit: 'per_person', website: 'https://www.onerochester.com/', source: 'scrape' },
  { id: 'sg-024', name: 'The Garage at Singapore Botanic Gardens', region: 'Singapore', subregion: 'Botanic Gardens', address: '50 Cluny Park Road, Singapore 257488', description: 'Located within Singapore\'s first UNESCO World Heritage Site. Surrounded by tropical flora and fauna with rich colonial history.', capacity_min: 40, capacity_max: 150, price_min: 100, price_max: 280, price_unit: 'per_person', website: 'https://www.nparks.gov.sg/sbg/', source: 'scrape' },
  // Rooftop & Garden
  { id: 'sg-025', name: '1-Arden', region: 'Singapore', subregion: 'CBD', address: '88 Market Street, #51-01, CapitaSpring, Singapore 048948', description: 'Serene rooftop garden perched 51 floors above the city featuring world\'s highest food forest. Sustainable farm-to-table concepts with stunning views.', capacity_min: 50, capacity_max: 200, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://www.1-group.sg/brand/1-arden/', source: 'scrape' },
  { id: 'sg-026', name: '1-Altitude Coast', region: 'Singapore', subregion: 'Sentosa', address: 'The Outpost Hotel, Level 5, Sentosa', description: 'Rooftop venue offering romantic ambience with panoramic seascapes from the highest vantage point on Sentosa. Indoor and outdoor spaces available.', capacity_min: 50, capacity_max: 250, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://www.1-group.sg/brand/1-altitude-coast/', source: 'scrape' },
  { id: 'sg-027', name: 'MONTI at Fullerton Pavilion', region: 'Singapore', subregion: 'Marina Bay', address: '82 Collyer Quay, Fullerton Pavilion, Singapore 049327', description: 'Breathtaking waterfront venue within iconic sphere on Fullerton Bay. Rooftop outdoor ceremony with floor-to-ceiling glass windows overlooking Marina Bay skyline.', capacity_min: 30, capacity_max: 150, price_min: 150, price_max: 400, price_unit: 'per_person', website: 'https://www.monti.sg/', source: 'scrape' },
  { id: 'sg-028', name: 'Gardens by the Bay', region: 'Singapore', subregion: 'Marina Bay', address: '18 Marina Gardens Drive, Singapore 018953', description: 'Iconic floral venue with Supertrees, Flower Dome, and Cloud Forest. VIP garden cruisers available. Spectacular backdrop for once-in-a-lifetime celebrations.', capacity_min: 50, capacity_max: 30000, price_min: 100, price_max: 500, price_unit: 'per_person', website: 'https://www.gardensbythebay.com.sg/', source: 'scrape' },
  { id: 'sg-029', name: 'Mount Faber Peak', region: 'Singapore', subregion: 'Mount Faber', address: '109 Mount Faber Road, Singapore 099203', description: 'Atop Mount Faber with unbeatable panoramic views. Arbora Garden featuring Poland\'s Bells of Happiness. Perfect for sunset ceremonies.', capacity_min: 40, capacity_max: 200, price_min: 120, price_max: 300, price_unit: 'per_person', website: 'https://www.mountfaber.com.sg/', source: 'scrape' },
  { id: 'sg-030', name: 'Open Farm Community', region: 'Singapore', subregion: 'Dempsey Hill', address: '130E Minden Road, Singapore 248819', description: 'Garden lawn at foot of Dempsey Hill near Singapore Botanical Gardens. Farm-to-table dining with organic produce in glasshouse setting.', capacity_min: 30, capacity_max: 110, price_min: 100, price_max: 250, price_unit: 'per_person', website: 'https://www.openfarmcommunity.com/', source: 'scrape' },
  { id: 'sg-031', name: 'Siri House', region: 'Singapore', subregion: 'Dempsey Hill', address: '8D Dempsey Road, Singapore 249672', description: 'Three versatile Art Deco spaces with colourful handwoven Jim Thompson silks. Pet-friendly with complimentary parking.', capacity_min: 40, capacity_max: 260, price_min: 100, price_max: 280, price_unit: 'per_person', website: 'https://www.sirihouse.com/', source: 'scrape' },
  { id: 'sg-032', name: 'Vineyard at HortPark', region: 'Singapore', subregion: 'HortPark', address: '33 Hyderabad Road, #02-02, HortPark, Singapore 119578', description: 'Countryside-inspired venue amid HortPark greenery. Rustic decor with sunset terrace overlooking pool along Southern Ridges.', capacity_min: 40, capacity_max: 146, price_min: 100, price_max: 250, price_unit: 'per_person', website: 'https://www.vineyardhortpark.com.sg/', source: 'scrape' },
  { id: 'sg-033', name: '1-Atico', region: 'Singapore', subregion: 'Orchard', address: '2 Orchard Turn, #55-01, ION Orchard, Singapore 238801', description: 'Located 55 floors atop ION Orchard with bird\'s eye view of cityscape. Grand window walls and modernistic lighting.', capacity_min: 50, capacity_max: 252, price_min: 150, price_max: 380, price_unit: 'per_person', website: 'https://www.1-group.sg/brand/1-atico/', source: 'scrape' },
  { id: 'sg-034', name: '1-Alfaro', region: 'Singapore', subregion: 'Labrador', address: 'Level 34, Labrador Tower, Singapore 118479', description: '34-floor rooftop venue with unobstructed city skyline and sea views. Emilia-Romagna cuisine.', capacity_min: 40, capacity_max: 120, price_min: 130, price_max: 320, price_unit: 'per_person', website: 'https://www.1-group.sg/brand/1-alfaro/', source: 'scrape' },
  // Unique venues
  { id: 'sg-035', name: 'Singapore Flyer', region: 'Singapore', subregion: 'Marina Bay', address: '30 Raffles Avenue, Singapore 039803', description: 'Exchange vows 165 meters above ground with in-flight hosts, champagne, and double-tiered wedding cake. Ultimate unique experience.', capacity_min: 2, capacity_max: 28, price_min: 200, price_max: 500, price_unit: 'per_person', website: 'https://www.singaporeflyer.com/', source: 'scrape' },
  { id: 'sg-036', name: 'Resorts World Sentosa', region: 'Sentosa', subregion: 'Sentosa', address: '8 Sentosa Gateway, Singapore 098269', description: 'Unique themed venues including Universal Studios Singapore New York Street and S.E.A. Aquarium with majestic sea creatures backdrop.', capacity_min: 50, capacity_max: 1000, price_min: 150, price_max: 400, price_unit: 'per_person', website: 'https://www.rwsentosa.com/', source: 'scrape' },
  { id: 'sg-037', name: 'Mandai Wildlife Reserve', region: 'Singapore', subregion: 'Mandai', address: '80 Mandai Lake Road, Singapore 729826', description: 'Adventure-themed weddings at Singapore Zoo with Forest Lodge package, animal appearances, and rainforest setting.', capacity_min: 50, capacity_max: 300, price_min: 120, price_max: 300, price_unit: 'per_person', website: 'https://www.mandai.com/', source: 'scrape' },
  { id: 'sg-038', name: 'Mandai Rainforest Resort by Banyan Tree', region: 'Singapore', subregion: 'Mandai', address: '60 Mandai Lake Road, Singapore 729979', description: 'Tropical paradise with rainforest and lake views. Pillarless ballroom with 4m-high ceilings inspired by bridal stinkhorn mushroom. Exclusive wildlife photography access.', capacity_min: 50, capacity_max: 300, price_min: 180, price_max: 400, price_unit: 'per_person', website: 'https://www.banyantree.com/singapore/mandai-rainforest-resort', source: 'scrape' },
  // More hotels
  { id: 'sg-039', name: 'Grand Copthorne Waterfront Hotel', region: 'Singapore', subregion: 'Robertson Quay', address: '392 Havelock Road, Singapore 169663', description: 'Riverside destination with 850 sqm pillarless ballroom, two massive LED screens, and high-res video walls with laser projectors.', capacity_min: 50, capacity_max: 600, price_min: 130, price_max: 300, price_unit: 'per_person', website: 'https://www.millenniumhotels.com/en/singapore/grand-copthorne-waterfront-hotel/', source: 'scrape' },
  { id: 'sg-040', name: 'Copthorne King\'s Hotel Singapore', region: 'Singapore', subregion: 'Havelock', address: '403 Havelock Road, Singapore 169632', description: 'All-inclusive packages with award-winning eight-course Teochew menu from Tien Court restaurant. Three themed packages available.', capacity_min: 100, capacity_max: 1400, price_min: 100, price_max: 250, price_unit: 'per_person', website: 'https://www.millenniumhotels.com/en/singapore/copthorne-kings-hotel-singapore/', source: 'scrape' },
  { id: 'sg-041', name: 'Holiday Inn Singapore Atrium', region: 'Singapore', subregion: 'Outram', address: '317 Outram Road, Singapore 169075', description: 'Newly refurbished ballrooms with custom-themed decor, laser projections, and live streaming capabilities. Affordable luxury.', capacity_min: 50, capacity_max: 400, price_min: 100, price_max: 220, price_unit: 'per_person', website: 'https://www.ihg.com/holidayinn/hotels/us/en/singapore/sinhi/hoteldetail', source: 'scrape' },
  { id: 'sg-042', name: 'Amara Singapore', region: 'Singapore', subregion: 'Tanjong Pagar', address: '165 Tanjong Pagar Road, Singapore 088539', description: 'Pillar-less ballroom with 38m aisle flanked by floor-to-ceiling LED screens. Heritage Peranakan cuisine with modern contemporary flavours.', capacity_min: 50, capacity_max: 400, price_min: 130, price_max: 300, price_unit: 'per_person', website: 'https://singapore.amarahotels.com/', source: 'scrape' },
  { id: 'sg-043', name: 'Paradox Singapore Merchant Court', region: 'Singapore', subregion: 'Clarke Quay', address: '20 Merchant Road, Singapore 058281', description: 'Riverside destination with magnificent floor-to-ceiling glass windows. Award-winning Cantonese cuisine from Jade restaurant.', capacity_min: 50, capacity_max: 460, price_min: 130, price_max: 320, price_unit: 'per_person', website: 'https://www.paradoxhotels.com/singapore', source: 'scrape' },
  { id: 'sg-044', name: 'Grand Park City Hall', region: 'Singapore', subregion: 'City Hall', address: '10 Coleman Street, Singapore 179809', description: 'Rooftop garden and restaurant ideal for garden-inspired weddings. Neoclassical design accommodating up to 120 guests.', capacity_min: 30, capacity_max: 120, price_min: 120, price_max: 280, price_unit: 'per_person', website: 'https://www.parkhotelgroup.com/grand-park-city-hall', source: 'scrape' },
  // Restaurants
  { id: 'sg-045', name: 'Claudine Restaurant', region: 'Singapore', subregion: 'Dempsey Hill', address: '39C Harding Road, Singapore 249541', description: 'Restored colonial chapel with arches and stained-glass windows. French neo-brasserie cuisine in intimate setting.', capacity_min: 30, capacity_max: 72, price_min: 120, price_max: 300, price_unit: 'per_person', website: 'https://claudinerestaurant.com/', source: 'scrape' },
  { id: 'sg-046', name: 'The Dempsey Cookhouse and Bar', region: 'Singapore', subregion: 'Dempsey Hill', address: '17D Dempsey Road, Singapore 249676', description: 'Two-Michelin starred Chef Jean-Georges venue with open kitchen. Contemporary French fusion in colonial bungalow.', capacity_min: 50, capacity_max: 180, price_min: 150, price_max: 400, price_unit: 'per_person', website: 'https://www.comodempsey.sg/', source: 'scrape' },
  { id: 'sg-047', name: 'VUE Bar and Grill', region: 'Singapore', subregion: 'Marina Bay', address: '50 Collyer Quay, OUE Bayfront Level 19, Singapore 049321', description: 'Sophisticated rooftop venue with Marina Bay views. Premium steakhouse dining experience.', capacity_min: 30, capacity_max: 80, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://www.vue.com.sg/', source: 'scrape' },
  { id: 'sg-048', name: 'Greenwood Fish Market', region: 'Sentosa', subregion: 'Sentosa Cove', address: '31 Ocean Way, #01-04/05, Quayside Isle, Singapore 098375', description: 'Waterfront Sentosa Cove venue with Western, Japanese, and Chinese seafood cuisine. Complimentary cruise around Southern Islands for newlyweds.', capacity_min: 50, capacity_max: 250, price_min: 100, price_max: 280, price_unit: 'per_person', website: 'https://www.greenwoodfishmarket.com/', source: 'scrape' },
  { id: 'sg-049', name: 'Alma Restaurant', region: 'Singapore', subregion: 'Orchard', address: '22 Scotts Road, Goodwood Park Hotel, Singapore 228221', description: 'Asian-influenced Modern-European cuisine within historic Goodwood Park Hotel. Casual atmosphere with lounge terrace.', capacity_min: 30, capacity_max: 100, price_min: 120, price_max: 300, price_unit: 'per_person', website: 'https://www.alma.sg/', source: 'scrape' },
  { id: 'sg-050', name: 'HAUS217', region: 'Singapore', subregion: 'Lavender', address: '217 Lavender Street, Singapore 338772', description: 'Wabi-Sabi inspired design with stone, wood, and textured glass elements. Natural light and modern aesthetic.', capacity_min: 40, capacity_max: 200, price_min: 100, price_max: 250, price_unit: 'per_person', website: 'https://www.haus217.com.sg/', source: 'scrape' },
  // Sentosa venues
  { id: 'sg-051', name: 'Capella Singapore', region: 'Sentosa', subregion: 'The Knolls', address: '1 The Knolls, Sentosa Island, Singapore 098297', description: 'Singapore\'s first and only circular ballroom with dramatic glass dome allowing natural sunlight. Three stunning solemnisation venues: Horizon\'s Verge sunset patio, Poolside Bliss, and Garden of Dreams lawn.', capacity_min: 50, capacity_max: 400, price_min: 250, price_max: 600, price_unit: 'per_person', website: 'https://www.capellahotels.com/en/capella-singapore', source: 'scrape' },
  { id: 'sg-052', name: 'Shangri-La Rasa Sentosa', region: 'Sentosa', subregion: 'Siloso', address: '101 Siloso Road, Singapore 098970', description: 'Only beachfront resort in Singapore with panoramic South China Sea views. Venues include Horizon Pavilion, Siloso Ballroom, Rasa Lawn, and The Rasa Shore on Siloso Beach.', capacity_min: 50, capacity_max: 360, price_min: 178, price_max: 350, price_unit: 'per_person', website: 'https://www.shangri-la.com/singapore/rasasentosaresort/', source: 'scrape' },
  { id: 'sg-053', name: 'Sofitel Singapore Sentosa Resort & Spa', region: 'Sentosa', subregion: 'Bukit Manis', address: '2 Bukit Manis Road, Sentosa Island, Singapore 099891', description: 'French luxury blending with contemporary flair. Private cliff-top lawn overlooking South China Sea. The Cliff venue for intimate ceremonies with azure skies backdrop.', capacity_min: 20, capacity_max: 240, price_min: 178, price_max: 400, price_unit: 'per_person', website: 'https://www.sofitel-singapore-sentosa.com/', source: 'scrape' },
  { id: 'sg-054', name: 'W Singapore - Sentosa Cove', region: 'Sentosa', subregion: 'Sentosa Cove', address: '21 Ocean Way, Singapore 098374', description: 'Tropical lawn ceremony space with Great Room (720 sqm) featuring crystal lighting and chandeliers. WOOBAR for post-reception cocktails.', capacity_min: 50, capacity_max: 480, price_min: 165, price_max: 380, price_unit: 'per_person', website: 'https://www.marriott.com/en-us/hotels/sinwh-w-singapore-sentosa-cove/', source: 'scrape' },
  { id: 'sg-055', name: 'The Barracks Hotel Sentosa', region: 'Sentosa', subregion: 'Palawan Ridge', address: '2 Gunner Lane, Palawan Ridge, Sentosa Island, Singapore 099567', description: 'Heritage building backdrop with 500 sqm Barracks Lawn and glasshouse. Over 1200 sqm of indoor and outdoor spaces for sophisticated island destination wedding.', capacity_min: 50, capacity_max: 260, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://www.thebarrackshotel.com.sg/', source: 'scrape' },
  { id: 'sg-056', name: 'The Outpost Hotel Sentosa', region: 'Sentosa', subregion: 'Palawan Ridge', address: '10 Artillery Avenue, Palawan Ridge, Sentosa Island, Singapore 099951', description: 'Heritage events centre with high ceilings and timber beams. Hilltop venue overlooking Singapore Strait with garden ceremony setting and Heritage Courtyard.', capacity_min: 50, capacity_max: 160, price_min: 119, price_max: 280, price_unit: 'per_person', website: 'https://www.theoutposthotel.com.sg/', source: 'scrape' },
  { id: 'sg-057', name: 'Oasia Resort Sentosa', region: 'Sentosa', subregion: 'Palawan Ridge', address: '23 Beach View Road, Palawan Ridge, Sentosa Island, Singapore 098673', description: 'High ceilings with floor-to-ceiling glass panels at The Aloes venue. Spa treatment included in wedding packages.', capacity_min: 50, capacity_max: 140, price_min: 120, price_max: 280, price_unit: 'per_person', website: 'https://www.oasiahotels.com/en/singapore/oasia-resort-sentosa/', source: 'scrape' },
  { id: 'sg-058', name: 'Amara Sanctuary Resort Sentosa', region: 'Sentosa', subregion: 'Larkhill Road', address: '1 Larkhill Road, Sentosa, Singapore 099394', description: 'Private and serene venue with beautiful glass pavilion and full nature views. Poolside options for cool wedding settings in lush surroundings.', capacity_min: 40, capacity_max: 200, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://www.amarasanctuary.com/', source: 'scrape' },
  { id: 'sg-059', name: 'One°15 Marina Sentosa Cove', region: 'Sentosa', subregion: 'Sentosa Cove', address: '11 Cove Drive, #01-01, Sentosa Cove, Singapore 098497', description: 'Exclusive luxury sailing club with pillarless ballroom and yacht chartering options. Celebrate on the seas with stunning marina views.', capacity_min: 50, capacity_max: 360, price_min: 150, price_max: 380, price_unit: 'per_person', website: 'https://www.one15marina.com/', source: 'scrape' },
  { id: 'sg-060', name: 'Sky Garden Sentosa', region: 'Sentosa', subregion: 'Siloso Point', address: '80 Siloso Road, #02-02, Singapore 098969', description: 'Voted Best Wedding Solemnisation Venue with a View. Outdoor area with fine greenery plus fully air-conditioned indoor space with glass ceilings.', capacity_min: 30, capacity_max: 200, price_min: 120, price_max: 300, price_unit: 'per_person', website: 'https://skygardensentosa.com/', source: 'scrape' },
  { id: 'sg-061', name: 'Sentosa Golf Club', region: 'Sentosa', subregion: 'Bukit Manis', address: '27 Bukit Manis Road, Singapore 099892', description: 'Sentosa Pavilion rooftop overlooking Serapong course, South Garden verandah with sea views, and Grand Ballroom options.', capacity_min: 50, capacity_max: 300, price_min: 138, price_max: 320, price_unit: 'per_person', website: 'https://www.sentosagolf.com/', source: 'scrape' },
  { id: 'sg-062', name: 'Panamericana at Sentosa Golf Club', region: 'Sentosa', subregion: 'Bukit Manis', address: '27 Bukit Manis Road, Sentosa Golf Club, Singapore 099892', description: '7,000 sqft indoor space with natural daylight. Verandah with sea views and golf course surroundings, plus manicured lawn overlooking ocean.', capacity_min: 50, capacity_max: 300, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://www.panamericana.sg/', source: 'scrape' },
  { id: 'sg-063', name: 'Tanjong Beach Club', region: 'Sentosa', subregion: 'Tanjong Beach', address: '120 Tanjong Beach Walk, Singapore 098942', description: 'Beachfront location with coastal-inspired menu. Multiple indoor and outdoor spaces for relaxed beach weddings.', capacity_min: 50, capacity_max: 200, price_min: 100, price_max: 280, price_unit: 'per_person', website: 'https://www.tanjongbeachclub.com/', source: 'scrape' },
  { id: 'sg-064', name: '1-Flowerhill', region: 'Sentosa', subregion: 'Artillery Avenue', address: 'Artillery Avenue, Sentosa Island, Singapore', description: 'Newest heritage wedding venue on Sentosa in century-old building. Charming colonial arches, green-and-white balustrades, and spiral staircases.', capacity_min: 40, capacity_max: 150, price_min: 150, price_max: 350, price_unit: 'per_person', website: 'https://www.1-group.sg/', source: 'scrape' },
];

async function main() {
  console.log('Starting Singapore venues insertion...\n');

  // Step 1: Add regions
  console.log('Step 1: Adding Singapore regions...');
  const { error: regionError } = await supabase
    .from('regions')
    .upsert([
      { name: 'Singapore', country: 'Singapore', continent: 'Asia' },
      { name: 'Sentosa', country: 'Singapore', continent: 'Asia' },
    ], { onConflict: 'name' });

  if (regionError) {
    console.error('Error adding regions:', regionError);
  } else {
    console.log('✅ Regions added successfully');
  }

  // Step 2: Insert venues in batches
  console.log('\nStep 2: Inserting venues...');
  const batchSize = 10;
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < singaporeVenues.length; i += batchSize) {
    const batch = singaporeVenues.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('venues')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      errors += batch.length;
    } else {
      inserted += batch.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} venues)`);
    }
  }

  console.log(`\n📊 Results: ${inserted} inserted, ${errors} errors`);

  // Step 3: Link venue types
  console.log('\nStep 3: Linking venue types...');

  // Get venue type IDs
  const { data: venueTypes } = await supabase
    .from('venue_types')
    .select('id, name');

  if (venueTypes) {
    const typeMap = new Map(venueTypes.map(vt => [vt.name, vt.id]));

    const venueTypeLinks: { venue_id: string; venue_type_id: number }[] = [];

    for (const venue of singaporeVenues) {
      // Hotels
      if (venue.name.includes('Hotel') || venue.name.includes('Marriott') || venue.name.includes('Ritz') ||
          venue.name.includes('Regis') || venue.name.includes('Shangri') || venue.name.includes('Four Seasons') ||
          venue.name.includes('Hilton') || venue.name.includes('Conrad') || venue.name.includes('Mandarin') ||
          venue.name.includes('Capella') || venue.name.includes('Sofitel') || venue.name.includes('Raffles') ||
          venue.name.includes('Fullerton') || venue.name.includes('InterContinental') || venue.name.includes('Resort') ||
          venue.name.includes('EDITION') || venue.name.includes('Andaz') || venue.name.includes('Pan Pacific') ||
          venue.name.includes('PARKROYAL') || venue.name.includes('Oasia') || venue.name.includes('Barracks') ||
          venue.name.includes('Outpost') || venue.name.includes('Amara') || venue.name.includes('Copthorne') ||
          venue.name.includes('Holiday Inn') || venue.name.includes('Paradox') || venue.name.includes('Grand Park')) {
        const typeId = typeMap.get('Hotel/Resort');
        if (typeId) venueTypeLinks.push({ venue_id: venue.id, venue_type_id: typeId });
      }
      // Gardens
      if (venue.name.includes('Garden') || venue.name.includes('Botanic') || venue.name.includes('HortPark') ||
          venue.name.includes('Vineyard') || venue.name.includes('Farm') || venue.name.includes('Mansion')) {
        const typeId = typeMap.get('Garden/Outdoor');
        if (typeId) venueTypeLinks.push({ venue_id: venue.id, venue_type_id: typeId });
      }
      // Heritage
      if (venue.name.includes('Mansion') || venue.name.includes('CHIJMES') || venue.name.includes('Burkill') ||
          venue.name.includes('Wheeler') || venue.name.includes('Rochester') || venue.name.includes('Barracks') ||
          venue.name.includes('Flowerhill') || venue.name.includes('Raffles') || venue.name.includes('Fullerton')) {
        const typeId = typeMap.get('Historic/Heritage');
        if (typeId) venueTypeLinks.push({ venue_id: venue.id, venue_type_id: typeId });
      }
      // Rooftop
      if (venue.name.includes('1-Arden') || venue.name.includes('1-Altitude') || venue.name.includes('1-Atico') ||
          venue.name.includes('1-Alfaro') || venue.name.includes('MONTI') || venue.name.includes('VUE') ||
          venue.name.includes('Sky Garden') || venue.name.includes('Mount Faber')) {
        const typeId = typeMap.get('Rooftop');
        if (typeId) venueTypeLinks.push({ venue_id: venue.id, venue_type_id: typeId });
      }
      // Restaurant
      if (venue.name.includes('Restaurant') || venue.name.includes('Claudine') || venue.name.includes('Cookhouse') ||
          venue.name.includes('Alma') || venue.name.includes('Fish Market') || venue.name.includes('Panamericana') ||
          venue.name.includes('Beach Club') || venue.name.includes('HAUS')) {
        const typeId = typeMap.get('Restaurant');
        if (typeId) venueTypeLinks.push({ venue_id: venue.id, venue_type_id: typeId });
      }
      // Beach
      if (venue.name.includes('Beach') || venue.name.includes('Rasa Sentosa') || venue.name.includes('Tanjong')) {
        const typeId = typeMap.get('Beach');
        if (typeId) venueTypeLinks.push({ venue_id: venue.id, venue_type_id: typeId });
      }
    }

    if (venueTypeLinks.length > 0) {
      const { error: linkError } = await supabase
        .from('venue_venue_types')
        .upsert(venueTypeLinks, { onConflict: 'venue_id,venue_type_id', ignoreDuplicates: true });

      if (linkError) {
        console.error('Error linking venue types:', linkError.message);
      } else {
        console.log(`✅ Linked ${venueTypeLinks.length} venue types`);
      }
    }
  }

  // Step 4: Link settings
  console.log('\nStep 4: Linking settings...');

  const settingsLinks: { venue_id: string; setting: string }[] = [];

  for (const venue of singaporeVenues) {
    // All venues have indoor
    settingsLinks.push({ venue_id: venue.id, setting: 'Indoor' });

    // Outdoor venues
    if (venue.name.includes('Garden') || venue.name.includes('Outdoor') || venue.name.includes('Beach') ||
        venue.name.includes('Lawn') || venue.name.includes('Mansion') || venue.name.includes('Rooftop') ||
        venue.name.includes('Farm') || venue.name.includes('HortPark') || venue.name.includes('Rasa Sentosa') ||
        venue.name.includes('Capella') || venue.name.includes('Sofitel') || venue.name.includes('Barracks') ||
        venue.name.includes('1-Arden') || venue.name.includes('1-Altitude') || venue.name.includes('MONTI') ||
        venue.name.includes('VUE') || venue.name.includes('Sky Garden') || venue.name.includes('Mount Faber') ||
        venue.name.includes('Vineyard') || venue.name.includes('Tanjong') || venue.name.includes('Flowerhill') ||
        venue.name.includes('Shangri-La') || venue.name.includes('Four Seasons') || venue.name.includes('Golf')) {
      settingsLinks.push({ venue_id: venue.id, setting: 'Outdoor' });
    }
  }

  const { error: settingsError } = await supabase
    .from('venue_settings')
    .upsert(settingsLinks, { onConflict: 'venue_id,setting', ignoreDuplicates: true });

  if (settingsError) {
    console.error('Error linking settings:', settingsError.message);
  } else {
    console.log(`✅ Linked ${settingsLinks.length} settings`);
  }

  // Final count
  const { count } = await supabase
    .from('venues')
    .select('*', { count: 'exact', head: true })
    .like('id', 'sg-%');

  console.log(`\n🎉 Done! Total Singapore venues in database: ${count}`);
}

main().catch(console.error);
