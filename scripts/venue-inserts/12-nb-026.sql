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
    'nb-026', 'North Tahoe Event Center', 'North Bay', 'Kings Beach', 'Kings Beach, Placer County', 'Wedding venue in Kings Beach, Placer County. Starting packages from $4,950.',
    120, 400, 4950, 12375, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;