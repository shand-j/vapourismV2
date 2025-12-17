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
      'Discover your ideal vape kit with Vapourism\'s Device Studio. Get personalized recommendations and find the perfect pod system or vape pen today!',
  },
  {
    name: 'keywords',
    content: 'vape device finder, device quiz, pod systems, vape kits, box mods, vape pens, device comparison, starter kits, beginner vapes, device recommendations',
  },
  {
    property: 'og:title',
    content: 'Device Studio | Find Your Perfect Vape Device | Vapourism',
  },
  {
    property: 'og:description',
    content: 'Find your perfect vaping device with our guided comparison tool and personalised recommendations.',
  },
  {
    property: 'og:type',
    content: 'website',
  },
  {
    property: 'og:url',
    content: 'https://www.vapourism.co.uk/device-studio',
  },
  {
    property: 'og:image',
    content: DEVICE_STUDIO_QUIZ.heroImage,
  },
  {
    name: 'twitter:card',
    content: 'summary_large_image',
  },
  {
    name: 'twitter:title',
    content: 'Device Studio | Find Your Perfect Vape Device',
  },
  {
    name: 'twitter:description',
    content: 'Take our quiz to find the perfect vaping device for your needs.',
  },
];

export default function DeviceStudioRoute() {
  return <QuizContainer config={DEVICE_STUDIO_QUIZ} resultsPath="/device-studio/results" />;
}
