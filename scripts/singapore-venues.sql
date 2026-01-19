-- Singapore Wedding Venues Migration
-- Run this in Supabase SQL Editor

-- Step 1: Add Singapore regions
INSERT INTO regions (name, country, continent) VALUES
  ('Singapore', 'Singapore', 'Asia'),
  ('Sentosa', 'Singapore', 'Asia')
ON CONFLICT (name) DO NOTHING;

-- Step 2: Insert Singapore venues (main city)
INSERT INTO venues (id, name, region, subregion, address, description, capacity_min, capacity_max, price_min, price_max, price_unit, website, source) VALUES
-- Luxury Hotels
('sg-001', 'The St. Regis Singapore', 'Singapore', 'Orchard', '29 Tanglin Road, Singapore 247911', 'Five-star luxury hotel featuring the opulent John Jacob Ballroom with stunning chandeliers and bespoke furnishings. Singapore''s first and only ballroom with two skylights, plus Caroline''s Mansion for intimate ceremonies.', 50, 1000, 200, 500, 'per_person', 'https://www.marriott.com/en-us/hotels/sinxr-the-st-regis-singapore/weddings/', 'scrape'),
('sg-002', 'Raffles Hotel Singapore', 'Singapore', 'City Hall', '1 Beach Road, Singapore 189673', 'Iconic colonial-style hotel established in 1887, offering a unique blend of timeless elegance and modern luxury. Features tropical gardens for outdoor ceremonies and grand ballrooms for glamorous receptions.', 50, 400, 250, 600, 'per_person', 'https://www.raffles.com/singapore/', 'scrape'),
('sg-003', 'Marina Bay Sands', 'Singapore', 'Marina Bay', '10 Bayfront Avenue, Singapore 018956', 'The ultimate setting for luxurious weddings with Singapore''s breathtaking skyline. Exchange vows outdoors before moving into elegant ballroom receptions with celebrity chef dining.', 100, 6000, 200, 500, 'per_person', 'https://www.marinabaysands.com/wedding.html', 'scrape'),
('sg-004', 'The Fullerton Hotel Singapore', 'Singapore', 'Marina Bay', '1 Fullerton Square, Singapore 049178', 'Grand heritage hotel housed in a beautifully restored neoclassical building. Majestic old-world charm with Palladian facade, pillar-less Ballroom, Straits Room, and al fresco East Garden terrace.', 50, 480, 180, 400, 'per_person', 'https://www.fullertonhotels.com/the-fullerton-hotel-singapore', 'scrape'),
('sg-005', 'Shangri-La Singapore', 'Singapore', 'Orchard', '22 Orange Grove Road, Singapore 258350', 'Epitome of grandeur with sprawling pillar-less grand ballroom, 15 function rooms, and stunning tropical gardens. Perfect blend of indoor elegance and outdoor tropical charm.', 60, 1000, 180, 450, 'per_person', 'https://www.shangri-la.com/singapore/shangrila/', 'scrape'),
('sg-006', 'The Ritz-Carlton, Millenia Singapore', 'Singapore', 'Marina Bay', '7 Raffles Avenue, Singapore 039799', 'Wedding celebrations giving a nod to traditions new and old. Features Grand Ballroom with attached foyer, evocative Garden Pavilion, and outdoor pool area for dinner and dancing.', 50, 1000, 200, 500, 'per_person', 'https://www.ritzcarlton.com/en/hotels/sinrz-the-ritz-carlton-millenia-singapore/', 'scrape'),
('sg-007', 'Mandarin Oriental Singapore', 'Singapore', 'Marina Bay', '5 Raffles Avenue, Marina Square, Singapore 039797', 'Prime location overlooking Marina Bay with stunning views and beautifully appointed event spaces. Grand ballrooms, intimate function rooms, exceptional service, and world-class amenities.', 50, 350, 200, 450, 'per_person', 'https://www.mandarinoriental.com/en/singapore/marina-bay', 'scrape'),
('sg-008', 'JW Marriott Hotel Singapore South Beach', 'Singapore', 'City Hall', '30 Beach Road, Singapore 189763', 'Uniquely blends historic heritage with modern style near Marina Bay. Standout Grand Ballroom features the iconic 11,520-light Forest of Lights installation with LED wall and outdoor courtyards.', 50, 300, 180, 400, 'per_person', 'https://www.marriott.com/en-us/hotels/sinjw-jw-marriott-hotel-singapore-south-beach/', 'scrape'),
('sg-009', 'Four Seasons Hotel Singapore', 'Singapore', 'Orchard', '190 Orchard Boulevard, Singapore 248646', 'Refined luxury hotel on Orchard Boulevard offering sophisticated wedding celebrations with impeccable service, elegant ballrooms, and lush garden settings.', 50, 280, 250, 550, 'per_person', 'https://www.fourseasons.com/singapore/', 'scrape'),
('sg-010', 'InterContinental Singapore', 'Singapore', 'Bugis', '80 Middle Road, Singapore 188966', 'Features glittering chandeliers, colonial French windows, and textured gold walls. Grand staircase and end-to-end Wedding Journey planning services.', 40, 320, 150, 350, 'per_person', 'https://www.ihg.com/intercontinental/hotels/us/en/singapore/sinpr/hoteldetail', 'scrape'),
('sg-011', 'Singapore Marriott Tang Plaza Hotel', 'Singapore', 'Orchard', '320 Orchard Road, Singapore 238865', 'Iconic architecture in the heart of Orchard Road with versatile wedding venues. Grand Ballroom accommodates up to 550 guests with more intimate spaces available.', 50, 550, 150, 350, 'per_person', 'https://www.marriott.com/en-us/hotels/sindt-singapore-marriott-tang-plaza-hotel/', 'scrape'),
('sg-012', 'Conrad Centennial Singapore', 'Singapore', 'Marina Bay', '2 Temasek Boulevard, Singapore 038982', 'Contemporary luxury hotel offering sophisticated wedding venues with stunning Marina Bay views. Multiple ballroom and function room options.', 60, 400, 180, 400, 'per_person', 'https://www.hilton.com/en/hotels/sincdci-conrad-centennial-singapore/', 'scrape'),
('sg-013', 'Andaz Singapore', 'Singapore', 'Bugis', '5 Fraser Street, Singapore 189354', 'Personal style concept hotel with naturally lit venues including The Glasshouse and Garden Studio. Modern, artistic atmosphere for unique celebrations.', 50, 280, 160, 380, 'per_person', 'https://www.hyatt.com/andaz/sinaz-andaz-singapore', 'scrape'),
('sg-014', 'Pan Pacific Singapore', 'Singapore', 'Marina Bay', '7 Raffles Boulevard, Marina Square, Singapore 039595', 'Award-winning hotel with Pacific Ballroom and stunning harbour views. Modern elegance with comprehensive wedding packages.', 50, 650, 150, 380, 'per_person', 'https://www.panpacific.com/en/hotels-and-resorts/pp-singapore.html', 'scrape'),
('sg-015', 'PARKROYAL COLLECTION Pickering', 'Singapore', 'Chinatown', '3 Upper Pickering Street, Singapore 058289', 'Award-winning garden hotel featuring terraced gardens, reflecting pools, and William Pickering ballroom. Unique vertical gardens and poolside terrace options.', 50, 300, 150, 350, 'per_person', 'https://www.panpacific.com/en/hotels-and-resorts/pr-collection-pickering.html', 'scrape'),
('sg-016', 'Hilton Singapore Orchard', 'Singapore', 'Orchard', '333 Orchard Road, Singapore 238867', 'Prime Orchard Road location with versatile wedding venues. Modern elegance and comprehensive wedding services.', 50, 650, 150, 380, 'per_person', 'https://www.hilton.com/en/hotels/sinhitw-hilton-singapore-orchard/', 'scrape'),
('sg-017', 'The Fullerton Bay Hotel Singapore', 'Singapore', 'Marina Bay', '80 Collyer Quay, Singapore 049326', 'Boutique waterfront hotel with spectacular Marina Bay views. Intimate luxury with stunning rooftop venue Lantern and elegant ballroom.', 30, 600, 200, 500, 'per_person', 'https://www.fullertonhotels.com/fullerton-bay-hotel-singapore', 'scrape'),
('sg-018', 'Singapore EDITION', 'Singapore', 'Orchard', '38 Cuscaden Road, Singapore 249731', 'Ian Schrager''s luxury design hotel with FYSH restaurant conservatory featuring 300+ plants and sustainable seafood focus. Contemporary sophistication.', 50, 340, 180, 450, 'per_person', 'https://www.editionhotels.com/singapore/', 'scrape'),
-- Heritage & Unique Venues
('sg-019', 'CHIJMES Hall', 'Singapore', 'City Hall', '30 Victoria Street, Singapore 187996', 'Beautifully restored early 19th-century Gothic chapel and national monument. Features intricately-stained glass windows, high ceilings, and historic charm.', 50, 400, 150, 400, 'per_person', 'https://www.chijmes.com.sg/', 'scrape'),
('sg-020', 'The Alkaff Mansion', 'Singapore', 'Telok Blangah', '10 Telok Blangah Green, Singapore 109178', 'Century-old Tudor-style mansion atop Telok Blangah Hill. European-styled fountains, gazebo, expansive courtyard, and The Grounds with private waterfall. Ideal for garden weddings.', 50, 550, 150, 350, 'per_person', 'https://thealkaffmansion.sg/', 'scrape'),
('sg-021', 'Burkill Hall', 'Singapore', 'Botanic Gardens', '1 Cluny Road, Singapore Botanic Gardens, Singapore 259569', 'Restored two-storey colonial bungalow within the National Orchid Garden at Singapore Botanic Gardens. Perfect for flower lovers seeking intimate garden ceremonies.', 30, 100, 100, 300, 'per_person', 'https://www.nparks.gov.sg/sbg/burkill-hall', 'scrape'),
('sg-022', 'Wheeler''s Tropikana', 'Singapore', 'Gillman Barracks', '9A Lock Road, Gillman Barracks, Singapore 108926', 'Balinese-inspired tropical venue at former military barracks. Rustic alfresco areas, pool lawn, spacious indoor spaces, and Australasian cuisine.', 50, 230, 120, 280, 'per_person', 'https://wheelerstropikana.com/', 'scrape'),
('sg-023', 'One Rochester', 'Singapore', 'Rochester Park', '1 Rochester Park, Singapore 139212', 'Historical 1930s bungalow in Rochester Park offering lush garden settings and charming colonial architecture for romantic celebrations.', 40, 200, 120, 300, 'per_person', 'https://www.onerochester.com/', 'scrape'),
('sg-024', 'The Garage at Singapore Botanic Gardens', 'Singapore', 'Botanic Gardens', '50 Cluny Park Road, Singapore 257488', 'Located within Singapore''s first UNESCO World Heritage Site. Surrounded by tropical flora and fauna with rich colonial history.', 40, 150, 100, 280, 'per_person', 'https://www.nparks.gov.sg/sbg/', 'scrape'),
-- Rooftop & Garden Venues
('sg-025', '1-Arden', 'Singapore', 'CBD', '88 Market Street, #51-01, CapitaSpring, Singapore 048948', 'Serene rooftop garden perched 51 floors above the city featuring world''s highest food forest. Sustainable farm-to-table concepts with stunning views.', 50, 200, 150, 350, 'per_person', 'https://www.1-group.sg/brand/1-arden/', 'scrape'),
('sg-026', '1-Altitude Coast', 'Singapore', 'Sentosa', 'The Outpost Hotel, Level 5, Sentosa', 'Rooftop venue offering romantic ambience with panoramic seascapes from the highest vantage point on Sentosa. Indoor and outdoor spaces available.', 50, 250, 150, 350, 'per_person', 'https://www.1-group.sg/brand/1-altitude-coast/', 'scrape'),
('sg-027', 'MONTI at Fullerton Pavilion', 'Singapore', 'Marina Bay', '82 Collyer Quay, Fullerton Pavilion, Singapore 049327', 'Breathtaking waterfront venue within iconic sphere on Fullerton Bay. Rooftop outdoor ceremony with floor-to-ceiling glass windows overlooking Marina Bay skyline.', 30, 150, 150, 400, 'per_person', 'https://www.monti.sg/', 'scrape'),
('sg-028', 'Gardens by the Bay', 'Singapore', 'Marina Bay', '18 Marina Gardens Drive, Singapore 018953', 'Iconic floral venue with Supertrees, Flower Dome, and Cloud Forest. VIP garden cruisers available. Spectacular backdrop for once-in-a-lifetime celebrations.', 50, 30000, 100, 500, 'per_person', 'https://www.gardensbythebay.com.sg/', 'scrape'),
('sg-029', 'Mount Faber Peak', 'Singapore', 'Mount Faber', '109 Mount Faber Road, Singapore 099203', 'Atop Mount Faber with unbeatable panoramic views. Arbora Garden featuring Poland''s Bells of Happiness. Perfect for sunset ceremonies.', 40, 200, 120, 300, 'per_person', 'https://www.mountfaber.com.sg/', 'scrape'),
('sg-030', 'Open Farm Community', 'Singapore', 'Dempsey Hill', '130E Minden Road, Singapore 248819', 'Garden lawn at foot of Dempsey Hill near Singapore Botanical Gardens. Farm-to-table dining with organic produce in glasshouse setting.', 30, 110, 100, 250, 'per_person', 'https://www.openfarmcommunity.com/', 'scrape'),
('sg-031', 'Siri House', 'Singapore', 'Dempsey Hill', '8D Dempsey Road, Singapore 249672', 'Three versatile Art Deco spaces with colourful handwoven Jim Thompson silks. Pet-friendly with complimentary parking.', 40, 260, 100, 280, 'per_person', 'https://www.sirihouse.com/', 'scrape'),
('sg-032', 'Vineyard at HortPark', 'Singapore', 'HortPark', '33 Hyderabad Road, #02-02, HortPark, Singapore 119578', 'Countryside-inspired venue amid HortPark greenery. Rustic decor with sunset terrace overlooking pool along Southern Ridges.', 40, 146, 100, 250, 'per_person', 'https://www.vineyardhortpark.com.sg/', 'scrape'),
('sg-033', '1-Atico', 'Singapore', 'Orchard', '2 Orchard Turn, #55-01, ION Orchard, Singapore 238801', 'Located 55 floors atop ION Orchard with bird''s eye view of cityscape. Grand window walls and modernistic lighting.', 50, 252, 150, 380, 'per_person', 'https://www.1-group.sg/brand/1-atico/', 'scrape'),
('sg-034', '1-Alfaro', 'Singapore', 'Labrador', 'Level 34, Labrador Tower, Singapore 118479', '34-floor rooftop venue with unobstructed city skyline and sea views. Emilia-Romagna cuisine.', 40, 120, 130, 320, 'per_person', 'https://www.1-group.sg/brand/1-alfaro/', 'scrape'),
-- Other Unique Venues
('sg-035', 'Singapore Flyer', 'Singapore', 'Marina Bay', '30 Raffles Avenue, Singapore 039803', 'Exchange vows 165 meters above ground with in-flight hosts, champagne, and double-tiered wedding cake. Ultimate unique experience.', 2, 28, 200, 500, 'per_person', 'https://www.singaporeflyer.com/', 'scrape'),
('sg-036', 'Resorts World Sentosa', 'Sentosa', 'Sentosa', '8 Sentosa Gateway, Singapore 098269', 'Unique themed venues including Universal Studios Singapore New York Street and S.E.A. Aquarium with majestic sea creatures backdrop.', 50, 1000, 150, 400, 'per_person', 'https://www.rwsentosa.com/', 'scrape'),
('sg-037', 'Mandai Wildlife Reserve', 'Singapore', 'Mandai', '80 Mandai Lake Road, Singapore 729826', 'Adventure-themed weddings at Singapore Zoo with Forest Lodge package, animal appearances, and rainforest setting.', 50, 300, 120, 300, 'per_person', 'https://www.mandai.com/', 'scrape'),
('sg-038', 'Mandai Rainforest Resort by Banyan Tree', 'Singapore', 'Mandai', '60 Mandai Lake Road, Singapore 729979', 'Tropical paradise with rainforest and lake views. Pillarless ballroom with 4m-high ceilings inspired by bridal stinkhorn mushroom. Exclusive wildlife photography access.', 50, 300, 180, 400, 'per_person', 'https://www.banyantree.com/singapore/mandai-rainforest-resort', 'scrape'),
-- More Hotels
('sg-039', 'Grand Copthorne Waterfront Hotel', 'Singapore', 'Robertson Quay', '392 Havelock Road, Singapore 169663', 'Riverside destination with 850 sqm pillarless ballroom, two massive LED screens, and high-res video walls with laser projectors.', 50, 600, 130, 300, 'per_person', 'https://www.millenniumhotels.com/en/singapore/grand-copthorne-waterfront-hotel/', 'scrape'),
('sg-040', 'Copthorne King''s Hotel Singapore', 'Singapore', 'Havelock', '403 Havelock Road, Singapore 169632', 'All-inclusive packages with award-winning eight-course Teochew menu from Tien Court restaurant. Three themed packages available.', 100, 1400, 100, 250, 'per_person', 'https://www.millenniumhotels.com/en/singapore/copthorne-kings-hotel-singapore/', 'scrape'),
('sg-041', 'Holiday Inn Singapore Atrium', 'Singapore', 'Outram', '317 Outram Road, Singapore 169075', 'Newly refurbished ballrooms with custom-themed decor, laser projections, and live streaming capabilities. Affordable luxury.', 50, 400, 100, 220, 'per_person', 'https://www.ihg.com/holidayinn/hotels/us/en/singapore/sinhi/hoteldetail', 'scrape'),
('sg-042', 'Amara Singapore', 'Singapore', 'Tanjong Pagar', '165 Tanjong Pagar Road, Singapore 088539', 'Pillar-less ballroom with 38m aisle flanked by floor-to-ceiling LED screens. Heritage Peranakan cuisine with modern contemporary flavours.', 50, 400, 130, 300, 'per_person', 'https://singapore.amarahotels.com/', 'scrape'),
('sg-043', 'Paradox Singapore Merchant Court', 'Singapore', 'Clarke Quay', '20 Merchant Road, Singapore 058281', 'Riverside destination with magnificent floor-to-ceiling glass windows. Award-winning Cantonese cuisine from Jade restaurant.', 50, 460, 130, 320, 'per_person', 'https://www.paradoxhotels.com/singapore', 'scrape'),
('sg-044', 'Grand Park City Hall', 'Singapore', 'City Hall', '10 Coleman Street, Singapore 179809', 'Rooftop garden and restaurant ideal for garden-inspired weddings. Neoclassical design accommodating up to 120 guests.', 30, 120, 120, 280, 'per_person', 'https://www.parkhotelgroup.com/grand-park-city-hall', 'scrape'),
-- Restaurants & Unique Dining
('sg-045', 'Claudine Restaurant', 'Singapore', 'Dempsey Hill', '39C Harding Road, Singapore 249541', 'Restored colonial chapel with arches and stained-glass windows. French neo-brasserie cuisine in intimate setting.', 30, 72, 120, 300, 'per_person', 'https://claudinerestaurant.com/', 'scrape'),
('sg-046', 'The Dempsey Cookhouse and Bar', 'Singapore', 'Dempsey Hill', '17D Dempsey Road, Singapore 249676', 'Two-Michelin starred Chef Jean-Georges venue with open kitchen. Contemporary French fusion in colonial bungalow.', 50, 180, 150, 400, 'per_person', 'https://www.comodempsey.sg/', 'scrape'),
('sg-047', 'VUE Bar and Grill', 'Singapore', 'Marina Bay', '50 Collyer Quay, OUE Bayfront Level 19, Singapore 049321', 'Sophisticated rooftop venue with Marina Bay views. Premium steakhouse dining experience.', 30, 80, 150, 350, 'per_person', 'https://www.vue.com.sg/', 'scrape'),
('sg-048', 'Greenwood Fish Market', 'Sentosa', 'Sentosa Cove', '31 Ocean Way, #01-04/05, Quayside Isle, Singapore 098375', 'Waterfront Sentosa Cove venue with Western, Japanese, and Chinese seafood cuisine. Complimentary cruise around Southern Islands for newlyweds.', 50, 250, 100, 280, 'per_person', 'https://www.greenwoodfishmarket.com/', 'scrape'),
('sg-049', 'Alma Restaurant', 'Singapore', 'Orchard', '22 Scotts Road, Goodwood Park Hotel, Singapore 228221', 'Asian-influenced Modern-European cuisine within historic Goodwood Park Hotel. Casual atmosphere with lounge terrace.', 30, 100, 120, 300, 'per_person', 'https://www.alma.sg/', 'scrape'),
('sg-050', 'HAUS217', 'Singapore', 'Lavender', '217 Lavender Street, Singapore 338772', 'Wabi-Sabi inspired design with stone, wood, and textured glass elements. Natural light and modern aesthetic.', 40, 200, 100, 250, 'per_person', 'https://www.haus217.com.sg/', 'scrape')
ON CONFLICT (id) DO NOTHING;

-- Step 3: Insert Sentosa venues
INSERT INTO venues (id, name, region, subregion, address, description, capacity_min, capacity_max, price_min, price_max, price_unit, website, source) VALUES
('sg-051', 'Capella Singapore', 'Sentosa', 'The Knolls', '1 The Knolls, Sentosa Island, Singapore 098297', 'Singapore''s first and only circular ballroom with dramatic glass dome allowing natural sunlight. Three stunning solemnisation venues: Horizon''s Verge sunset patio, Poolside Bliss, and Garden of Dreams lawn.', 50, 400, 250, 600, 'per_person', 'https://www.capellahotels.com/en/capella-singapore', 'scrape'),
('sg-052', 'Shangri-La Rasa Sentosa', 'Sentosa', 'Siloso', '101 Siloso Road, Singapore 098970', 'Only beachfront resort in Singapore with panoramic South China Sea views. Venues include Horizon Pavilion, Siloso Ballroom, Rasa Lawn, and The Rasa Shore on Siloso Beach.', 50, 360, 178, 350, 'per_person', 'https://www.shangri-la.com/singapore/rasasentosaresort/', 'scrape'),
('sg-053', 'Sofitel Singapore Sentosa Resort & Spa', 'Sentosa', 'Bukit Manis', '2 Bukit Manis Road, Sentosa Island, Singapore 099891', 'French luxury blending with contemporary flair. Private cliff-top lawn overlooking South China Sea. The Cliff venue for intimate ceremonies with azure skies backdrop.', 20, 240, 178, 400, 'per_person', 'https://www.sofitel-singapore-sentosa.com/', 'scrape'),
('sg-054', 'W Singapore - Sentosa Cove', 'Sentosa', 'Sentosa Cove', '21 Ocean Way, Singapore 098374', 'Tropical lawn ceremony space with Great Room (720 sqm) featuring crystal lighting and chandeliers. WOOBAR for post-reception cocktails.', 50, 480, 165, 380, 'per_person', 'https://www.marriott.com/en-us/hotels/sinwh-w-singapore-sentosa-cove/', 'scrape'),
('sg-055', 'The Barracks Hotel Sentosa', 'Sentosa', 'Palawan Ridge', '2 Gunner Lane, Palawan Ridge, Sentosa Island, Singapore 099567', 'Heritage building backdrop with 500 sqm Barracks Lawn and glasshouse. Over 1200 sqm of indoor and outdoor spaces for sophisticated island destination wedding.', 50, 260, 150, 350, 'per_person', 'https://www.thebarrackshotel.com.sg/', 'scrape'),
('sg-056', 'The Outpost Hotel Sentosa', 'Sentosa', 'Palawan Ridge', '10 Artillery Avenue, Palawan Ridge, Sentosa Island, Singapore 099951', 'Heritage events centre with high ceilings and timber beams. Hilltop venue overlooking Singapore Strait with garden ceremony setting and Heritage Courtyard.', 50, 160, 119, 280, 'per_person', 'https://www.theoutposthotel.com.sg/', 'scrape'),
('sg-057', 'Oasia Resort Sentosa', 'Sentosa', 'Palawan Ridge', '23 Beach View Road, Palawan Ridge, Sentosa Island, Singapore 098673', 'High ceilings with floor-to-ceiling glass panels at The Aloes venue. Spa treatment included in wedding packages.', 50, 140, 120, 280, 'per_person', 'https://www.oasiahotels.com/en/singapore/oasia-resort-sentosa/', 'scrape'),
('sg-058', 'Amara Sanctuary Resort Sentosa', 'Sentosa', 'Larkhill Road', '1 Larkhill Road, Sentosa, Singapore 099394', 'Private and serene venue with beautiful glass pavilion and full nature views. Poolside options for cool wedding settings in lush surroundings.', 40, 200, 150, 350, 'per_person', 'https://www.amarasanctuary.com/', 'scrape'),
('sg-059', 'Oneº15 Marina Sentosa Cove', 'Sentosa', 'Sentosa Cove', '11 Cove Drive, #01-01, Sentosa Cove, Singapore 098497', 'Exclusive luxury sailing club with pillarless ballroom and yacht chartering options. Celebrate on the seas with stunning marina views.', 50, 360, 150, 380, 'per_person', 'https://www.one15marina.com/', 'scrape'),
('sg-060', 'Sky Garden Sentosa', 'Sentosa', 'Siloso Point', '80 Siloso Road, #02-02, Singapore 098969', 'Voted Best Wedding Solemnisation Venue with a View. Outdoor area with fine greenery plus fully air-conditioned indoor space with glass ceilings.', 30, 200, 120, 300, 'per_person', 'https://skygardensentosa.com/', 'scrape'),
('sg-061', 'Sentosa Golf Club', 'Sentosa', 'Bukit Manis', '27 Bukit Manis Road, Singapore 099892', 'Sentosa Pavilion rooftop overlooking Serapong course, South Garden verandah with sea views, and Grand Ballroom options.', 50, 300, 138, 320, 'per_person', 'https://www.sentosagolf.com/', 'scrape'),
('sg-062', 'Panamericana at Sentosa Golf Club', 'Sentosa', 'Bukit Manis', '27 Bukit Manis Road, Sentosa Golf Club, Singapore 099892', '7,000 sqft indoor space with natural daylight. Verandah with sea views and golf course surroundings, plus manicured lawn overlooking ocean.', 50, 300, 150, 350, 'per_person', 'https://www.panamericana.sg/', 'scrape'),
('sg-063', 'Tanjong Beach Club', 'Sentosa', 'Tanjong Beach', '120 Tanjong Beach Walk, Singapore 098942', 'Beachfront location with coastal-inspired menu. Multiple indoor and outdoor spaces for relaxed beach weddings.', 50, 200, 100, 280, 'per_person', 'https://www.tanjongbeachclub.com/', 'scrape'),
('sg-064', '1-Flowerhill', 'Sentosa', 'Artillery Avenue', 'Artillery Avenue, Sentosa Island, Singapore', 'Newest heritage wedding venue on Sentosa in century-old building. Charming colonial arches, green-and-white balustrades, and spiral staircases.', 40, 150, 150, 350, 'per_person', 'https://www.1-group.sg/', 'scrape')
ON CONFLICT (id) DO NOTHING;

-- Step 4: Get venue type IDs
-- Note: Run SELECT * FROM venue_types; to verify these IDs match your database

-- Step 5: Link venue types (using common type IDs - adjust as needed based on your venue_types table)
-- Common types: Hotel/Resort, Restaurant, Garden/Outdoor, Historic/Heritage, Ballroom, Rooftop, Beach

-- This assumes these venue_type IDs exist in your database:
-- Check with: SELECT id, name FROM venue_types;

-- Link venue types for Singapore venues
INSERT INTO venue_venue_types (venue_id, venue_type_id)
SELECT v.id, vt.id
FROM venues v
CROSS JOIN venue_types vt
WHERE v.id LIKE 'sg-%'
AND (
  -- Hotels get Hotel/Resort type
  (v.name LIKE '%Hotel%' OR v.name LIKE '%Marriott%' OR v.name LIKE '%Ritz%' OR v.name LIKE '%Regis%' OR v.name LIKE '%Shangri%' OR v.name LIKE '%Four Seasons%' OR v.name LIKE '%Hilton%' OR v.name LIKE '%Conrad%' OR v.name LIKE '%Mandarin%' OR v.name LIKE '%Capella%' OR v.name LIKE '%Sofitel%' OR v.name LIKE '%Raffles%' OR v.name LIKE '%Fullerton%' OR v.name LIKE '%InterContinental%' OR v.name LIKE '%Copthorne%' OR v.name LIKE '%Holiday Inn%' OR v.name LIKE '%Amara%' OR v.name LIKE '%EDITION%' OR v.name LIKE '%Andaz%' OR v.name LIKE '%Pan Pacific%' OR v.name LIKE '%PARKROYAL%' OR v.name LIKE '%Oasia%' OR v.name LIKE '%Barracks%' OR v.name LIKE '%Outpost%' OR v.name LIKE '%Resort%') AND vt.name = 'Hotel/Resort'
  -- Gardens
  OR (v.name LIKE '%Garden%' OR v.name LIKE '%Botanic%' OR v.name LIKE '%HortPark%' OR v.name LIKE '%Vineyard%' OR v.name LIKE '%Farm%' OR v.name LIKE '%Mansion%') AND vt.name = 'Garden/Outdoor'
  -- Heritage
  OR (v.name LIKE '%Mansion%' OR v.name LIKE '%CHIJMES%' OR v.name LIKE '%Burkill%' OR v.name LIKE '%Wheeler%' OR v.name LIKE '%Rochester%' OR v.name LIKE '%Barracks%' OR v.name LIKE '%Flowerhill%' OR v.name LIKE '%Raffles%' OR v.name LIKE '%Fullerton%') AND vt.name = 'Historic/Heritage'
  -- Rooftop
  OR (v.name LIKE '%1-Arden%' OR v.name LIKE '%1-Altitude%' OR v.name LIKE '%1-Atico%' OR v.name LIKE '%1-Alfaro%' OR v.name LIKE '%MONTI%' OR v.name LIKE '%VUE%' OR v.name LIKE '%Sky Garden%' OR v.name LIKE '%Mount Faber%') AND vt.name = 'Rooftop'
  -- Restaurant
  OR (v.name LIKE '%Restaurant%' OR v.name LIKE '%Claudine%' OR v.name LIKE '%Cookhouse%' OR v.name LIKE '%Alma%' OR v.name LIKE '%Fish Market%' OR v.name LIKE '%Panamericana%' OR v.name LIKE '%Beach Club%') AND vt.name = 'Restaurant'
  -- Beach
  OR (v.name LIKE '%Beach%' OR v.name LIKE '%Rasa Sentosa%' OR v.name LIKE '%Tanjong%') AND vt.name = 'Beach'
  -- Unique venues
  OR (v.name LIKE '%Flyer%' OR v.name LIKE '%Zoo%' OR v.name LIKE '%Wildlife%' OR v.name LIKE '%Rainforest%' OR v.name LIKE '%Universal%' OR v.name LIKE '%Aquarium%') AND vt.name = 'Unique/Other'
)
ON CONFLICT DO NOTHING;

-- Step 6: Link settings (Indoor/Outdoor)
INSERT INTO venue_settings (venue_id, setting)
SELECT id, 'Indoor' FROM venues WHERE id LIKE 'sg-%'
ON CONFLICT DO NOTHING;

INSERT INTO venue_settings (venue_id, setting)
SELECT id, 'Outdoor' FROM venues
WHERE id LIKE 'sg-%'
AND (
  name LIKE '%Garden%' OR name LIKE '%Outdoor%' OR name LIKE '%Beach%' OR name LIKE '%Lawn%'
  OR name LIKE '%Mansion%' OR name LIKE '%Rooftop%' OR name LIKE '%Farm%' OR name LIKE '%HortPark%'
  OR name LIKE '%Rasa Sentosa%' OR name LIKE '%Capella%' OR name LIKE '%Sofitel%' OR name LIKE '%Barracks%'
  OR name LIKE '%1-Arden%' OR name LIKE '%1-Altitude%' OR name LIKE '%MONTI%' OR name LIKE '%VUE%'
  OR name LIKE '%Sky Garden%' OR name LIKE '%Mount Faber%' OR name LIKE '%Vineyard%' OR name LIKE '%Tanjong%'
  OR name LIKE '%Flowerhill%' OR name LIKE '%Shangri-La%' OR name LIKE '%Four Seasons%' OR name LIKE '%Sentosa Golf%'
)
ON CONFLICT DO NOTHING;

-- Verify insertion
SELECT COUNT(*) as total_singapore_venues FROM venues WHERE id LIKE 'sg-%';
SELECT region, COUNT(*) as venue_count FROM venues WHERE id LIKE 'sg-%' GROUP BY region;
