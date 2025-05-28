import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface Request {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    [k: string]: any;
}

interface SwaggerUIComponentProps {
	url: string;
	apiBaseUrl: string;
}

function SwaggerUIComponent({ url, apiBaseUrl }: SwaggerUIComponentProps) {
	const [isLoading, setIsLoading] = useState(true);
	const previousUrl = useRef(url);

	// Reset loading state when URL changes
	if (previousUrl.current !== url) {
		setIsLoading(true);
		previousUrl.current = url;
	}

	const requestInterceptor = (req: Request) => {
		if (req.url.startsWith("https://github.com")) {
			// Transform GitHub URLs to raw.githubusercontent.com
			const rawUrl = req.url.replace(
				/https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/,
				"https://raw.githubusercontent.com/$1/$2/$3/$4",
			);

			req.url = rawUrl;
		}
		
		req.url = `${apiBaseUrl}?url=${encodeURIComponent(req.url)}`

		return req;
	};

	// Handle when Swagger UI has finished loading
	const onComplete = () => {
		setIsLoading(false);
	};

	return (
		<div className="h-full overflow-hidden relative">
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-base-100 z-10">
					<div className="flex flex-col items-center gap-3">
						<Loader2 className="w-8 h-8 animate-spin text-primary" />
						<span className="text-base-content/70">Loading API documentation...</span>
					</div>
				</div>
			)}
			{/* @ts-expect-error - SwaggerUI has incorrect type definitions */}
			<SwaggerUI
				url={url}
				docExpansion="none"
				displayRequestDuration
				deepLinking
				requestInterceptor={requestInterceptor}
				onComplete={onComplete}
			/>
		</div>
	);
}

export default SwaggerUIComponent;
