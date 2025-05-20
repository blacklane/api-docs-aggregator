import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface Request {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    [k: string]: any;
}

interface SwaggerUIComponentProps {
	url: string;
	apiBaseUrl: string;
}

function SwaggerUIComponent({ url, apiBaseUrl }: SwaggerUIComponentProps) {
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

	return (
		<div className="h-full overflow-hidden">
			{/* @ts-expect-error - SwaggerUI has incorrect type definitions */}
			<SwaggerUI
				url={url}
				docExpansion="none"
				displayRequestDuration
				deepLinking
				requestInterceptor={requestInterceptor}
			/>
		</div>
	);
}

export default SwaggerUIComponent;
