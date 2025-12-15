/**
 * Analytics Component
 * Extracts Google Analytics 4 initialization to reduce inline script bloat in root.tsx
 */

import { generateGA4InitScript } from '~/lib/analytics';

interface AnalyticsProps {
  measurementId: string;
}

export function GoogleAnalytics({ measurementId }: AnalyticsProps) {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <script dangerouslySetInnerHTML={{__html: generateGA4InitScript(measurementId)}} />
    </>
  );
}
