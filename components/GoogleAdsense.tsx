'use client';

import Script from 'next/script';

const ADS_CLIENT_ID = 'ca-pub-3669842766661288';

export function GoogleAdsenseScript() {
  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT_ID}`}
      async
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
