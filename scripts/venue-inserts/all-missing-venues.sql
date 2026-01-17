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
    'fr-040', 'Chateau de Mairy', 'Champagne', 'Marne', 'Mairy, Champagne, France', 'Hidden amidst the lush landscapes of Champagne, offering rustic charm combined with French elegance. Features the informal and relaxed atmosphere of a country house, perfect for a romantic, champagne-filled wedding weekend.',
    20, 80, 15000, 40000, 'EUR',
    'https://www.chateaudemairy.com', NULL, 'https://maps.google.com/?cid=11421612234709114598', ST_SetSRID(ST_MakePoint(4.4175767, 48.8827345), 4326)::geography,
    '{"instagram":null,"google":"https://www.google.com/search?q=Chateau%20de%20Mairy%20Champagne%20wedding%20venue&tbm=isch"}'::jsonb, NULL, NULL, '{"url":"https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop","source":"fallback"}'::jsonb, '[{"url":"https://static-cdn5-2.vigbo.tech/u5522/5426/blog/6037883/5601836/73922507/1000-paris_photographer_daria_lorman-c94bfddf06075bd14a4e1989e9499db3.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqNAJGOIV9zE_GLB9VbESmkXbrZX5L9dMqvc-loHQRoZZNroxo&s","source":"google"},{"url":"https://ameliasoegijono.com/wp-content/uploads/sites/9850/2022/10/frenchchateau_frenchwedding_parisvenue_weddingvenue_chateaudemairy_chateauwedding_fineartwedding_ameliasoegijonophotography_romanticwedding_destinationwedding_weddinglocation_0210-683x1024.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBBVT2r3SMflmXS9L2_seMHudg0HcL0sHJzAldy3-BiuYSl9k&s","source":"google"},{"url":"https://media-cdn.tripadvisor.com/media/photo-s/04/49/59/a4/domaine-du-chateau-de.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVcH4wGauLTDyBdfn0P270uTqWpBGwzKgw9e8YjFtt1OpksKYe&s","source":"google"},{"url":"https://escapeinhertravels.com/wp-content/uploads/2020/10/74429-2-min.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYZa2HIIazXVFWlh3n53D0-kMN7xs3fZbcxgmwc0Y6AyVki-4&s","source":"google"},{"url":"https://www.janisratnieks.com/wp-content/uploads/2025/01/Chalons-en-Champagne-1.webp","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4I2oZAFO5PhGMc_ObOobCBGuEskIgV8t0BjWrrWfJ77HYYPM&s","source":"google"}]'::jsonb,
    'https://www.youtube.com/results?search_query=Chateau%20de%20Mairy%20Champagne%20wedding', 'ChIJx0Z3oZjm60cR5p4XLNC3gZ4', 4.7, 81,
    'Domaine du Château de Mairy, 51240 Mairy-sur-Marne, France', '06 75 20 13 48', 'http://www.chateaudemairy.com/', 'OPERATIONAL',
    '["establishment","point_of_interest"]'::jsonb, '{"weekday_text":["Monday: Open 24 hours","Tuesday: Open 24 hours","Wednesday: Open 24 hours","Thursday: Open 24 hours","Friday: Open 24 hours","Saturday: Open 24 hours","Sunday: Open 24 hours"],"open_now":true}'::jsonb, '[{"photo_reference":"AcnlKN3CLzCzGskeVpd2uavIEmUA46MhsRrxc-k9HcXie3CcUwZNrEHKI83m7adoKfRNcZPnwJR2v9Ph6Fq-Fx-hOeCn6X5lfied79uf9oNJDZn5xZJTLDQ-EgnS3l3QkWhV9h2BXQ60E7z35dqkFxm_V0fHiDN1_T11xY_jIRBPGIc18V0lpHz6vu82wbU79TaguCsc2ZwUQtyPZlBIN4yVzoyH3077h-nL6LZTdR1z-hbhhb693_1FIZAio8JPcYmRqz6HwmHyp9EhyS9lEGrP_m9RlodGpkokrEreNGfx2nlhgtYn6a45smTI_WpGVfkPECNoMHGHc6Y0H2FYdKEmz3PlKpZke7h3arCgzXf6wBXg4kZVNIUX8L40J7BLa4RHXNJbdAMgAN2b4sLIa-qsbnFPq67U2bsHoBuKe5ex_L-88Ft_dNHhMnI5-bHcfABA","width":4096,"height":3072,"attributions":["<a href=\"https://maps.google.com/maps/contrib/116833191103315456222\">Familie Nak</a>"]},{"photo_reference":"AcnlKN3Jl9As6D6dZmBL61_MPTBxKXkhB7h0ynSdZvekEf6zrBtUukzqyyBlXYv8Xn4bx1VEIRRCz06NZQcJiNslBy-N9wATNHrY3P1TZGiwpBnhj3NV_XaAPhb2hiD-B6pCf0HJIvGevm9Vs6W_XmGKlPHA3Qa56yt07rqbSUQZTA6Z5qZwmbNAYRfjryeyG--qKE72-ShDbkKrSPElHPW5h9gJ6dVXKnRB7MmORbZFm3uEgYA5-N1UWjrm_gtQxIQdutZxve_nKUBnMRKRmi5w7yD5Kt76sUElpE4uN1Xyt-Cfxj_GlE7nbpiCFH1Z_yxpjLQ4qyWQpddNjNNoyLfGG28Lg1S1gZg4MTuaGD8_KGiyCLBn87kLevUyE-53FAD80STXU2bYPw0wlm_x0-7CQJI-qAXkyimVvGmvMiODhUD-fPBQ","width":2048,"height":1536,"attributions":["<a href=\"https://maps.google.com/maps/contrib/103857722874129411052\">Dana Aftab</a>"]},{"photo_reference":"AcnlKN3xmFhZSu4mE9sJRkoyolFw9wT6dSClBN5nZ0Z-DoT093H-QoP1ocvwWZCWD2cwPYwO-yv7pNmTlVlCWBJF5xAe1ftEdHqn7Eqt7BeTLGjxEk_tAsfhbWSp5cMG34ftFavTz9kY9zBVjCSRCkwBHplz4qFOhXw1vMUxncJYAL9YIbUkvVS0jKu0SQ64ouY1CTL-cLvTaqxYwoLN9pnlQyvVhYCEDE7z58HUNJ_vWls8_TBodF3XzMheJ5ehE3ufd2S8KDy2xc3_Uoo12H_cmgzQTXGTBThgsOWx6p3fp5QpjBuqCuCDhqdqdR8ouol_d7GPVWKRbNp8aLsn09SLbLhHruSs00qMp_Vl56mvSHlaxR8EBxIUcb6zts7luCmpYn9eVdVVP9BpyexZmHr-5ot8HLswYiVGlgXXWYyOs7xjS9XL","width":2048,"height":1366,"attributions":["<a href=\"https://maps.google.com/maps/contrib/104559514344668600999\">Ronny Wertelaers</a>"]},{"photo_reference":"AcnlKN2wm-2GkXnnbm8FOiSb_-JfapWBdurnVoOx7fGBH8WT2r0dhXuWOghuhDdKgrIMjDYOCUYmb0UoXk2-O4ljvcA4p9ZwG3Aj9M1axo1NhMfcZuoNKKz0QDpBH7F7g8kLMOIdJT_0Z3nJdnm3SPm0yTFdSk9IJy13T6ygwhCndPP4qNAM-8EA5JmYiAGn4zvT2szMK7TlWdX_uX4dpubCnuJt3i-7ACBaD946jJ6EkAlyxT3yoJFGkeCLnbmatkWC9X3XxpZEPCHWlqxSTzNcnlpFwtAJVyFIUIkvXa0vBKC6NGu12Fkypn9gni6rKZzF0oDGR5CRf50_0Sxq-FQ_ABbDmOEBk4jo8DnQTqEtMo2TYOfiTCSkltfbbt-8B3vsCfQ87Rclf72GmqJhreTbKYrzuONFEjKyTkLWuUAiJmpMPA","width":3000,"height":4000,"attributions":["<a href=\"https://maps.google.com/maps/contrib/110115365206610438069\">fernand van aesch</a>"]},{"photo_reference":"AcnlKN3PgHtbTRPIenAkFv0cjk1yb7LPJlarjfxS8ha35aR-zV6s1HTTlBrjUEv_gKJmZ6pEspGq74P7AvvTfwVhhSxMusan7dhm6LW1PaMaOUqlnJ4mcfr2qv7L1Y0A0pbVDTWyGtUbkj343w-9Fm0zc3W7LGkukcbvpjnoajzV_NnD-EVE6FeW96XVJmyUoMOEjaIjFsL5DL6XWL0EXwhKViZ8VeivuNkYJhwl474s5RbE5YY_TsEpWyu_BAIqkMaD9WaPlqkSLOvMKzvoe1Fwd0HHq7dAICEjhAAMdMGOGAuMgP_rqjslzgLAhcJLOyI3ul1RyvpSUNI1XqtTJU4XnIKi_EfCqdhW3BX_iRaX52rcq1Z8Q4jWfJovRJUXzlyNWXHefNUIE8WD9h6UVFWI0TkVKC8d-zjGxb5exbbV3kz9vW0o","width":3024,"height":4032,"attributions":["<a href=\"https://maps.google.com/maps/contrib/100552800497930671223\">Nicolas Aubry</a>"]},{"photo_reference":"AcnlKN0yhaFVYfHQ_ZGlGUll5zw1OIiLLv65wcuWZGH_q2Sj4QBSNAYmxRRF9kmehjQ7detPe1QsND710ez4HMaZevfLr8B_8Qliq5fICYK1d7cqHRbXiuPxCmhohyYkibTElYbJ4lkTgu5t-CnIHlqF-_g--QSJHtFZXkxOEO7CGyOCOFi0BOlnBO4F42EITfAQraDB1MlWrxqYyVBJHpm5LNOdUXyI9UNIpVmL5qDySOU91zBboXXpoC6JCLwnRhqX8Rdgk-1zBkjuAPZbiTMyjfIJrjZDo1sVC9Rla9nSWT0X49AgAmT-s1vL2pNmlZVsdOOXxdZ-S6WpZJw-kUdd4M9LDUKAqaVDGicx7k3PUIXC-7YijMsmN8h6ZbtRccIBPzR2Zmua_zXlEu47LrsIUb9jOApS9DbdWJfxHudmVoxGD4U","width":4800,"height":2700,"attributions":["<a href=\"https://maps.google.com/maps/contrib/109320839637034079082\">Curpan Mihai Gabriel</a>"]},{"photo_reference":"AcnlKN3bO7xUS7UAorzbCC3feGYtIptNmoaHpr4oiwaI-_IaGs37png4lH0yclbYKnbmMIUsMIz6YgxI1Zn6KNQ2z640R2YQyeTEhNNf2pzj8J_SdPDpMz6ik-uyB_vSs5P5qnb8l_ddvMDvo37_rIw2XOTT7K1PSsiLlygAsreFLwitvt1zhkKOlMNSWmsLWXPeoFO4iaxNG8ppj9WXZxH5wV6kuABi4h-V-0tAj4li7GHR-pf5vraNCbrJWjxumgOfOirIrf3pBWxGpgDhQmtdWOOl2hO4M2dtffSuk9TSrnr66skzcym2tdyGSzfATsUY1j0t0TVgoR2b88LuGu_kJ2fEQ3MtanzZ1wKW1rM9g_bQrCk8cjYmHdLsDeT7qWm4_CHUVEU_jfx2Lhm6A7Oy6-M8HOwio3lpRsiDzTmISoCh-Q","width":2268,"height":4032,"attributions":["<a href=\"https://maps.google.com/maps/contrib/100465877801095749724\">edouard schwebel</a>"]},{"photo_reference":"AcnlKN3AS_mB4N_3KpgzGnrro9c7J3srtOHAkF0PsYtgELp37NDTK7d4xYc5MLR-Xw7S-2hH4U3h41mQ3WdFwpTRcIVadIysrxxz4mTHWKlTMmoRJ2WltHbWjKFZtkf4DTu2Rqf3pyrLspS5mmTkqa-uMT6KupUz1sqRsgKZbTN7zs5RmuFryNLxThQ7pPxzQmOqM3Q2X2_XuUyBtcKIbH5vbtfppupDqeiqj_D6FObE5tq2ZiFq_Q0vuNfOqi9zw1up-WqqM3RQ2IHsd-3RGUzda593y3DsppA4fViOmNhsuMDBFx7ExzWQTdbgySJ4SBmWKs2TX6MlYX0GCkt-Lfz8rntTboLUbZSJxbflVitg-sozlm7XnnhA5VQVjyUyNPNuVcxEriQV0BbjNpeZqI6dM3Bq9dWrS71_4Q3fEIcMLW0","width":4032,"height":3024,"attributions":["<a href=\"https://maps.google.com/maps/contrib/113815558700052975729\">Diana and Chris Orton</a>"]},{"photo_reference":"AcnlKN0XjI1VbrMxN0OjIzzvwc2xG0nevziq2Qx9wPTBzA06QI_V9q7pnXagPLO_ost5bV5AtKw7GkNxDJzOrzNh2T_BfGUQ84JM0ODdn0U0P99GduvjmeizHSmeQIsuT3Tz3oXoQE-fpE_kVP3JdtC0h97aeX0XolSZq1sBguXPooKgV2JrD9NLHGeeDnYtfbsZGGvrXKgFvJBiZTf8IM7i-xz1ayVg8eLDXszcv003wEB7_surEh_DwyJgB539oxS_go3YUtJLGO_72ALPLymFaneAgA4CmerE3dFWWTgcQuGSaPwcYewI13_1fmH0U9MOxq5473NiHnb4fK4SAMvwoBHGSV2XynecgV35oLTvnRbfZe0DiVS-dqzurrMj5Ti1w_tH5IhqNGZ-vOuVbJ7S4Q0C3r7xKYmFRWtPMEAnkh_XqpFI","width":2048,"height":1366,"attributions":["<a href=\"https://maps.google.com/maps/contrib/104559514344668600999\">Ronny Wertelaers</a>"]},{"photo_reference":"AcnlKN036Z025t5UW5AbAXopY18Ifj5kEVRbd8cFoMRPacp88eydSp5HYf1nORJL5zWT_qecxcyxAPp8mtON8SUqJ6GVfe2ZfciC4czUKE0nYA8vEPZ_fJ9Xrx5EhxEVNBaCBwZ5xhKFv9VZ63Ju3-abG6TiFYJhPbwPro313RohU71nBNI6d1YHIMGBDlIN0QBVBJ-wo93TQ-B0-e0k6EwjwIdpQdmhzANYRjg7v6deMe-OE6xKKchGMhzgNkBcw2MGGXznKRW2bWkdTQ0jJRRXbmibq7gew4HULhYzjw4g3HNIct_E3SB9L3Fc7ZS7-kvd5HnWg_8uOSQh_yzuIFibj4UHzfhcDf_ET_rQTvF9fU8wUhhI1PkHSIy_L6F21wsqnxK3rh5OZs_R9HrbKtUJfHPma0-yyk848g7p36NIwhkNWQ","width":4032,"height":2268,"attributions":["<a href=\"https://maps.google.com/maps/contrib/107832609446412397520\">Johan Jordaan</a>"]}]'::jsonb, '[{"author":"Susanne Johnson","rating":5,"text":"We just had the most fabulous long weekend at the Chateau de Mairy! The building is stunning and great for a luxurious party (there were 20 of us). The meals were absolutely STUNNING- I don’t remember eating this well (possibly ever!). The most delicious vegetarian meals - better than in most restaurants! The staff are wonderful- so welcoming, friendly and helpful - nothing was too much effort! The grounds are beautiful - there are lovely walks from the grounds to lakes and forest. Reims (short drive away) is well worth a visit - Chagall stained glass windows in the cathedral and an Art Deco covered market are must-sees. Nearby Chalons is a lovely small town with beautiful churches and nice shops/restaurant. This is a fabulous venue - we will be back!","time":"8 months ago"},{"author":"Diana and Chris Orton","rating":5,"text":"What a great weekend en Champagne - we were invited by l friends to celebrate a birthday. Very peaceful location with plenty of options for walking from the door. The house is like a film set, the food was consistently delicious and plentiful, host Steve et al could not have been more helpful or hospitable.","time":"a year ago"},{"author":"Christian Bruno - Yidaki Studio","rating":5,"text":"As wedding photographers we can say that this venue is an excellent pick! The villa it''s so beautiful and elegant. The interiors are nostalgic and luxurious. The gardens are wide so that there''s enough room for guests and areas for wedding pictures. You''ll definitely feel the vintage vibes in this venue. Super recommended!! 100!!","time":"a year ago"},{"author":"Melissa Noucas","rating":5,"text":"Our stay at Château de Mairy for our wedding weekend was absolutely perfect! We worked with Steven from the beginning, as well as Kris and Annemieke, who were on-site (but in a separate building on the property) and prepared the most delicious meals for all of our wedding celebrations. They helped make sure we and our guests were comfortable throughout our long weekend stay, and also were great to communicate with prior to the wedding. They understood exactly what we were looking for and created our perfect wedding set-up based on just a few photos. The beds were comfortable, and we received a set of clean linens to use for the weekend. The chateau itself is very authentic and beautifully decorated. We definitely recommend renting a car (vs. taking public transportation) to be able to explore the surrounding areas and get to the local grocery store. There is a train that runs adjacent to the property but it didn''t bother us at all. Overall, an excellent stay and we hope to visit again in the future!!","time":"8 years ago"},{"author":"Emily S","rating":5,"text":"Magic magic magic. One of the best experiences of my life, to have spent a week in this magical place with our loved ones. The weather was perfect, our tower room was perfection.","time":"4 years ago"}]'::jsonb,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'fr-041', 'Chateau Mathilde', 'Normandy', 'Eure', 'Normandy, France', 'A striking chateau with red brickwork, ornate design, and space to sleep up to 45 guests. Beautifully restored and popular for smaller Normandy weddings. Combines fairy-tale architecture with comfortable modern amenities.',
    30, 100, 10000, 25000, 'EUR',
    NULL, NULL, 'https://maps.google.com/?cid=14577497453616706863', ST_SetSRID(ST_MakePoint(0.7865626, 49.2743321), 4326)::geography,
    '{"instagram":null,"google":"https://www.google.com/search?q=Chateau%20Mathilde%20Normandy%20wedding%20venue&tbm=isch"}'::jsonb, NULL, NULL, '{"url":"https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop","source":"fallback"}'::jsonb, '[{"url":"https://mlmtblstaqh0.i.optimole.com/w:1920/h:960/q:mauto/f:best/https://chateaubeeselection.com/wp-content/uploads/2025/01/8-french-normandy-wedding-chateau.webp","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6Ri_5EK4le8vfxWklTbDTRBr9Sb5H9UI9_731QmPEvqmCEQr2&s","source":"google"},{"url":"https://lookaside.fbsbx.com/lookaside/crawler/media/?media_id=4680858438699196","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd-deeEcWQoHI9S22gzGruD39lgMFmhqcPaRd3C02CavNKiYGV&s","source":"google"},{"url":"https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3388929058988507557","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-Hvp9KOBghyjLHVbwmKxfJ-aRVQ0EDsqmAmJBHBhr-Ou1QDX4&s","source":"google"},{"url":"https://mlmtblstaqh0.i.optimole.com/w:1920/h:960/q:mauto/f:best/https://chateaubeeselection.com/wp-content/uploads/2025/01/4-french-normandy-wedding-chateau.webp","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKKFHF3nwc35tBmpB9EhsTiwAHzq73FAqB2rxalydPVX6J4dp3&s","source":"google"},{"url":"https://lookaside.instagram.com/seo/google_widget/crawler/?media_id=3388929095311097175","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4XR1vvqE5LcJfEKgf0ovUOMIZ0HWs-oM4sq-OukNF_-FUrbOw&s","source":"google"}]'::jsonb,
    'https://www.youtube.com/results?search_query=Chateau%20Mathilde%20Normandy%20wedding', 'ChIJf4bNJ6YG4UcRLzX8_LKsTco', 4.6, 400,
    '43 All. de Tilly, 27520 Boissey-le-Châtel, France', '02 32 56 33 33', 'https://chateaudetilly.fr/', 'OPERATIONAL',
    '["establishment","food","lodging","point_of_interest","restaurant"]'::jsonb, '{"weekday_text":["Monday: 9:00 AM – 10:30 PM","Tuesday: 9:00 AM – 10:30 PM","Wednesday: 9:00 AM – 10:30 PM","Thursday: 9:00 AM – 10:30 PM","Friday: 9:00 AM – 11:30 PM","Saturday: 9:00 AM – 11:30 PM","Sunday: 9:00 AM – 10:30 PM"],"open_now":true}'::jsonb, '[{"photo_reference":"AcnlKN0TnaLEfJBUKQteEQgGm54fAnRLfE6RImIkKqwnzwP7cCJrr2zlXtnC2ZjqWJet32EyymEwOvCWzffBuBVU3Gbqoj1WLs6XjIr6qaqY6PYWvlPW-TTDQoeJ01uO840EFqp6m06qP3vunWWtjbXgcJJHzv9Ie0OemF38y3RepKWKYAKB-BjVa72tZkjjgDLI6FYwRZ-KNrl3OFT2N6Ti2Nbc48hhxwEkZaFE92rEInF8v808i7HHdt6bgsb5wgMHS8OLm8Vp3OVQbaaRzb7BWsg1Vfv2oJ7TEYR_xAT-SP8qlQ","width":4800,"height":2829,"attributions":["<a href=\"https://maps.google.com/maps/contrib/117205568631702106771\">Château de Tilly</a>"]},{"photo_reference":"AcnlKN088khJXAozAY-Q1eR_qNDT0d_CKuKYaXxwOD3rYPNA4V_bdcgEVXULqZmvBuDgmgWx2ZtZVtAaQtYcc3ZQrvOHMrPEBcclo9tZsGT9nlFu_tiaaoBrwssj2oA0l0kx6IbQFKsxdbZCA38-YS-d93IagNlUZizPK8OeluSH3pbVdocRF1JHViOaoUrHfWyN13kju0XxZg0FZuT6Uj6kXQ9ieUUNdx7MpC77MABPVwJB-xeqyuOEhctjOC6DhXqfArfl7wd671-m_eenGPN_CNGBNRTUQlqZ44EmbvsWDa4ed4aEqLuURHc_yF9mncTg4U-89x3V2ohFJYEslA3mfhe4_hb3D2SoCgD5U5vW3M_sssYxspbGKmLWl-P-9CE5CIfUiDhPr_qZl2HZhXNF6nt8jvVGCffor_JZUiTASEpwCSQLhvtbZXEWJ5kM1g","width":4032,"height":3024,"attributions":["<a href=\"https://maps.google.com/maps/contrib/113099857229807132947\">Béatrice De&#39;Nève</a>"]},{"photo_reference":"AcnlKN0q89YwzMP2tPiwnryaV0LQHrGSwcDQ04FXcu6AB_etEbxISajjLOptXk6DbIgWIHH4V6ib2Sr9fl6J4TKIQWN2m4v7txoMPfaogOBT-cp2bl49hWayQpBoNu3KIo1D0S4MelS8SROpub18JC2lWTv_dPiPlH17DZpGfVAhhS6hqdxo2uUgHbN2dvZvms-AvIvcF0AfWXMk1gZn2WEQV8q03-MVHUzfHD5jmCESXj59qrNEaLD2pA95tMfuU5NL6Gn54yPHQrRhwJijmIrEijBiJeuWczUBfm-Bd2NoAdLWUCbRmOB3ARvm0gSSnQ3NNG7kAJhf6UZJFzYdCkiv0HNthfwdiY8GQe5uSTiDK9MMDMc8W_XKFLiZm5sRopISJGKoWlC9S6A-fwP9I2XiJvLMGQPM0Y0S9lgSXgU2RuumAg","width":4032,"height":3024,"attributions":["<a href=\"https://maps.google.com/maps/contrib/102413660349967969478\">Brigitte Tuffier</a>"]},{"photo_reference":"AcnlKN0MeaT7tISsprtmzSiAB8cZA8q8sO4DEJ_Z36y3UF4ow8G7fE-1M4K0t1hexTUk4ZZchptAziaQ_DNd2fsaqvMRQsmiXSoxIBLQUJce-T9dSOPR0zrAzKAqumhjyKbrDh5KsvCv5AFb3ZYr5vT3s_stzRrz9sJI2crFGopR6JR6JAt4Dq1eHKmt_5Ds6a3tbto7s3o3Cc_EKp-H70tLWnrPu-lzkg4IsTKuqWMwMZlcYtpNDscqJFtfdR7dyv9n3UMGcXF7APOkV9ioaScPYcg2cC1GU0XdL67OdRwyb2XgbTble8mAbfMdvz3nEj5rY95KVDPYqUxbADMEIwg9dkO5ArUnm6bWeqaBBM_DOSqTbXi5DYfsrQ7UMXNyKLRO0yZLfIAf0lc_0UVWphooezwYZ5uYtbOyN3XJiQYws_rqlA","width":3024,"height":4032,"attributions":["<a href=\"https://maps.google.com/maps/contrib/115793743627282478773\">Anais Zielinski (Europaz)</a>"]},{"photo_reference":"AcnlKN3FJtfAOfyPqdzvdEYj_FeR-THAgx0m9pF6KlWzEAXVO60VZaROkd8HB3mAcQYc_PjXmpxZo1TJK4cI9IzAWbUQPcjFM_YKsMgGbQ4YqbpfQp57-oYFtBF5VGOJ1tHAZW4C66xRrXle53LOWJd0tp9oLqwwPI9lZXGL8WrM5IYArAV06Jr9gnjDNBXQruvlE47T5dl_8hV_IIbnNvTJhg3rF3NkzmPIJe0lldcNYg7TFvw6xPTufm4NUi0YZYAzFd76vCTldaYl_3ot7iZTMicXxu1j23rPi-Il6hAO8W5uyQ","width":1620,"height":1080,"attributions":["<a href=\"https://maps.google.com/maps/contrib/117205568631702106771\">Château de Tilly</a>"]},{"photo_reference":"AcnlKN0nNBi5Q44yC-J8yhOwroCWsvrIhi7HITzQOPjkeVz1VP_9QEPHNzrqgvMj0n0yDZ0f_EbQS1SgOK46SX8wfV7FPu-BfKTukuRUuVcqC_Zy9sBtwHSyf2HQhrdtz3DM01wkj1MqX1wtUK9GaN4HtUhK9mJ9dPl3xucRGHy6aeNL57rxQ2nmQReUTlNGHCdHLNIz1DJ0pbjrBVEAcfDPD3VBwgEwD3YZGm2iwkThx6gHDr1T3XDE161MMYCX9fnhvjCBUPCDx0MRCLw5D6yaPFm6hDFi9oYVIuX2HrP8cUFt-w","width":1620,"height":1080,"attributions":["<a href=\"https://maps.google.com/maps/contrib/117205568631702106771\">Château de Tilly</a>"]},{"photo_reference":"AcnlKN2srMfZXSsEcLIGVMTILtGllnqN-rpm2DH_QFu_9yLGooIbqKyf9B7ISQja_qpsO9pqzgXj9l3yQaFO3x3_Nb5dLF_FTN8S76Plb0JY7vrtEswm1IgO0LvhVxYU494bfKX1mLcXvLQEJedgmLfc6Qdudrq2KhPTFWH6FszSKb16TugKJNeWzNmwlw_hQygrpNwx06pDbM7eRZ_XxxT5PORobJYI1SqbN7neLX9ULcqQ5YWdiSCs34n9vFh64wM0xTF8S8OoGfJWorDrbRHInsTzncuMLuMayLmZzjed9T90uEzz_y2Q34J6u3CHB_1miBCZGVjy-FT_yXLK4KLBxfu7XI9rqRGw9dhl0JTLYL7l10oVmi07oAGTRhdHbQm4PYGMpgzxI7o1MkYq-yM0l99ekEZDJc5bpT-NKv6mRcAmjlTgSo0Y-nISKZaa3shY","width":4000,"height":3000,"attributions":["<a href=\"https://maps.google.com/maps/contrib/117086508884539865180\">Maxime Plaza</a>"]},{"photo_reference":"AcnlKN3_wOWfsYxrKPlY5b4BqDfZjzY13Ux6936Sq7VuqJfho1l59l0i2WX8U6tFaHdry-hasykpTctTeRfkK7Ye7yYodPoAEzOWYMExIBcR5djQxEVPHDRKdVJ2c1g1OBuzVz1XJ2FmgSln9k6V8dO1uVzetBLbECgUw_eZ5Gdn7QiWMG_tLav8zcANOQ9E7QQbwKvUsxAOZT6XVQnn1mswOWN3L8NVnrJ9B__wA6J4Kcz8FufnJXfUoetUCWnWQVC8xETJCWsIR5QVV8ENNYvbSY0jbgE9fGEY_xMm2DxnCQeuWbYasZCQWHUAty7soIVIi9X7OKvx2URjStUTFg3sKy1fIE_PQTPKSDFGRddrVu4slD0XDxMpmbKVyiGqyoiRNbo6G57tUiKu3zwlb1Qrf-EmqIHrwAhsAHINgH3FDi8QWA","width":4000,"height":3000,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114301290785212955896\">Josha</a>"]},{"photo_reference":"AcnlKN3CRaHpuosg9fGRZVjXJOZFCUDTW1iNDsEULCLvPNFYSukaqu3xPtD8eUNLyZrHZRE19AMAgGhoEw9tLWWblONJAvkG8yethGbYgUtbJcSC6Cp-fFhNqPIBsHthyWocARC6lMgNW_j9zsto0yxoMwTWY5JE0SyUSJUNLsfeU2Yy7mw7rZfrDo-y5mHXq25W_Faz8t0IHZhZRfGj73wOO5G_TZjdPLajeWoFeMMQ9XkcYJRgHC_BSpMtn55cQIz05Ch7gspp11uVtHD-LLVkXSl2U__5OEWQRr9i1SPlUE1cbw","width":1080,"height":1620,"attributions":["<a href=\"https://maps.google.com/maps/contrib/117205568631702106771\">Château de Tilly</a>"]},{"photo_reference":"AcnlKN0iP7mFwBOGS8wk8Aa2Fahebb-jItqnqT0y4aOQnF2dxaUFA1FQAEVIkof-4reg4Jr-QIBHK8HcIoxf7rgrUP3bg7YOdID6eKXEYwpzfAkAqxlwrCgWWfAysUyIRWyDzqthL6ILNPzxKRpZEHx0GciZiVqtdE3A7aUVBpEvS_WcPD19xn-RFV9x3MEzboAl2ktIQUgU2ph3cWxVXgpGitD1J9qPrNJHIFqPm_ivIdPYijhgj0ovFvb9YtjTMnf2NWXo9414YCETOTzv4gFtxZHs4mcbTJAz11Osw9Mhr4Thfg","width":1620,"height":1080,"attributions":["<a href=\"https://maps.google.com/maps/contrib/117205568631702106771\">Château de Tilly</a>"]}]'::jsonb, '[{"author":"Laurent Triqueneaux","rating":5,"text":"An enchanting castle hidden in deep Normandie.\nGorgeous grounds, gorgeous interiors, just wish there were more of a \" historical tour \" of the castle since we get to see only a few rooms, gorgeous\nDining room and delicious menu, kiddos to the Chef !\nPrices are decent and well worth it !\nAn amazing evening to remember for my daughter''s birthday at Le Château de Tilly !","time":"a month ago"},{"author":"Aleksandr Bashkalenko","rating":5,"text":"Château de Tilly is a beautiful 500-year-old building that has been impressively well preserved. The atmosphere is truly unique, and the historic charm makes it a special place to visit. The rooms are spacious, though they do feel quite old and dated.\n\nUnfortunately, the service leaves much to be desired – the staff, especially the waiters, were inattentive, and the dining experience in the on-site restaurant was disappointing, as the food was not tasty.\n\nIt’s a wonderful place if you want to enjoy peace and quiet in a stunning historic setting, but beyond that, there isn’t much else to do.\n\nBig parking, charging slots for EVs.","time":"4 months ago"},{"author":"Christianne Wyke","rating":5,"text":"Beautiful place, lovely warm rooms.\nVery friendly and helpful staff!\nWill return!","time":"a week ago"},{"author":"Jeffrey Osier-Mixon","rating":5,"text":"Wonderful place to stay in Normandie, off the beaten path. Staff are great, rooms quiet and clean, chateau had a very interesting history and is close to many things but not too close. Dinner is amazing.","time":"8 months ago"},{"author":"Jim Harris","rating":5,"text":"Blown away by this place. The building and the gounds are genuinely incredible. Rooms immaculately presented, well equipped and very spacious. Staff very good. Had a meal - also very good. No complaints at all, very good value and would definitely return!","time":"a year ago"}]'::jsonb,
    TRUE, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'fr-042', 'Chateau de Villers-Bocage', 'Normandy', 'Calvados', 'Villers-Bocage, Normandy, France', 'A bright and airy historic chateau that feels like stepping into a fairy tale. Features ornate topiaries, spacious lawns, and exceptional service. Known for its elegant architecture and beautiful gardens in the Normandy countryside.',
    50, 200, 15000, 40000, 'EUR',
    NULL, NULL, 'https://maps.google.com/?cid=18194307190348878259', ST_SetSRID(ST_MakePoint(-0.663481, 49.070926), 4326)::geography,
    '{"instagram":null,"google":"https://www.google.com/search?q=Chateau%20de%20Villers-Bocage%20Normandy%20wedding%20venue&tbm=isch"}'::jsonb, NULL, NULL, '{"url":"https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop","source":"fallback"}'::jsonb, '[{"url":"https://chateauvillersbocage.com/wp-content/uploads/2022/11/Chateau-de-Villers-Bocage_drone_Normandie-scaled-1.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwNiTSKkj4S8rmX91y96bcB0pCoXu-kw4GwYJY8M34IJklWClB&s","source":"google"},{"url":"https://chateauvillersbocage.com/wp-content/uploads/2024/02/Diana-_-Vincent-Harriette-Earnshaw-Photography-001-1-scaled.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo7WIDYOBbkTMewwQi7PmZcKpy8yytden6q3MYerQPheAKPrg&s","source":"google"},{"url":"https://medias4b.patrice-besse.com/photo-acquerir/18176/550x380/60f2a7fd149473f76763664c5c8b5182.JPG","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyvXLP19zlYkHvwx2Wi8gJu0hgWhOrFH2LSfV211qPR09szXo&s","source":"google"},{"url":"https://chateauvillersbocage.com/wp-content/uploads/2021/07/Chateau-Villers-Bocage-Harriette-Earnshaw-Photography-391-684x1024.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ98vKaINdrjkmPCT8KyAgEVSJOkG4H4AF5b4-8FHtOEKodXjo&s","source":"google"},{"url":"https://medias4b.patrice-besse.com/photo-acquerir/18176/550x380/582294%20ext-6.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD_pYhlaZixLrjxim6gtCyb3nMk6l4vMGATqM6_tlrICPDwoaD&s","source":"google"}]'::jsonb,
    'https://www.youtube.com/results?search_query=Chateau%20de%20Villers-Bocage%20Normandy%20wedding', 'ChIJwaIZjvBLCkgRs5EU9_0pf_w', 4.8, 83,
    'Chateau de, 14310 Villers-Bocage, France', '02 31 37 03 15', 'https://chateauvillersbocage.com/', 'OPERATIONAL',
    '["establishment","point_of_interest"]'::jsonb, NULL, '[{"photo_reference":"AcnlKN0RlXDO8ozMe7oWCdGZEUIGsC8FFbypBOZEYpmpXHMm8yy1PxtiIN9PzNEc8mTq1RJOm7xz_3y_ydhhjgvWvqw_VerPvQ5E6aIndb26wr2vN_4f6WsTh91_opYykf-XmBlTX4KRJzsRODWJmIf0NtULLtHkvHe_pzzwdeGTBoxLF0UogIAIDqcAZf6QHN2JVgpx88LoD_e2oeUvr6hZOdcRAGWhAdNo03CZW52uRGM0flixhnofFJ-35FRvsEXuQzM8IRhg2td-Xx6lODnUPoBnuKSQbd4YTVYk3c6FsheWGQ","width":2133,"height":1600,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114065149982822781511\">Château de Villers Bocage</a>"]},{"photo_reference":"AcnlKN2BNCeAvVxe7gFMcAgWPHCmqlTeKIASaKZLFu1mgq0LVsP7VVpCo5bPMMkyUjyrRizQKzSqQESFJDvesrBHFQ5nB6y0bIF5-_WG0XAwwAv3p_zZkzBlW6d_h3y1qBpkwlk_rcmdNmHmYPriOeuivAVSGiYOJAaJ6fdKyrlLaUnILCP3Pk7_ZfLzdpjoSsHl0aNQd9ByRmbN7zExUqfKr4D9gFwUr4d3bS0Iq8e2pVpxllIYoWBe1cl3GtZB2AdMqCTu1PIcQoVLbiX3cZWOYNY9vsBl5mA1ukhNB7xukQjCig","width":2016,"height":1512,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114065149982822781511\">Château de Villers Bocage</a>"]},{"photo_reference":"AcnlKN22GbZ3f5b3OGqyj-ElBzzIVUj5pknGUwakkJExaJuf1lGAjYv5oK1sPVVOWA80la5O02H5gfH3hGYwYSVlGH7u1IoxO6EamuAnR0SeDK06jw6lxzBTE_scO8seetzj_R5MvZ5pGjJAM90HU8w6FqSv3chHsmb4QEPx_wcRbX70Nrwh5bfsNQaUfGbdYtGqlcez4W1LlN3ClbeoDvTbIZRS8JZbKdzeb-cPwDYZjHCUFOnNCVLVNqzct79p17J27ibvaGtbhNZ7xVdx49o3VUX41tSK3luzurll2AwNVhbu_7i7owgcfGjRMIq_QS98rehOwDwZOHhU_3sXf5f5iy7JtNHssLyTxAJTYxRro1lG0UkbTuQL1WIS3lKobe7T90yRCnVgmwPK6LXrf7ba0m0c93lygnz_6oLJEWfph9bk-A","width":3000,"height":4000,"attributions":["<a href=\"https://maps.google.com/maps/contrib/108017926320155327184\">A.V.S.</a>"]},{"photo_reference":"AcnlKN2mGc1pzPsyPGUbwFSUSrDpJGpkhen5wX-bI8pa0U-N_MHlqLtls6iWBsFaiabRbMGbgwLp5ad29DvhIeasAfhcm7vUY9MumRQnKAgoHirE25ZTZ2uxlLYTcnHZNXkok_dJ9ES1GVFLwV-Jtne8HAuydTxj-HOB3T3WDJymIOdwNL980tSj8oF2CyxKTNC9xx70zCVp-l3tjbCASMp_Bj3sDzPwU4LZfMmrgdJubgqL_Uh5wQ3P8qh7sfDNbUHciPNamkICY-pfqZvrFitPuPMiLHVhsKo5Ud70aJnwUEMb7_AGlFQtTsO9Nn7xYMxMb1dCXHrgt06bIBlIvRGOKKTJHDw22Nmt7ueQqHU_q2JlUVArhMdXRTrSvg9XERGxV45LEsv9jS6PPSOgT8KX2COUQw29_j8V-jdPhrZLyE4ABQ","width":1600,"height":1067,"attributions":["<a href=\"https://maps.google.com/maps/contrib/102195817142716547670\">Enéane Wedding Planner</a>"]},{"photo_reference":"AcnlKN2WnZW6LI8aL-YfzQDeOUfoFPS89ZbPItwc0HeB_VNzqP9RK8WaKifpJ1czmkli7hB_DgP5QtfMe04FerRYyIY9pF_-ZJMS6gsuKDEDmJ73TV2yYjJMDpuHcAWgOX_nRqAPAA82BJZcb3cRQeF9WYi05seI71upQD-0t6juEskmvPuuEKO6-j1e_hxZbMD0tC6mTh7DCm6iuBAAkBUsRaNpIOAdf8-6MBPInFR77lfbEMwhD5chqsgSP4qq_yPK9LQDXdIA9U9WH38C2JM8R8avlFDkbuBZwpzAAoHkItdTHA","width":4032,"height":3024,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114065149982822781511\">Château de Villers Bocage</a>"]},{"photo_reference":"AcnlKN0vciilCGVjq_yb9WmFI4elOiXTx7JQhw2WJQJefFAAggBtEt2bIf0RCMV3cBwFpLJNFxOLDWwuYztLkj_9bkN_dwvKepklnSq0mZPXzhcP47GxP-wxN03GQqnyfzwpJwAlGZ5tp3QL6nEGOaD4kqp_R8dch6OEz065ghmmH9tBJyCvqlsVlH8GZYQuAqFmiCG5nrauokcvyCmO3T8_c82PInKiP2BJLOoS5Xhw5YthWsYath_fp_CoZyu5Niv4EB--zXetY1C6gnHej5zooRp2s-rwWNt2kDA0ESNByZeAEw","width":2016,"height":1512,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114065149982822781511\">Château de Villers Bocage</a>"]},{"photo_reference":"AcnlKN248lfhYDE2Y1gL7Y92GPFE84sMOi7TITWYh6VkXg4aINOCmjHdNNn9gsxxZidfPyzlo8QKE6sqNUfv_uJ68aqCQYJPdpEz1Mrkhg4Sjlq-6Vgm_oWEX86fK4gdGchwiMnzdv1Wme8lSlc2juakwAbQQBfIBsUd1jc8qZnh6LoYDBprOVFSMaBlCYMHFPgG8Y2R0xPpxr8voaDZFelGGC5nKz292SDW2nNSDUvuRoLZtvaeKbpYahiyUhJTUKeXEaWzm21jtpt8dIr0SNmOx0wlm3-PXaZddUSQHJEv0IaJrzWUIwOAa-1Ze9ThdapIiBdIBodC4_HcrePaCTiG9OGeOhlg-fniOg60b_myDnVRCLvJ8ayT1buaBdzSY2bhpR-590x-Axfm4LAFX59WZXRxaiJPZtvZnjjQmTc3EBQmKRzF","width":3000,"height":4000,"attributions":["<a href=\"https://maps.google.com/maps/contrib/108017926320155327184\">A.V.S.</a>"]},{"photo_reference":"AcnlKN3xt76cvJa_7OB39S0xEOsc9bzvvQL19E4PnlxqT4ZiGnPfdGOc-VZgJhbfY79rEUmO6xl4LVVp9gcVC5wXKMCQz8lC1ZEUGUYpZE7x7glLkaD-w3zDtnj-_ufCSFYLWwGEMTMckK5JgQw-OvNznOehrQ9WT_cD8b4Jf95tPdS81WB3WXemX5nn5pJyCVsjrmznBHFt7GEhPsuWj9oSzQOOZT_fwa1AgqzQFUyEoYEI3LS_czimTGBOhXPms7Y075uou1kcD9MDljC45UfbecNDOSmuL2cNQ-JRq40y-lxZYw","width":4800,"height":3200,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114065149982822781511\">Château de Villers Bocage</a>"]},{"photo_reference":"AcnlKN2LgYA-2-xRwmbf9uQWv7Ui2GXpSJatV6T0sg0nTwGOuuMWlYU1cs7pPE04uZHucc8qghQI2lkNm-PPT7_3zR6j4E_pYgM4JKw7o01hEPTCRXGcgoGiCBMN9gwRrx9DHo69QoNHGxm9PNL_TPwXbmkWS1MFDsBwJqUkCD3JYwW9-1CuM8dCFHkvs1JkWBP2jp5e6_Mnkv3tV8CklaHKTD83NBaVRXDpa9mDt9lAZGG5-2LNf4-dmKQGz2R-ZgHIhJkaHaZp6wnQte_TBidLNjHTi36z0fHMHVEr4OzFLAiF1mO0NEoToovVaAi6upr-wXbjjTm3NXRtBRKb8nnfQBEKyqCqlczhv9Pxuhmp8Z6J1P3hv4aGI7eRM0GAfVgt5x1kzFAwOBEje1seM4wiqbxh0r64Ii_itaqKI-76mNDCVaLn","width":1067,"height":1600,"attributions":["<a href=\"https://maps.google.com/maps/contrib/102195817142716547670\">Enéane Wedding Planner</a>"]},{"photo_reference":"AcnlKN1HfG6M97yO9FoSHy7f_Sa2iHT1YRD-RS3oyLtjBtDDz1Sp4DCzQsaG2ESTjh7Rcf_vXvgZyk99L9UMpP14niu2WocWjeWSQcprykAaKrXU6bM46Y5JiRm5XnUvIFvcOUYodqJLoEa47O59ljNAeSU-9uVk-oUi0j7yzEseWdCeF-QK8V4ku-YTPIkzVwrxGHJieizVtGzVoICTB_OwCM_hQavHx7sFeIZhOBL9N4ZQSETPsty7B5fNa23oZdbBAoAFFGd1aYzPhvWbUYgfkwylUG16K_AsEbr0gAgAhx_img","width":1600,"height":1200,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114065149982822781511\">Château de Villers Bocage</a>"]}]'::jsonb, '[{"author":"Yuliia","rating":5,"text":"A stay at this château is not just a vacation — it’s a true fairytale experience filled with comfort, elegance, and genuine care. Every corner of the property is infused with attention to detail, from the impeccably designed interiors to the breathtaking natural surroundings.\nThe service is absolutely top-notch. Every request was met with such ease and promptness, it felt like the staff could anticipate our needs before we even voiced them. Special praise goes to the entire team: Alessia, Jordao and Emilie — incredibly responsive, kind, and discreet professionals who made us feel truly special.\nAnd of course, a heartfelt thank you to the director — a person with a big heart and a true talent for hospitality. Alessia was available 24/7, always ready to assist, support, organize, or offer advice. A remarkable professional and an absolute pleasure to deal with.\nThis was a getaway we’ll be talking about for a long time — filled with warm memories and the kind of magic that makes you want to return again and again. Thank you from the bottom of our hearts for such an unforgettable experience!","time":"7 months ago"},{"author":"Sophie Spooner","rating":5,"text":"A very special and stunning place! We enjoyed several days here with friends old and new, celebrating a 50th birthday of a very dear friend, and it was just idyllic! What a setting for a party and gathering to enjoy life with good people! Felt very blessed to be able to experience the beautiful château and to share such a special place with wonderful friends.","time":"a year ago"},{"author":"Diana","rating":5,"text":"We celebrated our marriage a couple of months ago at Château Villers-Bocage, and we had the wedding of our dreams!\nThe location is a dream itself, with beautiful gardens, luxury amenities, spa facilities, and impressive common areas. The rooms are spacious, renovated, and unique. The interiors of the chateau are tastefully decorated and truly make you feel royal.\n\nOur guests had such a lovely time relaxing and enjoying the property. Our wedding cocktail and reception were held in the gardens, where we could enjoy the view of the château. Being able to host 40 of our guests at the château was such a treat as it allowed us to spend time with loved ones who had traveled from afar to be with us on our special day.\n\nHowever, the cherry on top of our wedding experience at the château was, without a doubt, Valentina and Nicola.\nTheir kindness, support, and attention to detail are exactly what you are looking for when searching for a venue to celebrate a special occasion. Both of them made us feel welcomed, ensured we were comfortable, and checked in with us throughout our stay while giving us our space to enjoy the château.\n\nIf you are planning an event or just want to relax at a unique and extraordinary place, we highly recommend Château Villers-Bocage for its stunning property and the outstanding services provided by Valentina and Nicola. We are truly grateful for the exceptional experience we had at the château.\n\nValentina and Nicola, thank you once again for contributing to our special day and making it unforgettable!\n\nWe can''t wait to come back to the chateau!","time":"a year ago"},{"author":"Jennell Espitee","rating":5,"text":"Hosts Valentina and Nicola are amazing! The chateau was a fairytale! We had our wedding and stay at the chateau and it was absolutely perfect! We cannot describe how perfect this chateau was, there are no words! The grounds are spectacular, each room was beautifully different with an en suite bathroom that were updated and so clean! Any moment I needed to contact Valentina, she responded quickly and helped out beyond her means! Valentina and Nicola went above and beyond to make our stay and wedding a dream! Our event assistant Axelle also made this stay perfect! I cannot say a negative thing about staying at chateau Villers-Bocage! I would recommend this chateau to everyone! From the moment we arrived ( with a warm welcoming from the hosts) to the day we had to leave- this was a dream for all of us! Every guest had an amazing time! This is a wonderful location, with walking distance to the town and less than an hour from historical sites! They set up everything we wanted and needed! An added bonus- we had a golf cart to explore the massive and beautiful grounds! The kids and adults loved the goats, the indoor pool, hot tub, game room, cinema room, outdoor pool, tennis courts and golf range! Again, I cannot describe how amazing this chateau was and how it made our wedding and stay absolutely perfect!","time":"2 years ago"},{"author":"Earl Laks","rating":5,"text":"I hosted a 70th birthday for my wife with 35 guests and Valentina and Nicola delivered beyond expectations.   I had multiple meals and events planned and each was delivered with exceptional quality.  Any minor issues were handled quickly and effectively.  All services delivered were great value for the cost.  I would highly recommend this facility for a multiple day event so you can take advantage of all it has to offer.","time":"4 years ago"}]'::jsonb,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'fr-043', 'Le Grand Domaine d''Azur', 'French Riviera', 'Var', 'French Riviera, France', 'A seaside wedding venue on the French Riviera offering stunning Mediterranean views and elegant celebration spaces. Combines the glamour of the Cote d''Azur with intimate charm for destination weddings.',
    50, 200, 30000, 80000, 'EUR',
    'https://chateaubeeselection.com/venues/le-grand-domaine-dazur/', NULL, 'https://maps.google.com/?cid=1335142177247778467', ST_SetSRID(ST_MakePoint(6.3586844, 43.132025), 4326)::geography,
    '{"instagram":null,"google":"https://www.google.com/search?q=Le%20Grand%20Domaine%20d''Azur%20French%20Riviera%20wedding%20venue&tbm=isch"}'::jsonb, NULL, NULL, '{"url":"https://mlmtblstaqh0.i.optimole.com/w:768/h:1024/q:mauto/f:best/https://chateaubeeselection.com/wp-content/uploads/2023/03/ROCA-2-5.jpg","source":"og_image"}'::jsonb, '[{"url":"https://mlmtblstaqh0.i.optimole.com/w:1920/h:960/q:mauto/f:best/https://chateaubeeselection.com/wp-content/uploads/2023/03/28-wedding-venue-grand-cote-azur.webp","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvWbyS6JmpHU07Cc-XVkZfGB0aItL28KMfmL-qjQmvWvXfYa8&s","source":"google"},{"url":"https://mlmtblstaqh0.i.optimole.com/w:1000/h:1000/q:mauto/f:best/https://chateaubeeselection.com/wp-content/uploads/2018/10/FEATURE-2-french-riviera-wedding-venue.webp","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtwguttS9TZLaPwg2DYgibNTH2mAdarX-ntDxAwBJxA-gilVRP&s","source":"google"},{"url":"https://mlmtblstaqh0.i.optimole.com/w:810/h:1080/q:mauto/f:best/https://chateaubeeselection.com/wp-content/uploads/2023/03/ROCA-2-5.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrJ17Z3l8hXqsgjHU13fpdHNYrttoal7Z1HcqZVQvkrpQIlXQ&s","source":"google"},{"url":"https://www.frenchweddingstyle.com/wp-content/uploads/2025/04/domaine-cap-azur-all-inclusive-wedding-venue.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAdG9eCCTJX0ZCMwvUMwBmxN_a0fxcEMAvc-ul550d6-S_yq8&s","source":"google"},{"url":"https://www.frenchweddingstyle.com/wp-content/uploads/2025/04/domaine-cap-azur-30.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2ds-fsNfK8_dJENWJzgfByhstZj0QIAKrooH7uclg3w1SZfE&s","source":"google"}]'::jsonb,
    'https://www.youtube.com/results?search_query=Le%20Grand%20Domaine%20d''Azur%20French%20Riviera%20wedding', 'ChIJP3-sOaItyRIRo9Z-f7xghxI', 4.3, 42,
    'Rue François Touzé, 83980 Le Lavandou, France', NULL, 'https://evelynrecommends.com/holiday-home-le-domaine-d-azur-4-france', 'OPERATIONAL',
    '["establishment","point_of_interest"]'::jsonb, '{"weekday_text":["Monday: 9:00 AM – 9:00 PM","Tuesday: 9:00 AM – 9:00 PM","Wednesday: 9:00 AM – 9:00 PM","Thursday: 9:00 AM – 9:00 PM","Friday: 11:00 AM – 9:00 PM","Saturday: 9:00 AM – 9:00 PM","Sunday: 9:00 AM – 9:00 PM"],"open_now":true}'::jsonb, '[{"photo_reference":"AcnlKN3uYuQ635vVEy0vOPQDOjw7G-yCspNNxkEq3hoXyQx0uFEGJH2CfKn4C2M39RNzBVZ8CZ2Wv5cXjtB94U1YBIUK0xa9lrDruXdEQAZShIQLCUT9W82D_mED1zqPnYXwHLwM9c3Ce0ODhAUScPm3g6u4Cc3rAWqftDcRo5MQXxtlUiB3K7VSkNjz3p8EDv3x0fE-EuhTeIk7SqQa_dXRYYqtBbEtzWE5yaJRLKPQSRY9TRmquyqw0Y0-j28JxtjdetTcahJdEgh3-jaOLbCGK9ZvPb0T8HhJkNafbqOCw7ry0bc00KkI1McYfzDuSg6kyoAXkhXLx7tjTxvSi0bBex_Hubvn_vzvAu-Q05Gdrpn46sd9UP-RNL1SINwjZ4izo_HAk-nzjTLS1jetjE_PPUGApzlyOWGpHA8VqZd5QiO4fhy9","width":4000,"height":1848,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114242657191507211379\">Harald Allmendinger</a>"]},{"photo_reference":"AcnlKN2O5hIjLfk2U2du3M45aZi4w9KKvVzjyG5fuOKRGbdJVS5y_XlLxKGOCG7j3CaWMy_mf_8xKrMBkvGO_5N21XyKJdPJdoGI80MwWDJWB94JDRud2iSkkaPV4Octgw4nt_Dd2Lt0AYyfjTmUcnqZ0lkad3zuoumv0i-V2q1JWp37L30OGzyo-HbjHow7rEpEx-YUgkNZiF4hfjpWPfOuA-gev_2UbZqoRIAOQpXuwDboyeq2jXT5t70uJNbLc7nTIRdGFPFsnoHU1vKH_3cxZwUvuGHDqzRp6No5ij_Rh5RaDTw0xrJd39MwjO0OC-de0xm3NoKWAbE-JBxqthaIPF_H44aUeMjQ9jfc6zhTEX5UpkmwBndltY4-7pPDGgIIb-qN5UIFveo-5VDqYwuN4k8DB1BxVB4NF_Sysu9_l8ZLPl_k","width":4000,"height":1848,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114242657191507211379\">Harald Allmendinger</a>"]},{"photo_reference":"AcnlKN1B38WpaexOgfdNrda6T3gf-4CjQCmcJf0SXmZse6F20_IGYBxjvNZ8KxegDgcQdV98DuOWFNocmAREgxBSRdJtuSDy1gS8HmZcPezhyCdK617cMOrdXcBdSqGDg_1UvUuMA7Qz0v3QYo6-CEG95QWEbngAGAVkOphQQ_fDlAWT6-dKI0-LdDVh_Si8h4HD2JgO9qDVprCveb3T6BLsnyb-HIIfOu9F4e_nUHMvxNybDLmSc42eXXBJFwpMVu1VXiRhwvdjTcqY6gE8bjORK2DslVcnIosK7xJSays1GPJ04i5wYzuDeNx22_5hZyAIh_cJhI1Jiym-YSVqlHATPBMy6tQyMSLVUXRu7AUVLjKlrJq3WywVidNgH68jsYsqjipsCaPE56yOVSqLuvqa4SA2ThdjdoMv00mMGJke_UUhPpoF","width":3024,"height":4032,"attributions":["<a href=\"https://maps.google.com/maps/contrib/118422245587590809053\">Nathalie</a>"]},{"photo_reference":"AcnlKN3yAFxoXHG5lod8OrD44Y31PpeSSi7ZsyiXHfNGHc4pomLrgsHUR8VH_QeKZRX2j3kg1JwL1gbEx-_GRK_v_SVhWMexgjwLpmos9GDsYp9pwuT0UkU4l2LlLxtGX6SbVaO7ZoFvOFgLlu_uURUpNsokgC2o-IJCIeeFHjrpMPs0S4neuNrenLDQ6J1f13b5dalSLueyI55FQFrbxM9P2jZz5sGscIiYS8KT3lmiB7HrXy10jJV1bzzqazAHDBsRaxwVYTs98wOlVMB87dvKLD4F4ADhpjurK-h7A5gyu4tV02A69PIZsANniuINBKpv7328ttH9n6yg9-Tg9drH3DXm-yCn3PaE7bBaMBdclnA4wi7EhysBcogEEHDbpiVV-uNWsOMGgwgB-iwTyCvCZqcw-5snreYsI2-gM_NvbVr3cSw","width":1800,"height":3024,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114133797782735116571\">Christine Winterstein</a>"]},{"photo_reference":"AcnlKN15ak5LjQUHQL3KqL2godSmugpoGRg4FkAGHsGPlcGskLoLHdWGory1JlhWpGJNd9o90PEjjfBeqdQkbuPLm_gzMvfQrRhTtaT7zDvecCMfCL3QAuSPUHXJFFfRQYoZj2hM30BCcn3sGEmm9XseCP6fvi1uKxNDKHK2pE80mtFjROhGWM0kdOt6pErYx6nq7sBWJ7IGgMnHE0b3BIvsdoLrMgO2BHhyv6DRIs_ijbUROo_AdcFOep6Fn4dW_6LVZgXpVPaVRjA7NQB5r5m6HQ9gwKiNgN7ab_9e2MG4oGrBtJgzvf5GIRifCWgFTSAneDSNoyIN5bJXCmZonQAq0yJiC5LQaISdK2zFVomYJDRe1xtyjuRZDwYWa38ouW4lZ7UlJ3708AU-ySbgKxTwlj4mK6gUrX1ObGhLIa_8y8nHgQ","width":3464,"height":4618,"attributions":["<a href=\"https://maps.google.com/maps/contrib/101400485079960791742\">carine</a>"]},{"photo_reference":"AcnlKN2bFKwpI3IhBmdIu781t6tjkPmcpm_z7QPEi1CJWgn3gXjVmYsj0udwTy3LzyT3Ow1_wk6c-ypbHoZ3NQD2qAwFWACBUbtQxLSjs4bW-RdM1h870iF1bf9-yWAP6hk9OaDpTRyOFTAp1QM2G4XNSVdBY30zqmaRwOGrI-uuYykdTiqoyoUwE2zbCNV4Z-F_UuPmIl2-cl9gqUkyiSo5WXqR1tyKVEZ6DaR5R0_iYuqf6g_m80ZQ7mIswYFeJyOLxyvhbTjxFe5vRQ9FLQbrbJwFd2aCog2AqGSYpPpE8Woe5EJxfnPxenrrD5x14vpzfUD_Xujv5GNpTDThlwDNTfBVhxLdl1x5XrF8ev2LjbIQHAzNrBCC-BOxmd7_Z22u-nmI5BHp47oK-Po5Ua-eucCBEiYstWchlxlI6dpOcrk","width":960,"height":642,"attributions":["<a href=\"https://maps.google.com/maps/contrib/118422245587590809053\">Nathalie</a>"]},{"photo_reference":"AcnlKN3aSIkbxArS76T3m5diPqEVNttpMbmO9qhpf6p-i9Q7X9VmZa2PqY93Qf8ko_53lOK7u15N_qSQQ4y6YYaI2dalV1B9gbcoiaFFQ6jYcpsVvgwQ-r1UQg5E6O4KxS6mYCfED4QSdqtFPG-nxhjRGmeefHnT5G366Fs7ULk7ki_xQpZUScBk0QJJhnKmJgfhGxPkFPAUlsjg77Tgo_pdeRk3YEFLau7LKdR7r7L6q8p0jd4uvt7v5M423XA8JQeBSVP0VPi3h2inPLEfJUc5mX39cwfNOT2NULWnbwWc52prjsmtvZprbqYiLMujfJ6HGntHbL329dS3UnJbe-xyjURWG-BgYtrSwo_optMZihpaQQsL0kZGX4UOxT-3obrLpGy_Znbmq9xyGxD_ynvEh9syC9K_ljTIdNoHftIw18RhuQ","width":4618,"height":3464,"attributions":["<a href=\"https://maps.google.com/maps/contrib/101400485079960791742\">carine</a>"]},{"photo_reference":"AcnlKN2YTh9noKLtQBF23G3a7UeBoKvmJGyqwmIaxPydmkH2HvX0GS0loWXOiGdPc_KTJmFlN5E16-yOq7xb_lClwO-vou1QBMp-kGvzgbBMg5zzadGlXlOcHIXMAMj3EdcNboBSlUFDQWbQKmAsaxOlvnQrRhtar-ZAOj9JZegi6bxx5Kkzy-0Ylt5hfEzS03Zn5cTrGpQzNOj-whcrzOnMR-IfDjPZgffARMDtOR3ryA-p3I1qUpxTPnTDvTQxb7qSDxzi47-xlf7OhmVABv5tFu2KP6XMqtxk3X1bL7eeQkXv6aAzrtoXp3xyJDHGPpqGIrSTad9qjUOHvZWeKuUEaIqy6aSL9rDgEjfroBCwFRK44Xu3pgom-io9UIBjiz5OLl2YiepwNZNZzxWPe7rtQvNeLTeOPzfjtcKV10P7FYeUKTqk","width":3060,"height":4080,"attributions":["<a href=\"https://maps.google.com/maps/contrib/101494887393691397067\">didier viette</a>"]},{"photo_reference":"AcnlKN22a4jgYEXpUnd-_eT4UAyA_X8PXbxoyMR5MSHIxRGeo4kkdk6xk_UBnP6jj5R_v0waGCkx4hz1bYvOEPUVKS1N8YG9SBrW_AJGkxF4gE_iV8ueK3BBLxhUTXeRt_XzprvmCw8OE9vZqfQPKFgSHoIEW8n0soFN3ihcr6ghwLRcg6PpVmuUCz9DK23MCkAosSzQaliLaLAQEoH75eYSIi0tfVqfx6H_cobxp2VavFX5VmHzaMCzwFwKzjyJXNQVNSVBS-IzW6XGnQ2W2rVA9mEs_QsN-8zuI2o1mfXi2aJqKlIUbM_LsMHfYIAtqV7j4EkbE4G3xVoGdVNHF0m0_suM5yaOv0yitiX9D6CKgiovMCloPoX1pkAv-AEe5pppr9gec1sUQutLFx6b83dEAG-YO42zDWf_3HPSCmrskCWOHw","width":1848,"height":4000,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114242657191507211379\">Harald Allmendinger</a>"]},{"photo_reference":"AcnlKN3lxG9HhQCrrnU53_Ri3Xa1kEJcJoVKESDb2X_WNqo2mk9HbfRo3qwAX9xlUJI1WjtbJe77mx_6WUxrtFuk31454Yr57ON_A76tEEWD0uA3D63BfuZmICNdZ6iqmezlZVVwk0LPLmi4jPn2mYRCnOIbwqcumAF8oJAM6dJ5poqyBQlq9lCKch44uE-cYCttpCVThGNMHFOssmvrcEfnAGasXY4Jb4hBPq4u73oheK8XGpBUkhgYWo0STc7tbxPV85Smhd-0XPXyIl1TzpUNUqy-jVCeKYJ2TZAuD2_wWaJCyg7XgTndunpTsjDsHulOB23Kc9ACRMQkca5Nh-LbDF04vfeLg9dPkazBSkxXS_SLbbYkyjTfCfaSlfIom0OA97utFdrjyZDzgyJYPl5YbMM2NTAVIGj6UWQ84XtQ7fsF5MI","width":4080,"height":3072,"attributions":["<a href=\"https://maps.google.com/maps/contrib/111853484142101512602\">Peter Suchan</a>"]}]'::jsonb, '[{"author":"Harald Allmendinger","rating":5,"text":"Very nice resort. Lovely pool. Unfortunately, it''s a bit of a walk from the beach (4 minutes 😉). We''re here over New Year''s, so I can''t say anything more specific about the pool. But we''ll be back.","time":"a year ago"},{"author":"didier viette","rating":4,"text":"Well-kept place, pleasant, 700 m from the beach and town on foot. Very low carbon footprint. A bit of unpleasant wind at times. Much better than Saint Tropez","time":"a year ago"},{"author":"Christine Winterstein","rating":4,"text":"Beautiful apartment in Le Lavandou! Quiet, shaded street, swimming pool next door, and the beach a 10-minute walk away. Perfect for a week''s holiday.","time":"a year ago"},{"author":"Yassine Hamlat","rating":5,"text":"This place is a total joy. The weather is nice and warm.","time":"5 months ago"},{"author":"Marie France Forest","rating":5,"text":"Apartment for 2 adults, refurbished, Domaine d''Azur 1 👍👍👍","time":"a year ago"}]'::jsonb,
    TRUE, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'fr-045', 'Domaine de Valbonne', 'Provence', 'Gard', 'Valbonne, Gard, France', 'A beautiful domaine offering weddings and events in the Provencal countryside. Features elegant grounds, refined reception spaces, and the warm hospitality characteristic of the South of France.',
    50, 200, 15000, 40000, 'EUR',
    'https://www.domainedevalbonne.com', NULL, 'https://maps.google.com/?cid=12473658611606002745', ST_SetSRID(ST_MakePoint(4.575772199999999, 44.2486839), 4326)::geography,
    '{"instagram":null,"google":"https://www.google.com/search?q=Domaine%20de%20Valbonne%20Provence%20wedding%20venue&tbm=isch"}'::jsonb, NULL, NULL, '{"url":"https://static.wixstatic.com/media/314229_94b097b22ad04b82a093401ebef89155%7Emv2.jpg/v1/fit/w_2500,h_1330,al_c/314229_94b097b22ad04b82a093401ebef89155%7Emv2.jpg","source":"og_image"}'::jsonb, '[{"url":"https://www.frenchweddingstyle.com/wp-content/uploads/2025/05/domaine-de-valbonne-wedding-venue-provence-lavender-fields-3-scaled.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQymyxc3sUs2YX_phTXIQ9kHQuH9WBBhc9uB08i4EcIAUbQ3lgO&s","source":"google"},{"url":"https://static.wixstatic.com/media/11d052_768ccf3df48f4ba3a937761e5a78058a~mv2.jpg/v1/fill/w_280,h_377,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/MariagecoralieetMariusjour2-1058_jpg_1280.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5shgqBwswH9qm4mihFIBpxqHZM9mta96y43DGJVSGUTLpoFY&s","source":"google"},{"url":"https://www.frenchweddingstyle.com/wp-content/uploads/2025/03/wedding-location-provence-vineyard-estate-panoramic-views-domaine-valbonne.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPYU77MdQs3jx4EVihqr5Nu0uI26N8sJz7ruBfpSfkPD39EwgJ&s","source":"google"},{"url":"https://static.wixstatic.com/media/314229_36d0c11f3c4147299e49002e071897bb~mv2.webp/v1/fill/w_280,h_306,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Domaine_de_Valbonne-19_jpg_1280.webp","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNw2UZ70d1WAaJJUf1OvgS-judd2JzO13MUXd1Pfs6YE1OMmY_&s","source":"google"},{"url":"https://static.wixstatic.com/media/314229_94b097b22ad04b82a093401ebef89155~mv2.jpg/v1/fit/w_2500,h_1330,al_c/314229_94b097b22ad04b82a093401ebef89155~mv2.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm073nK3GaTtfynyl07CQEEl-_hBfYx_PfKr9gTPLhtto-RwI&s","source":"google"}]'::jsonb,
    'https://www.youtube.com/results?search_query=Domaine%20de%20Valbonne%20Provence%20wedding', 'ChIJeWXGh6intRIROZxEQmtWG60', 5, 175,
    '2094 Chem. de Gavanon, 30130 Saint-Paulet-de-Caisson, France', '06 07 13 68 56', 'https://www.domainedevalbonne.com/', 'OPERATIONAL',
    '["establishment","point_of_interest"]'::jsonb, '{"weekday_text":["Monday: 9:00 AM – 5:00 PM","Tuesday: 9:00 AM – 5:00 PM","Wednesday: 9:00 AM – 5:00 PM","Thursday: 9:00 AM – 5:00 PM","Friday: 9:00 AM – 5:00 PM","Saturday: 9:00 AM – 5:00 PM","Sunday: 9:00 AM – 5:00 PM"],"open_now":true}'::jsonb, '[{"photo_reference":"AcnlKN3sZSaMNBq0Mkii7YFntx70hRhiXaDqzFr0bh9EM9ihqeXhw46B3NJ-Jg9YytM4aoSXUgbEog6b7PQODbdSoTe8XvMdB02OFWcKBsFnepM8sRb2VHCtX7nQMN1hoaOpVtKsEVfQUhUQPZsDV0CifFHy-HyI3ZkNr3-Z7gCb09jI0VwdwWOHIeVPL1jryx3PAeslZLlrJ5cP4bAcwC1Y6FZFby6qQSDpnOvhh8QiHzYGo7xEBXaAw1ClpNLWmBD9yw9q36dfVolJzMZgxJADiNU6ZGgAqOVqpUVBMbqsfLP7_w","width":1200,"height":1600,"attributions":["<a href=\"https://maps.google.com/maps/contrib/113326781502070545262\">Domaine de Valbonne</a>"]},{"photo_reference":"AcnlKN2_vW8S-ejC85pCoAA40cfCqN0h_OIgufDZi6yaWPLQLgwRSab0ANKQx3-xscHDZd6sJHMklfm8K-4EYLSrfDWSDUWZa1HzNgLOPaBrJZNMi7HKbfHVd6o86wYHVkDpHA_bNYGky5c9DkNqREZzKZLNtFwntL9Bxe8S2BuzOgKsvGZ6IwgexVD8NFfAYypHlbjS9YDGyTBFm5tEswsL9mQwfNrFRCthSOHhS3cHG0ZTNGWsNr4HfWeI-V2fmXOpjuwYnbD8_8PFySOvxQHWJWltA8xi6frF0UjwAySITp8r-gyBsOY-5sFsN3tCpABmA8wwhmPoF3GUKriLJgsgnDloS4hqkcZsQ-rR8jxgcK5Z2lpSz-MYokrO0lOrbXhQ5WyPmgvQ5ZR1b6deKuPqDZ3mCK8CBsYN8dOxxpvWl4ZhicBR","width":1600,"height":1200,"attributions":["<a href=\"https://maps.google.com/maps/contrib/107716018749402265774\">Rama Chahine</a>"]},{"photo_reference":"AcnlKN1LEqmbJXItBlkIW4mPnhPdAAMae4IZtBJ1TOyBxbNR33FocelKbF_c3anhVfDCOhXUf4WvvvKswpnmJEuJWlwBHyZHdwnwnd0b_BpaLdBVSbfVEjZpJ2w3DPduPLAA9MmXOiKh3mwu1su39o67uTH-ipSb-s2ZadFYslcwzFuXGHSOrCi06Pv45cYs7teV7iCpgv8lTU-JRgYb8Eqxn4UuqbN_ruxGiTTGTNh9lBdoTeM7OuaWKa0v2MMUSF5F8dzTaj_bN0p3q_EzfwpiBzfwPZcaHMWn9MvoH6TskDIpNw","width":4800,"height":3199,"attributions":["<a href=\"https://maps.google.com/maps/contrib/113326781502070545262\">Domaine de Valbonne</a>"]},{"photo_reference":"AcnlKN1vMiEYut4s4MAH2hi_AYjduP9DEQNQOfgLjjdJlVADVaT-Ftz4YqlgZyGq3E7eFNiCORyLkgSxaXRaaIYiYkZQvaZd98oE99t_UXunt1raqVc3sEvzzNHHmEqzduFUKxPwxDtPJ6gvS1W7vJ1snMkdQWUle0yu_D4u1q_o9IHTA7-lk6T7kwlu8pf2wwvQnPgpIZlxPxaiZjSD7UcsiC7bajK7X0Y2Up1o-sxym7K8I7GJAJpAumoQwfuqTpS9tS54TiaQ3BE-iflj2l5apG-HgCySW-l3a1n5k5Auyksjmw","width":4800,"height":3200,"attributions":["<a href=\"https://maps.google.com/maps/contrib/113326781502070545262\">Domaine de Valbonne</a>"]},{"photo_reference":"AcnlKN0v2Wvy6hxMIF-7KQM-T58V5dJidEzp6YlCgcDmicPBtPr3R34DOueEaZjaR7ojen03_PeWYRk5DK3cUO8z1UtyaDvzh5ghVaM7apj-EoL4gQ5SmjyFv7uHfXowj8UHZx1H99e1DH3R6S2ykWwH-M2e8Nm4pgzX0nQpLNJ90XGpWuGVwvHojoG-8Me6BeBC5iZxHegdzgn-EDKTvxnS9saTS_l-GC8Vf77IMpDApOuKCVpmIjCmvI9Oyqsukbk8A01eQ9Y9ufupY9wyxaa9GFJomfJZU1AaEdRRgOs0L5o9VsI3vw_ji0OqcD9OD62WDjmnss5pbq6RV98jwFbz45cW85rqGRdGGWVrUE2ENnHftF7pQSiP6H75XUVcArNhVqaugt8-qLSR1Rtb1WPdNj_vgOHajzDpv_2ermAphfKw3gWh","width":1024,"height":683,"attributions":["<a href=\"https://maps.google.com/maps/contrib/100138121860310499296\">Othmane Benzair</a>"]},{"photo_reference":"AcnlKN0IJ5EKoyE3aWjtzfZ17D51h_c7JZcdIxStITnrt1wK4Ji469UXVINFvazePq27m2LWZr7DGwjpxFbXMLukafHQWlR-KxJ7A0gqX62bo_6VswrTrVBucpobrJaDKBIS6yiUpv8_wIcvx-hf9p74bFPRTdiIWz1YOqlyb09HxGoc_D_5RR5Hilc33nFnDgmDNrCY72K1nDhpCeYXtypqyKZlTb-gFJEe-g5x6eDG_eAE53RtazJsObDVpBKSVCevD7kJu-evJmCuJAWQ2iC1Bt8rI7OIsnlzhHs86EFLaEEqSzcM-i206rk5FgQ_WoM8l6LQ0vYXLrKKVOgvgOW1sTB2XOtCbAbSPOfULlpWRKzzWHvbP42BhzTESbNTItVe353V6rx_g2_AlYRT6KjMluOYXXR7gXabQTdso60Fe27PZGJ4","width":1024,"height":1536,"attributions":["<a href=\"https://maps.google.com/maps/contrib/107368524718358368106\">Florent Sciberras</a>"]},{"photo_reference":"AcnlKN17UVUKVnBBUB1KRblau28z_AVVgVp4aycW0VhBHMzNeogUN8lh3r1cEWFHbUfUY7k71gwu7okLl4ithkXRIS5cUXVQhAFFzO4Nq-s_KMrXw2sT4-Z_FpaXQ76wjPhK_StV71kSXIGFPly0e4n0E7oigrk7xgStUAS29jAJfhmQWG_Zcj8vktbRoJcTEyW9RZUI5t3cgVGU15ZMnVMFh1RmbBP3D6QGGXUU0xBleMD6de1SY4tJRkziufobhKFXKUIkdifpQNGWHTGR2D7iMPHY3PJLoz_ikJO9tRdzM0PZFIdizJ4SZ3s0ALFlzuDRrAlOfXfZFt_P3dfyhcIpt9cLPP_ne4xZUf3GxcpzwT8_auzkvCdxiU4AgZGxDzmMyShqwar5ZBHco-Dc86J8UEHaR4Bo98OmqvZqhCZGXKUMOjry","width":4032,"height":3024,"attributions":["<a href=\"https://maps.google.com/maps/contrib/101476919670946658497\">Flore Chambon</a>"]},{"photo_reference":"AcnlKN3EE53IMkiq49YJTCDssqS2ngbsE33v_6qrj4DOc2WnhngbGEZ4irAbar-gV4tzuAqem6-Ko5P2fMM2H7wClwDcSoWikfD9yplWWqMcjz4BYtgt-Sy1aFeYOr2juhyJCNzXU0q7yjDBt5pfYEfwY7G884Lcb0rxpIIb_Wd0VRdbgiy-6HHDwNP0OrlIkAHDChEtHS_2_Z8r2DoThPUXCudmcuvqNj9fvQL38s0eSUZzdUqe6DZoVOFcIxj6VMSlv7DkEYPz7HIYtkctE3rNbAlpGlCFZLHrsE2VpKcnti_Mo8XM9hroup_y6UhggW3HdybqLv8DFirXO8nVN7yebnV0Zn8liOJHSiv-Sdi998cxdtqicDaW2Xj6Dbx1xh8eUD9beeg_3dxgmwoRQpKJ6EypHxfYv2UQdWfT6gZLxsiVJA","width":1024,"height":1536,"attributions":["<a href=\"https://maps.google.com/maps/contrib/107368524718358368106\">Florent Sciberras</a>"]},{"photo_reference":"AcnlKN3DN6k8LHu6qWDZs3mGGjrHZ9fhhxyfS7T0MESqIY8lhjuUH0QQulWD72yxdsxg1RRLBjwWzvbJXKi8o4InDCt1bZAWvo71Z7zR7j4V44aQsrRSbku0FA2B37kmm4CIqoWftbKbxvvnr3P7VmEvTHeDJGgt80tWPj8p9W8QRIrsA6xcoeDNBHWmohK46uQDgoqmxh1TFeBRAcEmV_v9giG7wGNc3GMy3Qe_RpREsA5o2CJxEIUJYoUG5q_H4GmvtB5XNR2H91K6uEDcDDX85yQWJyBcudBPfM1AzgUKtdum4OezlZU6KAcurtO5Zvs9i8c7HanifOeD_HkUNeWD1kIm5fmGPGD1yBBa06iC-ZcWKYW8aEpmyproFGlAZbJLL8wW-ERRxf_i0TB9s25_gixTFY2KlKn2a5WmDxUzrVk","width":4800,"height":3200,"attributions":["<a href=\"https://maps.google.com/maps/contrib/105211633358989595051\">Marie Thizy</a>"]},{"photo_reference":"AcnlKN2B_Z_IMmPmFYSKM55AHCrkQ_LJmXuQv4HlSpjdCNeVtchitB5isoTAq5LBSb39SjIqEszGTkyCwmrDOGPuFlZ8gxjXV0nf0KZsD-mANeR_s25d1C4zt1BmXo5tA8yGq0ywagYhuhQ9Aq-LA1K_XrxO2Hgq2AI7WjJJyL-NYD1zfoxb6pLE5oLAKnIfH0LOLYGKpBsJUxMUHKBfVAGuSr66_UXV52oBU4IbKhb1mcUoySerNdsZLKuRj1HOyJfWaY05XMpSsFnckYeQZ8E_1wj8LEH2x2aZtVxpgfoPBPeoB929dbb3I4seg-26TmjjObqj2-qlz2JRYHIUwAibRYTPZRP-MDEjn4geCVZqDFA7BcXup4RxHH1RKzsK1nPYPDct7FVzIctjQL0TpYAJGTE4b_0afGdcPlIOsvmfz58XOjw","width":4032,"height":3024,"attributions":["<a href=\"https://maps.google.com/maps/contrib/106596045004523956980\">Guillaume C.</a>"]}]'::jsonb, '[{"author":"Hattie Jones","rating":5,"text":"We had the most incredible wedding at Domaine de Valbonne in June 2025. The venue is absolutely stunning – the perfect setting for a full weekend of celebration. We fell in love with it the moment we first visited.\n\nEstelle and Julien were fantastic throughout the entire planning process, offering helpful recommendations and keeping us updated on improvements to the property. Every room and indoor space is beautifully designed, and the grounds, especially the pool area – are truly unbeatable.\n\nWe really wish we could do the whole thing again and would highly recommend Domaine de Valbonne to anyone looking to get married in the South of France!","time":"4 months ago"},{"author":"Natasha E","rating":5,"text":"We were lucky enough to have our wedding at Domaine de Valbonne in October 2023, from the moment we first visited we knew it was perfect and we booked it there and then.\n\nJulien and Estelle are exceptional hosts and we felt in very safe hands knowing that they had everything under control, they have meticulously thought through every detail to make it the perfect wedding venue. With their expertise, alongside the wonderful Julie (Festidays Planner) we were able to fully relax and enjoy every moment.\n\nOur wedding was held over three days and many of our guests were able to stay in the accommodation which was really important to us when looking for a venue.  It was so wonderful to see different friendship groups and families getting to know each other, many guests that met at our wedding have kept in touch and meet up with each other now!\n\nThe wedding was mid October, it was warm and sunny but not too hot to be in the sun so we were able to make use of the beautiful olive grove for our ceremony.  Julien suggested we use the stretch tent above the courtyard in case it got colder in the evening and there were heaters available if needed.\n\nThank you so much to the whole team of Domaine de Valbonne, along with all our wonderful team of suppliers for giving us such a magical wedding. We wish we could do the whole thing again and wouldn’t hesitate to recommend this venue to other couples planning their wedding.","time":"a year ago"},{"author":"Arnaud Waehlti","rating":5,"text":"Without hesitation a 5 STAR REVIEW!!! We celebrated our wedding at the Domaine de Valbonne over three days in June 2024. Not only the location is absolutely a piece of paradise on earth but the owners, Estelle and Julien, are amazing people that genuinly make every effort for things to go as best as possible. From the very first touchpoint we had with them to their continuous availability during our wedding weekend, both of them were incredibly friendly, helpful and ressourceful! Their positive attitude and energy made the whole organization of our wedding so easy and joyful. Both my wife and I could not be more grateful to them and happy on how our wedding went. Everything was absolutely perfect. I genuily do not think we could have find another place like this one in Provence. A very big THANK YOU to Estelle and Julien, and everyone else who supported during our wedding! We''ve made memories for the rest of our lives.","time":"a year ago"},{"author":"Annika Evans-Oravecz","rating":5,"text":"If you are searching for a venue for your wedding in the South of France, look no further. The Domaine de Valbonne is the best of the best venue in Provence, and we had an incredible wedding weekend there in August 2023. The owners and caretakers, Julien, Estelle, and Victor take amazing care and attention to detail in everything to bring your wedding experience to the next level. They were present for any troubles the entire weekend and helped coordinate with the vendors, wedding planner, and the guests to ensure everything ran smoothly. In addition, the Domaine has a collection of beautifully restored old timer cars that the owners allowed us to have around for photos and use as an entrance into our wedding day dinner. We continue to think about the memories of our wedding weekend here fondly. We were so lucky to book this venue, and would highly recommend to anyone in search of a beautiful provencial wedding venue that can host people for an entire weekend. Perfect for destination weddings and full weekend celebrations. We hope to return for one of our anniversaries in the future!","time":"2 years ago"},{"author":"L P (LP)","rating":5,"text":"We chose Domaine de Valbonne for our wedding in august and we are still thinking about the weekend every day. The venue is incredibly stunning, the atmosphere and the vibe was even more beautiful than we imagined and the owners Estelle and Julien make Domaine de Valbonne complete. They are very supportive and responsive throughout the entire weekend and Julien (a hands on guy) is with you straight away if something needs fixing or if one of your guests loses his wedding ring (do not worry, Julien will find it) You can tell that they are both very passionate about their Domaine and they put a lot of hard work into it and that gives this place its unique and special character. This shall be our one and only wedding but if we were to marry again, we would choose Domaine de Valbonne over and over again. Thank you, Jacky and Leo","time":"2 years ago"}]'::jsonb,
    TRUE, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'es-047', 'Bell Recó', 'Catalonia', 'Barcelona', 'Veïnat Pins, s/n, 08310 Argentona, Barcelona, Spain', 'A stately home built in 1940 offering exclusive spaces for luxury weddings near Barcelona. Features over 5,000 m² of landscaped gardens with fountains, ponds, and terraces, alongside artistic interior rooms. One of the most renowned venues for luxury events in Barcelona with complete exclusivity for each celebration.',
    50, 500, 15000, 50000, 'EUR',
    'https://bellreco.es/en/', '+34 932 000 990', 'https://maps.google.com/?cid=18234913306838906340', ST_SetSRID(ST_MakePoint(2.3776987, 41.5777378), 4326)::geography,
    '{"instagram":"https://www.instagram.com/explore/tags/bellreco/","google":"https://www.google.com/search?q=Bell%20Rec%C3%B3%20Barcelona%20wedding%20venue&tbm=isch"}'::jsonb, '[]'::jsonb, NULL, '{"url":"https://super-weddings.com/wp-content/uploads/2023/02/bell-reco-wedding.jpg","source":"og_image"}'::jsonb, '[{"url":"https://cdn.wezoree.com/upload/user_photos/16569/preview-venues-bell-reco-portfolio-photo-338752.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHK233-KxaTondpiZSewapr8s8KBxmQ04SNuJgdUCRjG-FDF8z&s","source":"google"},{"url":"https://cdn.wezoree.com/upload/user_photos/16569/preview-venues-bell-reco-portfolio-photo-338758.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUrqC0yIcLx3AjnjDwJ_8LUcvZbtcwVk305Fv_Om0bZGY8tEc&s","source":"google"},{"url":"https://bellreco.es/wp-content/uploads/2024/02/comedor-jardin-bell-reco-1-450x400.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFV0O-NlDxYejoLbBUm0fvFVTC7BuSO2VQDyTZrMVI-cmpsxt5&s","source":"google"},{"url":"https://bellreco.es/wp-content/uploads/2024/02/bell-reco-zona-agua-8-scaled-450x400.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUf4AP3FAqeX7A38WiSHplxSF37H748RjZgbYZ-Uet36kWk3k&s","source":"google"},{"url":"https://cdn.wezoree.com/upload/user_photos/16569/main-venues-bell-reco-portfolio-photo-338764.jpg","thumbnail":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDkhYJ7qX91nFhKSr-nCzcTPcB2hSx-KJtvacuemN2ZhYizNYO&s","source":"google"}]'::jsonb,
    'https://www.youtube.com/results?search_query=Bell%20Rec%C3%B3%20Barcelona%20wedding', 'ChIJyd9tFP7JpBIR5DUtNAptD_0', 4.7, 358,
    'Veïnat Pins, s/n, 08310 Argentona, Barcelona, Spain', '932 00 09 90', 'http://www.bellreco.es/', 'OPERATIONAL',
    '["establishment","point_of_interest"]'::jsonb, NULL, '[{"photo_reference":"AcnlKN3841VXerX8mrPEl-b7J7cDUAqN22opK5JmtEb0AeWCPLtd-LW1LkNCnxJkXcDXFFOTQs7wFXUia-ajPSmG_0bcZMpniHJPIj8eLLS6S4Bfy7pgqDiZdBZmkmz87eyNgBhpBQkBgcqhetoAPM8qkB9I558shwDCAolYSlOidyejtiH-m3F88YUDHSHmpeJTP6iVcDIBbppGsvFUqWXw4sogR3TDpWaDkYgxU3q5sGHBQlTigXsNKyVbksERCOZ4brgHAUGmmQ4ushZjk9ERyPyNJL_S61lqcEafYluPHf0RhQ","width":2126,"height":1417,"attributions":["<a href=\"https://maps.google.com/maps/contrib/109779278929146373414\">Bell Recó</a>"]},{"photo_reference":"AcnlKN1CHZFicb6IFXzy5DQoB9vgmdEB00poKlgoy1O5BNU6G5_y_1VBRQFeUIxQw-EpmvOqtu1Z2C9qUP1ciTHzZ_1EBU_monwr97GVS1ejCqlRbQSjOFRq_j9ZGt3yhaW6Z8YUZPOBXxoJyGWHq-nnIK2gzBes0LLxP6Mip5iV2Gr5zIhbtpxuSauu2qynSX4v-rI2bXpgGRSOtyTrRfqATCSerkBmjhnv8Dtt_ZWiPbSZI-sHH-RiLSZfagiUoSNMLkIHu4OkmfA7SHsAi83OUJW6xDQ-dkgPr0nnuBXC_8KX1DS69rfDhAuH914YvBFsByP_x0rSfvfWT_OV-NX_SuuILa8f4c55iNXGZwrzmqRgBh-ssDyuJzUrBDfKV1rOjpmEcjCYBL896N-9-p8FwuuyWkU8w5wNJKn-hyXOGBs","width":4624,"height":3468,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114551891834436565086\">Göran Olsson</a>"]},{"photo_reference":"AcnlKN2_YmCpWDtw63V2pEEEQegPhs3eljAxZNIgdlQTLxKFRXDmL5xbeEROB1SP-_WiOyViwirxyubYgh6BTJt6wO9gl3Mf1OizwmKNKgxRWqau83hCgwssmjACugm-DTleWM-H5FKv9Gp5fAOszpLLhaV_GakIKdBdKs697DCSK3Atjm3Tuc3PEHB9I_84N7a0sdvqWBIEZutpQFJpO-6Yf93HkxCmWSwxBplN7D_b5hR5d3dBrkQpHz-ZGXcfBaygeWI4Jy0iA2fGzz4fFULENI-Si-kpMoSoLoL8g7Pv3GyHvpz3XP0GR2-4Bx5c4piEZdWa34kvXquYrQlcRJR4H2ZQQeHImUF2MK2oJjYDe8Vvwg4bhmVDcvU-0rlw7p9SrgExX9SJxZa7WKiT_rU5SX9kxfiDTq4ddqQO8FX7FJK066kdZqMmnxpCBM4fvFlG","width":3024,"height":4032,"attributions":["<a href=\"https://maps.google.com/maps/contrib/105830462483646245508\">Claudia Calderon</a>"]},{"photo_reference":"AcnlKN0KcJyh5uF4Hd-Rvl2K5acVqVza_n86_8ohrAkONVJstSqU55anTpnMHiA4rf71gy7mXfUu6CA53dhXgAjO9fhC81rF-gqEKY98-SkrB3FXlNXNlT7_eY9mWLfuXtoGL4f3h2x9pC20vngn9Yzs23RzpKSQmSBYAM7VUq90c7dU-r7jfHimvhUYUqxJHrQgEXWF0GPNGC7U8EsuNrttJzZhKpwMDf25pkdEYjVtJ9aIzTkEYRjrtjKPBx_Zxlx9i8DRXg-i9Ar0aVRHOEkjLsKUbgnw3QT5OltpwlFegc9cO2iw1v5qCDdowoX4BOhBS_h0dOuQ1XcwSDrQ5sYO2JPeqYIMp2Si03DwvJT1jsB78Aui0-6y4wiR0OczI1wi2VmcXWK-k9hCL64KhtbuIEqa2aAUUPXQDV6gfDGx53MiNPay","width":4800,"height":3201,"attributions":["<a href=\"https://maps.google.com/maps/contrib/117927572166080395712\">Andrea Ferrara</a>"]},{"photo_reference":"AcnlKN0qayLaRnZGlfwQdMJf_9Zer0HCIqRZbmpKnQ-wDqWD3NPYFSWcNqVsDguM3CcS84hn7dAvFGwMBh59sW9gQFGZp005vkEYqmMJec6w67JTSMdDkJQdua-mt9oaoIB2zvJ1hS37unTiI62B9a1eYp89W8NzVGkjz0KuyKSX34PoadlGsWoq-82Yusa3T9l6bFdSUUeXg1dG6C2_4r05q1lSKUjL7i18Xws09VXEDs-ft2BMclaFmrSCcPTu4OK-Ur6Fwu6we5Ct3111oEwlzuqMX9aRuCZWDxdH-Vraiki-38bv4kn9atRjlpFD06mHWuy0Rnq3pXe-GYdkpOp4ZSsVxQreC7GhJpf8ni-mC6OmpM-CNWHoYP3yPIEz7pWz8TJPKGZjZOX0vv8CLkwocCxiwnIg5gPb5U-DctsohM2y7g","width":4000,"height":3000,"attributions":["<a href=\"https://maps.google.com/maps/contrib/114923051865888561864\">Luighimi</a>"]},{"photo_reference":"AcnlKN1-fHrqSK1OvL9vULAjOHX5cZRGNckcxUq1lXV9E0j0QsuTI6lo8_v2xQ6ZPW37ux6Zm5cqq8j8P1E5wM-l9n23PyINa4zC5EJRe6K61uCuDXZR_DcemTej3ZVV8WqpDTJqVPFxctFxU1oP-fd47Tx2GY_QNTbC1DWHH9i9UeThYoN_RTfIPQe_DDbHIyMx99zL1VGVXsDbFM0WkTqSOMmglBgyJKn9Zv5j_2UTSSrcVn2pr5wm8TdtEphD8pkIrr8oxKzR7eJIp3QqQg5AREdS4vk0CpWmpSgpIWk6_UVld9uq9sXYRWkPm4klp74bHwYOkFlxmJAYI73rvAbluKkHCDAnCRBwziG1ssl72kO-drDN7dKOmvqH_m1gbDOg9mAfnj1hCbUHfkZHfnHQFEK6AKjhgDIqyBHUc75J3MWrCag","width":1848,"height":4000,"attributions":["<a href=\"https://maps.google.com/maps/contrib/115905447796872331441\">enric anega</a>"]},{"photo_reference":"AcnlKN1bKSscN3nczLBAx6Ibi6LIdJ8Z9PrALXwAdzIxoHZy_CbhU32Alf7jUd3Jo69wHqHqFYqnBH7dIh2MWi1yR9OCW_z5_fkOJCBVAt5sQ6BNWgRikkmskIhgxJqqtkOzCUHBrs8R0Pxxwkfe8_sX6oB0ERihffht-VpS4I71QGH5eSPNZzLY9XRbc0Sn7EkYk5CDsfsZous85EaTxDt4-mMQDmlTnyhOMw6ntQCwfvbn-oCpKzJtoMeViqxalI3p_Z9Mvxx9t-eS_v1f_MT59lYqcZUVB0Alnrhukj3mCqwJwSCuOaaopK3G1oe1spSe4tr0TY3S86AZlnk8QAEKtZW-Ni_VV40Pca7biQxYqCsJeNvJtBhucVrHempPBuqhX_DM4iNcQrD7-nh8kPQcbqPmcRztQTDxr0BxJfIePn5sPw","width":4032,"height":3024,"attributions":["<a href=\"https://maps.google.com/maps/contrib/116464446387440916690\">Jaspal Singh</a>"]},{"photo_reference":"AcnlKN0sHilYGx20vcwn7x9vTaqiQ-Yj7Yh6yhgHCgZ_F6DlfkIBGyQka2uQ45z96ptevv1OfGRZxGU6p-DJw3lWWibl2EiJCs1HtWsqi9UOGo6xgsxvHTIAXy8wocU3XSP8eTzDX4_B6zeY3yDKuKBeMVrxDcNR4YGefpSzmWRtotBrJK4ZG-7cV0pmjjXnfWqaR-J8rxfZgeQb8WAVYWegXv8B81yLvvR7JH7ELmU9xnH1_zpWRUH1kEgoPU6BzMpggxR6IQYaw_m6WTerrVmDanZ0LnWoAYDBMzFkK7p0mEKOcLHykVofi0T3E8IdoMNUXUXp_ezIN7OBQsyhGAoHqwrrY94T-rqJ9t4qTIjzwvI2cJyyOgYrnxfzWl2qDfKt4gl8z_ZU7Z0pWeNQf9iAq8h9lgFvkLLmhLcSrlLV84gosg","width":4800,"height":3201,"attributions":["<a href=\"https://maps.google.com/maps/contrib/117927572166080395712\">Andrea Ferrara</a>"]},{"photo_reference":"AcnlKN3l8pNvOpuSgShhJGGEEuQdem_7B1F8cDTyglAADdexXys45hcvAbYElO0y7E_IftGLf19v5qvReRbGpd0aRCHrtwx087IJBH3AUeI-QghRPp8ftRN8HdrvonCANYcTkYmftmQpa5GMU-gw_ByjdK3_7_nbgNlO-19xo_zQPrXLVB_fEiqk4qvvch2DLOF6u0AeXMC_ATq4VHQWfPJMt3Nn8BSERBEjWA0AD6eQkEYONyhJumYhdWaL-rAs5Nw06VGYYAbSCAvoEklqy9-nu0_FUpODpr0Ouza0S3Uy3kJldGrwY4X-znuQH4qPOe96Z09SwOTf9O7tvUlZWxaokZEEJRWAigJJ1YRZJWEo5UxxhLUMZxMJCJPsev7QY0hbFaep4lxiAjBIAAk4DUjheyUFp190wrklTnYDyZa2qnDT9Q","width":4032,"height":3024,"attributions":["<a href=\"https://maps.google.com/maps/contrib/109704306322893161428\">Łukasz Rasiński</a>"]},{"photo_reference":"AcnlKN39Vv_W9e6XuvG90xJd4jB5pjrJXGKHn4TrCw3n-Z2QGMavNv-hzkX71-lCdhdXhdyFPUSBWmRFT45l3QJK1WLvEythegqXSHSXuN7xs7b4JXnwLu51Mtka4-vXcKaeexopqYicuEM-5MpVSxafyPJH-z0t2BnveOBZp3ryB0gF4KoSbR6SrEkFt5nd4-muuELnJZXey8sh37irDiC6GSTkkw20tQF0MSqb0p4r4nvrZ-5phgvnvhFdsKdKR_vx11NNjxjweh2VRNflc3ICnjJhy6wzZFQKXXg4Z4f1vb_3YI4qld3DDpo_LyAmaHKsHsX427dkhxzX_WwRHEr0XNDy7N2viDC_uuln9gxfoRc4jZIvXBOGT-SczuIfXRVJAoDVuBZMQIt9oS9Ks75g-vT8S8N0Ri2LBLDl958xQaPLeVh0","width":4032,"height":3024,"attributions":["<a href=\"https://maps.google.com/maps/contrib/102596594914858812218\">Raul Candales Franch</a>"]}]'::jsonb, '[{"author":"Jaspal Singh","rating":5,"text":"June 2023 5*\n\nVisited the place for corporate dinner and really had a good time. The place is really nice and has lots of history.\n\nThe building is old and well maintained. There are lots of artifacts and old paintings inside the building.","time":"2 years ago"},{"author":"Paul Blount","rating":5,"text":"Crazy beautiful place!","time":"2 months ago"},{"author":"Alyra Liriano","rating":5,"text":"We wanted to take additional wedding photos and Bell Recó was the best venue for the job! Victor and Patricia had excellent communication, answering all of our questions within 24 hours. The day of the photoshoot, my husband and I got to meet them as well as Mrs. Navas, the owner of the beautiful estate. She was warm, welcoming and extremely accommodating. The estate is simply breathtaking. I highly recommend for a photoshoot and, even better, for your special wedding day!","time":"3 years ago"},{"author":"David Jenkins","rating":5,"text":"The place is like something out of a fairytale! Amazing venue that you quite simply have to see. It was used for a gala dinner with some awesome entertainment and delicious food.","time":"3 years ago"},{"author":"Zéphyr et Luna","rating":5,"text":"I had the pleasure of planning an elopement at the Bell Reco and I can only recommend this fairytale place. My couple had such a beautiful ceremony and an amazing photoshoot there afterwards, we had so much fun and loved the place!","time":"4 years ago"}]'::jsonb,
    TRUE, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-023', 'Wildwood Acres Resort', 'North Bay', 'Cloverdale', 'Cloverdale, Mendocino County', 'Wedding venue in Cloverdale, Mendocino County. Starting packages from $8,467.',
    120, 400, 8467, 21168, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-024', 'Hacienda De Las Flores by Wedgewood Weddings', 'North Bay', 'Moraga', 'Moraga, Contra Costa County', 'Wedding venue in Moraga, Contra Costa County. Starting packages from $6,822.',
    60, 200, 6822, 17055, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-025', 'Pacheco Ranch Winery', 'North Bay', 'Novato', 'Novato, Marin County', 'Wedding venue in Novato, Marin County. Starting packages from $4,500.',
    60, 200, 4500, 11250, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-028', 'St. Francis Winery', 'North Bay', 'Santa Rosa', 'Santa Rosa, Sonoma County', 'Wedding venue in Santa Rosa, Sonoma County. Starting packages from $7,000.',
    60, 200, 7000, 17500, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-029', 'Merryvale Vineyards', 'North Bay', NULL, NULL, 'Wedding venue in California. Starting packages from $17,944.',
    30, 100, 17944, 44860, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-022', 'Golden Gate Club at The Presidio', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $14,240.',
    66, 220, 14240, 35600, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-023', 'Venture Retreat Center', 'Peninsula', 'Pescadero', 'Pescadero, San Mateo County', 'Wedding venue in Pescadero, San Mateo County. Starting packages from $6,800.',
    45, 150, 6800, 17000, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-030', 'Sea Ranch Lodge', 'North Bay', 'Sea Ranch', 'Sea Ranch, Sonoma County', 'Wedding venue in Sea Ranch, Sonoma County. Starting packages from $45,773.',
    33, 110, 45773, 114433, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-031', 'Sonoma Coast Villa', 'North Bay', 'Bodega', 'Bodega, Sonoma County', 'Wedding venue in Bodega, Sonoma County. Starting packages from $4,000.',
    30, 100, 4000, 10000, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-024', 'The Hibernia', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $41,712.',
    225, 750, 41712, 104280, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-032', 'Winchester Estate by Wedgewood Weddings', 'North Bay', 'Meadow Vista', 'Meadow Vista, Placer County', 'Wedding venue in Meadow Vista, Placer County. Starting packages from $7,713.',
    45, 150, 7713, 19283, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-033', 'Sterling Hotel by Wedgewood Weddings', 'North Bay', 'Sacramento', 'Sacramento, Sacramento County', 'Wedding venue in Sacramento, Sacramento County. Starting packages from $6,826.',
    60, 200, 6826, 17065, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-034', 'San Ramon Waters by Wedgewood Weddings', 'North Bay', 'San Ramon', 'San Ramon, Contra Costa County', 'Wedding venue in San Ramon, Contra Costa County. Starting packages from $6,760.',
    75, 250, 6760, 16900, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-035', 'Jefferson Street Mansion by Wedgewood Weddings', 'North Bay', 'Benicia', 'Benicia, Solano County', 'Wedding venue in Benicia, Solano County. Starting packages from $6,604.',
    60, 200, 6604, 16510, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-036', 'Stonetree Estate by Wedgewood Weddings', 'North Bay', 'Novato', 'Novato, Marin County', 'Wedding venue in Novato, Marin County. Starting packages from $8,664.',
    60, 200, 8664, 21660, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-025', 'The Pearl', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $9,503.',
    144, 480, 9503, 23758, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-026', 'Log Cabin at the Presidio', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $10,927.',
    36, 120, 10927, 27318, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-027', 'Chambers eat + drink', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $26,070.',
    45, 150, 26070, 65175, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-028', 'Beacon Grand, A Union Square Hotel', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $22,226.',
    60, 200, 22226, 55565, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-029', 'Bay Lights Charters', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $8,581.',
    15, 49, 8581, 21453, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-030', 'James Leary Flood Mansion', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $16,019.',
    50, 165, 16019, 40048, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-031', 'San Francisco City Hall', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $10,863.',
    900, 3000, 10863, 27158, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-032', 'The Olympic Club', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $12,763.',
    90, 300, 12763, 31908, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-033', 'Fairmont San Francisco', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $10,523.',
    105, 350, 10523, 26308, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-034', 'SF Museum of Modern Art', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $8,690.',
    180, 600, 8690, 21725, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-035', 'The University Club of San Francisco', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $17,360.',
    45, 150, 17360, 43400, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-036', 'The Westin St. Francis', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $21,725.',
    225, 750, 21725, 54313, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-037', 'Marines Memorial Club & Hotel', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $10,933.',
    81, 270, 10933, 27333, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-038', 'Bimbo''s 365 Club', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $36,777.',
    135, 450, 36777, 91943, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-039', 'The Marker San Francisco', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $12,460.',
    60, 200, 12460, 31150, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-040', 'City View At Metreon', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $24,782.',
    150, 500, 24782, 61955, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-041', 'Wayfare Tavern', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $33,131.',
    15, 50, 33131, 82828, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-042', 'Julia Morgan Ballroom at the Merchants Exchange', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $32,589.',
    150, 500, 32589, 81473, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-043', 'Presidio Chapel by Wedgewood Weddings', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $13,246.',
    45, 150, 13246, 33115, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-044', 'The Walt Disney Family Museum', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $8,690.',
    39, 130, 8690, 21725, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'pen-045', 'Legion of Honor', 'Peninsula', 'San Francisco', 'San Francisco, San Francisco County', 'Wedding venue in San Francisco, San Francisco County. Starting packages from $10,863.',
    129, 430, 10863, 27158, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-037', 'Palm Springs Club', 'North Bay', 'Palm Springs', 'Palm Springs, Riverside County', 'Wedding venue in Palm Springs, Riverside County. Starting packages from $1,052.',
    15, 50, 1052, 2630, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-038', 'Monte Verde Inn', 'North Bay', 'Foresthill', 'Foresthill, Placer County', 'Wedding venue in Foresthill, Placer County. Starting packages from $8,044.',
    66, 220, 8044, 20110, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;

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
    'nb-039', 'Olivas Adobe', 'North Bay', 'Ventura', 'Ventura, Ventura County', 'Wedding venue in Ventura, Ventura County. Starting packages from $474.',
    60, 200, 474, 1185, 'EUR',
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, NULL,
    NULL, 'json_migration'
  ) ON CONFLICT (id) DO NOTHING;