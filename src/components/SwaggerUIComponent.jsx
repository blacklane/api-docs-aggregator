import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

function SwaggerUIComponent({ url, apiBaseUrl }) {
	const requestInterceptor = (req) => {
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
		<SwaggerUI
			url={url}
			docExpansion="none"
			displayRequestDuration
			deepLinking
			requestInterceptor={requestInterceptor}
		/>
	);
}

export default SwaggerUIComponent;
