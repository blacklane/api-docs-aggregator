import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import "swagger-ui-react/swagger-ui.css";

function SwaggerUIComponent({ url, apiBaseUrl }) {
  const requestInterceptor = (req) => {
    console.log('Intercepting request:', req);
    if (apiBaseUrl && !req.url.startsWith(apiBaseUrl)) {
      return new Request(`${apiBaseUrl}?url=${encodeURIComponent(req.url)}`, req);
    }
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