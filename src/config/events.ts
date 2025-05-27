export interface EventItem {
	name: string;
	url: string;
}

// Import events from the configuration file
import eventsConfig from "../../events.config.json";

// Export the events from the config file
export const events: EventItem[] = eventsConfig.events;
