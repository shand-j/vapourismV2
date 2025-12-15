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
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Hero Section with SEO Content */}
      <div className="container-custom py-12 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Main Heading and Introduction */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Discover Your Perfect Vape Flavours with Our Expert Flavour Finder
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed mb-4">
              Finding the perfect e-liquid flavour profile can transform your vaping experience from ordinary to exceptional. Our Flavour Lab quiz uses your taste preferences, vaping habits, and nicotine requirements to recommend ideal fruity vapes, menthol e-liquids, dessert flavours, tobacco blends, or beverage-inspired juices. Whether you're exploring disposable vapes, shortfill e-liquids, or nicotine salt formulations, our intelligent matching system guides you to flavours you'll love.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Say goodbye to disappointing purchases and wasted bottles. Our quiz considers flavour intensity preferences, sweetness levels, cooling sensations, and nicotine delivery styles to ensure every recommendation matches your unique taste profile. Start your flavour journey now and discover UK e-liquids, disposables, and nicotine pouches perfectly suited to your palate.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-3xl mb-3">👅</div>
              <h3 className="font-semibold text-slate-900 mb-2">Taste Profile Matching</h3>
              <p className="text-sm text-slate-600">
                Our quiz analyzes your flavour preferences across fruit, menthol, dessert, tobacco, and beverage categories to recommend e-liquids that perfectly match your taste buds and vaping style.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-slate-900 mb-2">Avoid Flavor Fatigue</h3>
              <p className="text-sm text-slate-600">
                Discover complementary flavours to rotate in your collection, preventing taste bud fatigue. We suggest variety packs and alternating profiles to keep your vaping experience fresh and exciting.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-3xl mb-3">🌡️</div>
              <h3 className="font-semibold text-slate-900 mb-2">Nicotine Optimization</h3>
              <p className="text-sm text-slate-600">
                Get recommendations tailored to your preferred nicotine strength and type—whether you prefer smooth salt nicotine for pod systems or traditional freebase nicotine for sub-ohm vaping.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-pink-50 rounded-2xl p-8 mb-12 border border-pink-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How Our Flavour Finder Works</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Select Your Product Type</h3>
                  <p className="text-slate-700">Choose whether you're looking for bottled e-liquids, convenient disposable vapes, or nicotine pouches. This determines the format and nicotine delivery system for your recommendations.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Describe Your Taste Preferences</h3>
                  <p className="text-slate-700">Tell us about your favorite flavour categories, sweetness preferences, cooling intensity, and whether you enjoy complex blends or single-note profiles. We'll also ask about any flavours you want to avoid.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Get Personalized Recommendations</h3>
                  <p className="text-slate-700">Receive curated flavour suggestions from top UK brands with detailed tasting notes, nicotine options, VG/PG ratios, and user reviews. Compare similar flavours and add favorites to your basket.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Flavour Categories Guide */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Exploring E-Liquid Flavour Categories</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">🍓 Fruity Flavours</h3>
                <p className="text-slate-700 mb-3">
                  Fruit-flavoured e-liquids dominate UK vaping for their vibrant taste and all-day vapability. From tropical blends (mango, pineapple, passion fruit) to classic berries (strawberry, blueberry, raspberry) and citrus explosions, fruity vapes offer endless variety and natural sweetness.
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Popular options:</strong> Mixed berry blends, tropical fruit medleys, single-fruit profiles, fruit with menthol, candy fruit flavours.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">❄️ Menthol & Ice</h3>
                <p className="text-slate-700 mb-3">
                  Menthol and ice e-liquids provide cooling sensations ranging from subtle freshness to intense icy blasts. These flavours work alone or enhance fruit, beverage, and tobacco profiles. Perfect for ex-menthol cigarette smokers and vapers seeking refreshing throat hits.
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Popular options:</strong> Pure menthol, peppermint, spearmint, fruit with ice, cooling additives, wintergreen.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">🍰 Desserts & Bakery</h3>
                <p className="text-slate-700 mb-3">
                  Dessert e-liquids recreate indulgent treats without calories: creamy custards, rich cakes, buttery pastries, chocolate delights, and cookie flavours. These complex blends satisfy sweet cravings and provide comforting, full-bodied vapor experiences ideal for evening vaping.
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Popular options:</strong> Vanilla custard, strawberry cheesecake, glazed donuts, chocolate brownies, caramel desserts, cookie dough.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">🚬 Tobacco Blends</h3>
                <p className="text-slate-700 mb-3">
                  Tobacco-flavoured e-liquids help smokers transition to vaping with familiar taste profiles. Options range from authentic Virginia tobacco and rich Cuban blends to sweetened RY4 combinations with caramel and vanilla notes. Essential for ex-smokers seeking smoking cessation alternatives.
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Popular options:</strong> Classic tobacco, Virginia blend, RY4 (tobacco/caramel/vanilla), menthol tobacco, honey tobacco, nutty blends.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">☕ Beverages</h3>
                <p className="text-slate-700 mb-3">
                  Beverage-inspired e-liquids capture your favorite drinks: morning coffee, afternoon tea, refreshing lemonade, or cola classics. These flavours offer familiar comfort and work excellently as all-day vapes with balanced sweetness and recognizable taste profiles.
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Popular options:</strong> Coffee, cappuccino, chai tea, lemonade, cola, energy drinks, milkshakes.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">🍬 Candy & Sweets</h3>
                <p className="text-slate-700 mb-3">
                  Candy-flavoured e-liquids recreate childhood favorites and popular confections: gummy bears, hard candies, bubble gum, sherbet, and more. These sweet, nostalgic flavours deliver punchy taste with playful profiles that appeal to vapers with serious sweet teeth.
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Popular options:</strong> Gummy candy, bubble gum, sherbet, hard candies, licorice, cotton candy, sour sweets.
                </p>
              </div>
            </div>
          </div>

          {/* Nicotine Strength Guide */}
          <div className="bg-slate-50 rounded-2xl p-8 mb-12 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Choosing the Right Nicotine Strength</h2>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Understanding Nicotine Types</h3>
                <p className="mb-3">
                  <strong>Nicotine Salts:</strong> Smoother throat hit at higher concentrations (10-20mg), absorbed faster, ideal for pod systems and ex-smokers. Common in disposables and prefilled pods.
                </p>
                <p>
                  <strong>Freebase Nicotine:</strong> Traditional nicotine with stronger throat hit, used in lower concentrations (3-6mg), preferred for sub-ohm vaping and larger cloud production.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Nicotine Strength Guidelines</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>0mg (Zero Nicotine):</strong> For non-smokers, social vapers, or those who've successfully reduced nicotine dependency. Pure flavour without nicotine effects.</li>
                  <li><strong>3mg Freebase:</strong> Light smokers (fewer than 10 cigarettes daily) using sub-ohm devices. Minimal throat hit with satisfying vapor.</li>
                  <li><strong>6mg Freebase:</strong> Moderate smokers (10-20 cigarettes daily) using standard tanks or lower-powered devices. Noticeable throat hit.</li>
                  <li><strong>10-12mg Salt Nic:</strong> Moderate smokers switching to pod systems. Smooth delivery with moderate nicotine satisfaction.</li>
                  <li><strong>18-20mg Salt Nic:</strong> Heavy smokers (20+ cigarettes daily) requiring strong nicotine hit. Maximum UK legal strength for optimal satisfaction.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Adjusting Nicotine Over Time</h3>
                <p>
                  Many successful vapers gradually reduce nicotine strength once comfortable with vaping. Start with strength matching your smoking habits, then step down every few months. This approach helps manage cravings while working toward lower nicotine dependency or zero nicotine vaping.
                </p>
              </div>
            </div>
          </div>

          {/* VG/PG Ratios */}
          <div className="bg-white rounded-2xl p-8 mb-12 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Understanding VG/PG Ratios in E-Liquids</h2>
            <p className="text-slate-700 mb-6">
              E-liquid base consists of Vegetable Glycerin (VG) and Propylene Glycol (PG) in varying ratios. Each ingredient affects vapor production, throat hit, flavour intensity, and device compatibility. Choosing the right ratio optimizes your vaping experience.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">50/50 VG/PG - Balanced Blend</h3>
                <p className="text-slate-700 text-sm mb-2">
                  Perfect balance between flavour, throat hit, and vapor. Ideal for mouth-to-lung vaping, starter kits, and pod systems. Works with most devices and coil resistances.
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Best for:</strong> Beginners, MTL devices, higher nicotine strengths, all-day vaping, maximum flavour.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">70/30 VG/PG - Cloud Chaser</h3>
                <p className="text-slate-700 text-sm mb-2">
                  Higher VG content produces larger vapor clouds with smoother inhales. Requires sub-ohm devices with powerful batteries and lower-resistance coils (below 0.5ohm).
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Best for:</strong> Sub-ohm vaping, cloud production, direct-to-lung style, lower nicotine strengths, experienced vapers.
                </p>
              </div>
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">80/20 VG/PG - Maximum Clouds</h3>
                <p className="text-slate-700 text-sm mb-2">
                  Very high VG for massive clouds and ultra-smooth vaping. Requires powerful mods (70W+) and specialized coils. Thicker liquid may need larger wicking channels.
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Best for:</strong> Advanced cloud chasing, high-wattage devices, DTL vaping, competitions, very low nicotine (0-3mg).
                </p>
              </div>
              <div className="border-l-4 border-pink-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">High PG (60/40 PG/VG)</h3>
                <p className="text-slate-700 text-sm mb-2">
                  Higher PG content delivers stronger throat hit and more intense flavour. Thinner consistency suits basic devices and provides cigarette-like sensation for ex-smokers.
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Best for:</strong> Ex-smokers, strong throat hit, maximum flavour intensity, basic e-cigarettes, high nicotine strengths.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Component */}
      <div className="container-custom pb-12">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <QuizContainer config={FLAVOUR_LAB_QUIZ} resultsPath="/flavour-lab/results" />
          </div>
        </div>
      </div>

      {/* Additional Help Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container-custom py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Still Exploring Flavour Options?</h2>
            <p className="text-lg mb-6 opacity-90">
              Our UK vaping specialists can provide personal flavour recommendations based on your specific preferences, dietary requirements, or sensitivity concerns. We're here to help you find your perfect all-day vape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Flavour Advice
              </a>
              <a
                href="/faq"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Vaping FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
