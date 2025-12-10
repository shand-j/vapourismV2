/**
 * Device Studio Route
 * 
 * Guided quiz experience to help shoppers find their perfect vaping device.
 * 
 * URL: /device-studio
 */

import type {MetaFunction} from '@shopify/remix-oxygen';
import {QuizContainer} from '~/components/quiz';
import {DEVICE_STUDIO_QUIZ} from '~/lib/quiz-config';

export const meta: MetaFunction = () => [
  {title: 'Device Studio | Find Your Perfect Vape Device | Vapourism'},
  {
    name: 'description',
    content:
      'Take our device finder quiz to discover the perfect vape kit for your needs. Compare pod systems, vape pens, and box mods with expert guidance.',
  },
  {
    property: 'og:title',
    content: 'Device Studio | Vapourism',
  },
  {
    property: 'og:description',
    content: 'Find your perfect vaping device with our guided comparison tool.',
  },
  {
    property: 'og:image',
    content: DEVICE_STUDIO_QUIZ.heroImage,
  },
];

export default function DeviceStudioRoute() {
  return <QuizContainer config={DEVICE_STUDIO_QUIZ} resultsPath="/device-studio/results" />;
}
