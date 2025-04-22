import type React from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { apis } from "@/config/apis";

// API base URL from environment variable
const API_BASE_URL = import.meta.env.PUBLIC_SWAGGER_API_URL;

const ApiView: React.FC = () => {
	const { apiName } = useParams<{ apiName: string }>();
	const navigate = useNavigate();

	// Find the API by name (case insensitive)
	const currentApi = apis.find(
		(api) => api.name.toLowerCase() === (apiName?.toLowerCase() || ""),
	);

	// If API not found, redirect to home
	useEffect(() => {
		if (apiName && !currentApi) {
			navigate("/");
		}
	}, [apiName, currentApi, navigate]);

	if (!currentApi) {
		return (
			<div className="flex justify-center items-center h-full text-gray-500 dark:text-zinc-400 text-lg bg-gray-50 dark:bg-zinc-900">
				Loading API...
			</div>
		);
	}

	return (
		<div className="absolute inset-0">
			<SwaggerUI url={`${API_BASE_URL}?url=${encodeURIComponent(currentApi.url)}`} />
		</div>
	);
};

export default ApiView;
