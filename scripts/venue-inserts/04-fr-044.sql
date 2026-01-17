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
    'fr-044', 'Clos Saint Esteve', 'Provence', 'Vaucluse', 'Le Thor, Vaucluse, France', 'A charming bed and breakfast property in Provence offering an intimate setting for weddings and special events. Features rustic Provencal charm with modern touches and a beautiful countryside location.',
    20, 100, 8000, 25000, 'EUR',
    'https://www.clossaintesteve.com', NULL, 'https://maps.google.com/?cid=1889808265471611173', ST_SetSRID(ST_MakePoint(4.983504, 43.909098), 4326)::geography,
    '{"instagram":null,"google":"https://www.google.com/search?q=Clos%20Saint%20Esteve%20Provence%20wedding%20venue&tbm=isch"}'::jsonb, NULL, NULL, '{"url":"https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop","source":"fallback"}'::jsonb, '[{"url":"http://zenfilmworks.net/wp-content/uploads/sites/5619/2020/01/highlights.00_02_38_03.Still006.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxahyrXswmvHU7iodeH2Hi6-UktYKrVzsrpPfcFBYP85MCb-6c&s","source":"google"},{"url":"https://clairemorrisphotography.com/wp-content/uploads/sites/3669/2019/10/Provence-wedding-Clos-saint-esteve_057.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrsN4MX7RHse1-dg4uxh32hJrhcx-seJclpgsQnZ0deGN1k-hK&s","source":"google"},{"url":"https://clairemorrisphotography.com/wp-content/uploads/sites/3669/2019/10/Provence-wedding-Clos-saint-esteve_004.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC3sUZJ7zGwpYh7Oh3wu_wYx5FT5srJ4hL58fiOl1P8gPJgyo&s","source":"google"},{"url":"https://clairemorrisphotography.com/wp-content/uploads/sites/3669/2019/10/Provence-wedding-Clos-saint-esteve_055.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgtCKRnrQ01RmQPiTjCTiRfqcgcMJWLKFp5WdBf8V6uMY0_HQK&s","source":"google"},{"url":"https://clairemorrisphotography.com/wp-content/uploads/sites/3669/2019/10/Provence-wedding-Clos-saint-esteve_001.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuLjLo8cr5MbmWBJxiJqGa8jEekeqkzctGC1nOig2MQa0XaIo&s","source":"google"}]'::jsonb,
    'https://www.youtube.com/results?search_query=Clos%20Saint%20Esteve%20Provence%20wedding', 'ChIJ-6T9Can2tRIRJVEI1ZryORo', NULL, 0,
    'Le Clos Saint-Estève, 84250 Le Thor, France', NULL, NULL, NULL,
    '["colloquial_area","political"]'::jsonb, NULL, '[]'::jsonb, '[]'::jsonb,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;