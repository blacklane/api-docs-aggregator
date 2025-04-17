import type React from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/AppLayout";

// Root component with Router
const SwaggerAggregator: React.FC = () => {
	// Check if we're getting redirected from the 404.html page with a path in the query
	useEffect(() => {
		const query = window.location.search;
		if (query.length > 0) {
			// Extract the path from the query string
			const path = query.substring(1);
			// Replace the current URL with the proper path for React Router
			window.history.replaceState(null, '', `/${path}`);
		}
	}, []);

	return (
		<Router>
			<Routes>
				<Route path="/*" element={<AppLayout />} />
			</Routes>
		</Router>
	);
};

export default SwaggerAggregator;
