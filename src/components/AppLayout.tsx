import type React from "react";
import { useEffect } from "react";
import { Routes, Route, Navigate, Link, useParams } from "react-router-dom";
import { apis } from "@/config/apis";
import Sidebar from "@/components/Sidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import ApiView from "@/components/ApiView";
import Welcome from "@/components/Welcome";
import "@/styles/swagger-dark.css";

const AppLayout: React.FC = () => {
	const { apiName } = useParams<{ apiName: string }>();

	// Find the current API for the title
	const currentApi = apis.find(
		(api) => api.name.toLowerCase() === (apiName?.toLowerCase() || ""),
	);

	// Set up dark mode observer for SwaggerUI
	useEffect(() => {
		const observer = new MutationObserver(() => {
			if (document.documentElement.classList.contains("dark")) {
				document
					.getElementById("swagger-container")
					?.classList.add("swagger-ui-dark");
			} else {
				document
					.getElementById("swagger-container")
					?.classList.remove("swagger-ui-dark");
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});

		return () => observer.disconnect();
	}, []);

	return (
		<div className="flex flex-col h-screen overflow-hidden bg-gray-100 dark:bg-zinc-900">
			<header className="flex items-center justify-between px-6 py-4 bg-black border-b border-zinc-700 shadow-sm z-10 shrink-0">
				<Link to="/" className="text-white no-underline">
					<Logo />
				</Link>
				<h3 className="mb-0 text-xl font-bold text-white">
					{currentApi ? currentApi.name : "Welcome"}
				</h3>
				<ThemeToggle />
			</header>
			<div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-zinc-900">
				<Sidebar apis={apis} selectedApiUrl={currentApi?.url || null} />
				<div className="flex-grow flex flex-col h-screen overflow-hidden">
					<main
						id="swagger-container"
						className="flex-grow overflow-y-auto bg-white dark:bg-zinc-800 relative"
					>
						<Routes>
							<Route path="/" element={<Welcome />} />
							<Route path="/api/:apiName" element={<ApiView />} />
							<Route path="*" element={<Navigate to="/" />} />
						</Routes>
					</main>
				</div>
			</div>
		</div>
	);
};

export default AppLayout;
