const ADS_CLIENT_ID = 'ca-pub-3669842766661288';

export function GoogleAdsenseScript() {
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT_ID}`}
      crossOrigin="anonymous"
    />
  );
}
