import type React from "react";
import { Link } from "react-router-dom";
import { apis } from "@/config/apis";

const Welcome: React.FC = () => {
	const firstApi = apis.length > 0 ? apis[0] : null;

	return (
		<div className="flex flex-col justify-center items-center h-full text-center p-6">
			<h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
				Blacklane API Documentation
			</h1>
			<p className="text-lg mb-8 text-gray-600 dark:text-gray-300 max-w-2xl">
				Welcome to the Blacklane API Documentation portal. Select an API from
				the sidebar to view its Swagger documentation.
			</p>
			{firstApi && (
				<Link
					to={`/api/${firstApi.name.toLowerCase()}`}
					className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors"
				>
					View {firstApi.name} API
				</Link>
			)}
		</div>
	);
};

export default Welcome;
