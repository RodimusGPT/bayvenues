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
    'nb-027', 'Sierra Cider', 'North Bay', 'Mariposa', 'Mariposa, Mariposa County', 'Wedding venue in Mariposa, Mariposa County. Starting packages from $2,000.',
    90, 300, 2000, 5000, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;