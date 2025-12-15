/**
 * Flavour Lab Route
 * 
 * Guided quiz experience to help shoppers discover their perfect e-liquid flavours.
 * 
 * URL: /flavour-lab
 */

import type {MetaFunction} from '@shopify/remix-oxygen';
import {QuizContainer} from '~/components/quiz';
import {FLAVOUR_LAB_QUIZ} from '~/lib/quiz-config';

export const meta: MetaFunction = () => [
  {title: 'Flavour Lab | Discover Your Perfect Vape Flavours | Vapourism'},
  {
    name: 'description',
    content:
      'Take our flavour quiz to discover personalised e-liquid recommendations. Find your perfect fruity, menthol, dessert, or tobacco vape flavours. Get tailored flavour suggestions based on your taste preferences.',
  },
  {
    name: 'keywords',
    content: 'flavour finder, e-liquid quiz, vape flavours, fruity vapes, menthol e-liquid, dessert flavours, tobacco vapes, flavour recommendations, taste profile, e-juice finder',
  },
  {
    property: 'og:title',
    content: 'Flavour Lab | Discover Your Perfect Vape Flavours | Vapourism',
  },
  {
    property: 'og:description',
    content: 'Discover your perfect vape flavours with our guided tasting journey and personalised recommendations.',
  },
  {
    property: 'og:type',
    content: 'website',
  },
  {
    property: 'og:url',
    content: 'https://vapourism.co.uk/flavour-lab',
  },
  {
    property: 'og:image',
    content: FLAVOUR_LAB_QUIZ.heroImage,
  },
  {
    name: 'twitter:card',
    content: 'summary_large_image',
  },
  {
    name: 'twitter:title',
    content: 'Flavour Lab | Discover Your Perfect Vape Flavours',
  },
  {
    name: 'twitter:description',
    content: 'Take our quiz to discover your ideal e-liquid flavours.',
  },
];

export default function FlavourLabRoute() {
  return <QuizContainer config={FLAVOUR_LAB_QUIZ} resultsPath="/flavour-lab/results" />;
}
