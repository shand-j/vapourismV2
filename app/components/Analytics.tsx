/**
 * Analytics Component
 * Extracts Google Analytics 4 initialization to reduce inline script bloat in root.tsx
 * 
 * CSP Compliance: Uses nonce attribute to satisfy Content Security Policy requirements
 */

interface AnalyticsProps {
  measurementId: string;
  nonce?: string;
}

export function GoogleAnalytics({ measurementId, nonce }: AnalyticsProps) {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        nonce={nonce}
      />
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `,
        }}
      />
    </>
  );
}
