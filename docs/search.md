# Enhanced Search Functionality

This project now includes an enhanced search system that indexes GitHub repository information to provide better search results in the Command Palette.

## How It Works

### Build-Time Indexing
- During the build process, the system fetches repository metadata from GitHub API
- Extracts descriptions, topics, and language information from repository data
- Creates a searchable index stored in `public/search-index.json`
- The Command Palette uses this index for fast, intelligent search

### Search Features
- **Name matching**: Direct matches on API/Event names (highest priority)
- **Description search**: Searches through GitHub repository descriptions
- **Topic matching**: Matches against GitHub repository topics
- **Language matching**: Searches by programming language
- **Keyword matching**: Matches against extracted keywords and synonyms
- **Repository name search**: Searches repository names
- **Smart scoring**: Results are ranked by relevance

## Development vs Production

### Development Mode
```bash
npm run dev
```
- Uses `scripts/build-search-index.js`
- Generates basic search index without GitHub API calls
- Keywords are generated from description and topics
- No README content is fetched (faster, no API limits)

### Production Build
```bash
npm run build
```
- Uses `scripts/build-search-index.js`
- Fetches repository metadata from GitHub API
- Extracts descriptions, topics, and language information
- Requires `GITHUB_TOKEN` environment variable for private repos

## Environment Variables

### GITHUB_TOKEN (Optional but Recommended)
Set this environment variable to avoid GitHub API rate limits:

```bash
export GITHUB_TOKEN=your_github_personal_access_token
```

Without a token:
- Limited to 60 requests per hour
- May fail for private repositories
- Build process will be slower

With a token:
- 5,000 requests per hour
- Access to private repositories
- Faster build process

## Search Index Structure

The generated `search-index.json` contains:

```json
{
  "apis": [
    {
      "name": "API Name",
      "url": "https://github.com/...",
      "description": "GitHub repository description",
      "keywords": ["keyword1", "keyword2", "..."],
      "repository": "owner/repo",
      "language": "TypeScript",
      "topics": ["api", "microservice", "nodejs"]
    }
  ],
  "events": [...],
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

## Keyword Generation

The system automatically generates relevant keywords:

### From Repository Data
- **Primary source**: GitHub repository topics (most accurate and relevant)
- Extracts meaningful words from GitHub repository descriptions
- Adds programming language as a keyword
- Includes name components as keywords
- Fallback to generic API keywords only when no topics exist

### Example Keywords Generated
Based on the test data, here are real examples:

- **Atlas**: `["atlas", "deployed-with-webhook", "pricing-geo", "ruby", "address", "lookup", "service"]`
- **Auctions**: `["auctions", "pod-dispatching", "go", "reverse", "dutch", "auctioning", "dynamic"]`
- **Geoservice**: `["geoservice", "directions", "estimation", "geolocation", "geospatial", "hotspots", "locations", "go"]`
- **Chat Service**: `["chat", "service", "guest-ride-experience", "twilio", "go", "backend"]`

Topics like `pricing-geo`, `pod-dispatching`, `guest-ride-experience` provide much more accurate search terms than inferred keywords.

## Performance Benefits

### Build-Time Processing
- Zero runtime performance impact
- No API calls during user interactions
- Instant search results
- Works offline after initial load

### Optimized Search
- Pre-computed keywords and descriptions
- Efficient scoring algorithm
- Results sorted by relevance
- Fallback to basic search if index fails to load

## Customization

### Adding Custom Keywords
Edit the keyword generation logic in:
- `scripts/build-search-index.js`

### Modifying Search Scoring
Update the `calculateScore` function in `src/hooks/useSearchIndex.ts`

### Search UI
Customize the search interface in `src/components/CommandPalette.tsx`

## Troubleshooting

### Search Index Not Loading
1. Check if `public/search-index.json` exists
2. Verify the file is valid JSON
3. Check browser console for fetch errors

### GitHub API Rate Limits
1. Set `GITHUB_TOKEN` environment variable
2. Use development build script for local development
3. Consider caching the search index in CI/CD

### Missing Descriptions
1. Ensure repositories have descriptions set in GitHub
2. Add relevant topics to repositories in GitHub settings
3. Verify GitHub token has access to private repos

## CI/CD Integration

Update your build pipeline to include the GitHub token:

```yaml
# Example for GitHub Actions
- name: Build with search index
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: npm run build
```

```yaml
# Example for CircleCI
- run:
    name: Build with search index
    environment:
      GITHUB_TOKEN: $GITHUB_TOKEN
    command: npm run build
``` 