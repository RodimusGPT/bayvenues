INSERT INTO venues (
    id, name, region, subregion, address, description,
    capacity_min, capacity_max, price_min, price_max, price_unit,
    website, phone, google_maps_url, location,
    photos, videos, reviews, header_image, header_images,
    youtube_search, google_place_id, google_rating, google_reviews_count,
    google_formatted_address, google_phone, google_website, google_business_status,
    google_types, google_opening_hours, google_photos, google_reviews,
    google_wheelchair_accessible, source
  ) VALUES (
    'fr-046', 'Mas d''Arvieux', 'Provence', 'Bouches-du-Rhone', 'Near Saint-Remy-de-Provence, France', 'A 16th-century Provencal estate near Saint-Remy offering historic stone architecture, lavender fields, and flexible spaces for refined celebrations. Combines authentic Provencal character with elegant wedding facilities.',
    30, 150, 10000, 30000, 'EUR',
    NULL, NULL, 'https://maps.google.com/?cid=14410809806674252808', ST_SetSRID(ST_MakePoint(4.723021, 43.83261), 4326)::geography,
    '{"instagram":null,"google":"https://www.google.com/search?q=Mas%20d''Arvieux%20Provence%20wedding%20venue&tbm=isch"}'::jsonb, NULL, NULL, '{"url":"https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop","source":"fallback"}'::jsonb, '[{"url":"https://image.bridebook.com/weddingsuppliers/venue/fr5gPAAkYz/fr5gPAAkYz_photo1.jpg/dpr=2,fit=cover,g=face,w=460,h=310","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQzKlGWXR3SSoVmfekwQ8aD3ANjOOqjnl2eLTntwyEaIb_gZ0&s","source":"google"},{"url":"https://www.frenchweddingstyle.com/wp-content/uploads/2025/08/MariagePaulineGuillaume-00038-_DSC19762.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg0HOQzryPwZ4xp9df46N6Ry7igwgPJz_D7aTuZzfftocMV_Cm&s","source":"google"},{"url":"https://image.bridebook.com/weddingsuppliers/venue/fr5gPAAkYz/fr5gPAAkYz_photo6.jpg/dpr=2,fit=cover,g=face,w=460,h=310","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAs48M2A1fG16JBTS_Qks8MiVkiVjAk85EiROxjWe_ZTNb5tY&s","source":"google"},{"url":"https://image.bridebook.com/weddingsuppliers/venue/fr5gPAAkYz/fr5gPAAkYz_photo4.jpeg/dpr=2,fit=cover,g=face,w=460,h=310","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpFy4UuDznnbEhm1reoQXf6ogK--3BlexfHnEmWMJnBXbon50a&s","source":"google"},{"url":"https://image.bridebook.com/weddingsuppliers/venue/fr5gPAAkYz/b40fceb6-bb6b-4d04-b85c-3e05c626f765.jpg/dpr=2,fit=cover,g=face,w=460,h=310","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToHOvBFcAYQ2q_-de5x73_hSGJoxrH9FPk3bebhk7NDUTcawrp&s","source":"google"}]'::jsonb,
    'https://www.youtube.com/results?search_query=Mas%20d''Arvieux%20Provence%20wedding', 'ChIJYXB3WlndtRIRCNSI3Cp7_cc', NULL, 0,
    'Mas d''Arvieux, 13150 Tarascon, France', NULL, NULL, NULL,
    '["colloquial_area","political"]'::jsonb, NULL, '[]'::jsonb, '[]'::jsonb,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;