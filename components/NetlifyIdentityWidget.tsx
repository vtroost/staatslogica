'use client';

import Script from 'next/script';

export default function NetlifyIdentityWidget() {
  return (
    <Script 
      id="netlify-identity-widget-script"
      strategy="beforeInteractive" 
      src="https://identity.netlify.com/v1/netlify-identity-widget.js"
      onError={(e) => {
        console.error('Netlify Identity Widget failed to load:', e);
      }}
    />
  );
} 