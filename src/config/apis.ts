export interface ApiItem {
  name: string;
  url: string;
}

// Import APIs from the configuration file
import apiConfig from '../../apis.config.json';

// Export the APIs from the config file
export const apis: ApiItem[] = apiConfig.apis; 