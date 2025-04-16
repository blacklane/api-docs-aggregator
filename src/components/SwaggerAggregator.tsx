import type React from "react";
import { useState, useEffect } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { apis } from "../config/apis";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import { Logo } from './Logo';

const SwaggerAggregator: React.FC = () => {
	// Initialize state with the first API or null
	const initialApi = apis.length > 0 ? apis[0] : null;
	const [selectedApiUrl, setSelectedApiUrl] = useState<string | null>(
		initialApi?.url ?? null,
	);
	const [selectedApiName, setSelectedApiName] = useState<string>(
		initialApi?.name ?? "Select API",
	);

	// Type the handler function
	const handleApiSelect = (url: string, name: string): void => {
		setSelectedApiUrl(url);
		setSelectedApiName(name);
	};

	return (
		<div className="flex flex-col h-screen overflow-hidden bg-gray-100 dark:bg-zinc-900">
			<header className="flex items-center justify-between px-6 py-4 bg-black border-b border-zinc-700 shadow-sm z-10 shrink-0">
				<Logo />
				<h3 className="mb-0 text-xl font-bold text-white">{selectedApiName}</h3>
				<ThemeToggle />
			</header>
			<div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-zinc-900">
				<Sidebar
					apis={apis}
					onApiSelect={handleApiSelect}
					selectedApiUrl={selectedApiUrl}
				/>
				<div className="flex-grow flex flex-col h-screen overflow-hidden">
					<main className="flex-grow overflow-y-auto bg-white dark:bg-zinc-800 relative">
						{selectedApiUrl ? (
							// Ensure SwaggerUI component fills the container
							<div className="absolute inset-0">
								<SwaggerUI url={selectedApiUrl} />
							</div>
						) : (
							<div className="flex justify-center items-center h-full text-gray-500 dark:text-zinc-400 text-lg bg-gray-50 dark:bg-zinc-900">
								{apis.length > 0
									? "Please select an API from the sidebar."
									: "No APIs configured."}
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
};

export default SwaggerAggregator;
