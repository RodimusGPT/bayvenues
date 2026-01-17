#!/usr/bin/env node
/**
 * YouTube Search Script for /enrich-videos command
 *
 * Returns multiple video candidates with full metadata for Claude to evaluate.
 *
 * Usage:
 *   node scripts/youtube-search.mjs "Villa Rufolo Ravello wedding"
 *   node scripts/youtube-search.mjs "Le Sirenuse Positano wedding" --max 5
 *
 * Output: JSON array of video candidates
 *
 * Uses: VITE_GOOGLE_MAPS_API_KEY from .env (same key as Google Maps)
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env file manually (VITE_ vars aren't auto-loaded by Node)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
let envVars = {};
try {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
} catch (e) {
  // .env not found, rely on environment variables
}

// Use the same Google API key as Maps (works for YouTube Data API too)
const API_KEY = process.env.YOUTUBE_API_KEY
  || process.env.VITE_GOOGLE_MAPS_API_KEY
  || process.env.GOOGLE_API_KEY
  || envVars.YOUTUBE_API_KEY
  || envVars.VITE_GOOGLE_MAPS_API_KEY
  || envVars.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error(JSON.stringify({
    error: true,
    message: 'No Google API key found. Set VITE_GOOGLE_MAPS_API_KEY, YOUTUBE_API_KEY, or GOOGLE_API_KEY'
  }));
  process.exit(1);
}

// Parse arguments
const args = process.argv.slice(2);
let query = '';
let maxResults = 5;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--max' && args[i + 1]) {
    maxResults = parseInt(args[i + 1]);
    i++;
  } else if (!args[i].startsWith('--')) {
    query = args[i];
  }
}

if (!query) {
  console.error(JSON.stringify({
    error: true,
    message: 'Usage: node scripts/youtube-search.mjs "search query" [--max 5]'
  }));
  process.exit(1);
}

async function searchYouTube(searchQuery, max) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('q', searchQuery);
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', max.toString());
  url.searchParams.set('order', 'relevance');
  url.searchParams.set('key', API_KEY);

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    return {
      error: true,
      message: data.error.message,
      code: data.error.code
    };
  }

  if (!data.items || data.items.length === 0) {
    return {
      error: false,
      query: searchQuery,
      results: [],
      message: 'No videos found'
    };
  }

  const results = data.items.map((item, index) => ({
    rank: index + 1,
    videoId: item.id.videoId,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    title: item.snippet.title,
    description: item.snippet.description,
    channel: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    thumbnails: {
      default: item.snippet.thumbnails.default?.url,
      medium: item.snippet.thumbnails.medium?.url,
      high: item.snippet.thumbnails.high?.url,
      maxres: `https://img.youtube.com/vi/${item.id.videoId}/maxresdefault.jpg`
    }
  }));

  return {
    error: false,
    query: searchQuery,
    totalResults: results.length,
    results
  };
}

// Main execution
searchYouTube(query, maxResults)
  .then(result => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch(err => {
    console.error(JSON.stringify({
      error: true,
      message: err.message
    }));
    process.exit(1);
  });
