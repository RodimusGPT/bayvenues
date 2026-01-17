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
    'mon-018', 'California Seltzer Co.', 'Monterey', 'Pacific Grove', 'Pacific Grove, Monterey County', 'Wedding venue in Pacific Grove, Monterey County. Starting packages from $2,731.',
    45, 150, 2731, 6828, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;