# API docs aggregator

The Blacklane API docs aggregator

## Features

- Browse multiple API documentation in one place
- Modern, responsive UI with dark mode support
- Built with Astro, React, Tailwind CSS, and Swagger UI

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/blacklane/api-docs-aggregator
cd api-docs-aggregator

# Install dependencies
npm install
# or if using bun
bun install
# Add the .env file
cp .env.example .env
```

### Running the Application

```bash
# Start the development server
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:4321` by default.

## Adding New API Specifications

To add a new API specification to the aggregator:

1. Open the root-level file `apis.config.json`
2. Add a new entry to the `apis` array following this format:

```json
{
  "name": "API Name",  // The display name for the API
  "url": "https://github.com/blacklane/path/to/your/docs.yml"  // URL to the OpenAPI/Swagger JSON or YAML
}
```

Example:

```json
{
  "apis": [
    {
      "name": "Athena",
      "url": "https://github.com/blacklane/api-docs/blob/master/schemas/athena.yml"
    },
    {
      "name": "Emirates",
      "url": "https://github.com/blacklane/api-docs/blob/master/schemas/emirates.yml"
    },
    // Add your new API here
    {
      "name": "New API",
      "url": "https://github.com/blacklane/service/api-docs.json"
    }
  ]
}
```

3. Save the file and restart the development server if needed

The new API will automatically appear in the sidebar menu.

## Adding New Event Specifications

To add a new event specification to the aggregator:

1. Open the root-level file `events.config.json`
2. Add a new entry to the `events` array following this format:

```json
{
  "name": "Event Name",  // The display name for the event
  "url": "https://github.com/blacklane/path/to/your/events.yaml"  // URL to the AsyncAPI YAML or JSON
}
```

Example:

```json
{
  "events": [
    {
      "name": "Booking Service",
      "url": "https://github.com/blacklane/bookings-service/blob/402c2fbe05a0c3078afa9023c1046dc7d8d2c2e7/docs/events.yaml"
    },
    // Add your new event here
    {
      "name": "New Event Service",
      "url": "https://github.com/blacklane/new-service/blob/main/docs/events.yaml"
    }
  ]
}
```

3. Save the file and restart the development server if needed

**Note:** Events use AsyncAPI specification format (not OpenAPI/Swagger) and are displayed using the AsyncAPI React component. The new event will automatically appear in the sidebar menu under the "Events" section.

## Building for Production

```bash
npm run build
# or
bun run build
```

The built files will be available in the `dist` directory and can be deployed to any static hosting service.

## Preview

![](./images/preview.png)