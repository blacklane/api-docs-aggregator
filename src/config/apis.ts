interface ApiItem {
  name: string;
  url: string;
}

// Define the type for the exported array
export const apis: ApiItem[] = [
  {
    name: 'Athena',
    url: 'https://api-docs.int.blacklane.io/athena.json'
  },
  {
    name: 'Emirates',
    url: 'https://api-docs.int.blacklane.io/emirates.json'
  }
]; 