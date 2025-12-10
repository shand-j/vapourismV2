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
      'Take our flavour quiz to discover personalised e-liquid recommendations. Find your perfect fruity, menthol, dessert, or tobacco vape flavours.',
  },
  {
    property: 'og:title',
    content: 'Flavour Lab | Vapourism',
  },
  {
    property: 'og:description',
    content: 'Discover your perfect vape flavours with our guided tasting journey.',
  },
  {
    property: 'og:image',
    content: FLAVOUR_LAB_QUIZ.heroImage,
  },
];

export default function FlavourLabRoute() {
  return <QuizContainer config={FLAVOUR_LAB_QUIZ} resultsPath="/flavour-lab/results" />;
}
