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
      'Take our device finder quiz to discover the perfect vape kit for your needs. Compare pod systems, vape pens, and box mods with expert guidance. Get personalised device recommendations.',
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
    content: 'https://vapourism.co.uk/device-studio',
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
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Hero Section with SEO Content */}
      <div className="container-custom py-12 lg:py-20">
        <div className="mx-auto max-w-4xl">
          {/* Main Heading and Introduction */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Find Your Perfect Vape Device with Our Expert Device Finder
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed mb-4">
              Choosing the right vaping device can be overwhelming with hundreds of options available in the UK market. Our Device Studio quiz simplifies your decision by matching your preferences, experience level, and vaping style with the perfect device. Whether you're new to vaping or upgrading your current setup, our intelligent recommendation system helps you find pod systems, vape kits, box mods, or starter devices that suit your needs.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Answer a few simple questions about your vaping habits, preferred features, and budget, and we'll provide personalized device recommendations from leading UK brands. Our quiz considers factors like battery life, portability, power output, and ease of use to ensure you get the best vaping experience possible.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-slate-900 mb-2">Personalized Recommendations</h3>
              <p className="text-sm text-slate-600">
                Get device suggestions tailored to your vaping style, whether you prefer mouth-to-lung, direct-to-lung, or restricted DTL vaping. Our algorithm considers your nicotine preferences and experience level.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-slate-900 mb-2">Expert Guidance</h3>
              <p className="text-sm text-slate-600">
                Benefit from our years of vaping retail experience. We've helped thousands of UK customers find their ideal devices by understanding the nuances of pod systems, pen styles, and advanced mods.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-slate-900 mb-2">Save Time & Money</h3>
              <p className="text-sm text-slate-600">
                Avoid costly mistakes by finding the right device first time. Our quiz prevents you from purchasing incompatible devices or overly complex equipment that doesn't match your needs.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-purple-50 rounded-2xl p-8 mb-12 border border-purple-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How Our Device Finder Works</h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Share Your Vaping Experience</h3>
                  <p className="text-slate-700">Tell us whether you're a complete beginner, transitioning from smoking, or an experienced vaper looking to upgrade. This helps us recommend devices with appropriate complexity and features.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Define Your Preferences</h3>
                  <p className="text-slate-700">Select your preferred vaping style, desired portability, battery life requirements, and whether you want adjustable power settings or simple operation. We'll also ask about your budget range.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Get Matched with Perfect Devices</h3>
                  <p className="text-slate-700">Receive personalized device recommendations with detailed specifications, user reviews, and direct links to purchase. Compare options side-by-side to make an informed decision.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Device Types Guide */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Understanding Different Vape Device Types</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">Pod Systems</h3>
                <p className="text-slate-700 mb-3">
                  Pod systems are compact, user-friendly devices perfect for beginners and experienced vapers seeking portability. They use pre-filled or refillable pods, require minimal maintenance, and deliver consistent flavor with salt nicotine or freebase e-liquids.
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Best for:</strong> Beginners, discreet vaping, mouth-to-lung style, nicotine salts, on-the-go convenience.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">Vape Pens</h3>
                <p className="text-slate-700 mb-3">
                  Vape pens offer a balance between simplicity and performance. These cylindrical devices are easy to use, provide longer battery life than basic pods, and work well with various coil resistances for different vaping styles.
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Best for:</strong> New vapers, moderate power needs, extended battery life, simple operation, versatile coil options.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">Box Mods</h3>
                <p className="text-slate-700 mb-3">
                  Box mods are advanced devices offering maximum customization through adjustable wattage, temperature control, and compatibility with various tanks. They deliver powerful vapor production and extended battery life with removable batteries.
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Best for:</strong> Experienced vapers, cloud chasing, direct-to-lung vaping, customization, high-VG e-liquids.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-lg text-slate-900 mb-3">All-in-One Kits</h3>
                <p className="text-slate-700 mb-3">
                  All-in-one starter kits include everything needed to begin vaping: device, tank, coils, and charging cable. These complete solutions eliminate guesswork and ensure component compatibility for hassle-free vaping.
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Best for:</strong> First-time buyers, gift purchases, guaranteed compatibility, immediate use, beginners.
                </p>
              </div>
            </div>
          </div>

          {/* Key Considerations */}
          <div className="bg-slate-50 rounded-2xl p-8 mb-12 border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Factors to Consider When Choosing a Vape Device</h2>
            <div className="space-y-4 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Battery Life and Charging</h3>
                <p>Consider your daily vaping frequency. Heavy vapers benefit from devices with larger battery capacity (2000mAh+) or removable batteries. USB-C charging provides faster recharge times than older micro-USB connections.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Nicotine Strength Compatibility</h3>
                <p>Lower-powered pod systems (10-20W) work best with higher nicotine strengths (10-20mg salt nic), while powerful sub-ohm devices (50W+) require lower nicotine concentrations (3-6mg freebase) to avoid harsh throat hits.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Maintenance Requirements</h3>
                <p>Pod systems need minimal maintenance—just replace pods when flavor diminishes. Traditional tanks require regular coil changes (every 1-3 weeks) and periodic cleaning. Choose based on your comfort level with device upkeep.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Portability and Discretion</h3>
                <p>Compact pod systems fit easily in pockets and produce moderate vapor, ideal for discreet public vaping. Larger box mods offer better performance but lack portability and generate substantial vapor clouds.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Cost of Ownership</h3>
                <p>Factor in ongoing costs beyond the initial device purchase. Calculate replacement coil expenses (£2-5 each), pod costs, battery replacements, and e-liquid consumption rates when budgeting for vaping.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Component */}
      <div className="container-custom pb-12">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <QuizContainer config={DEVICE_STUDIO_QUIZ} resultsPath="/device-studio/results" />
          </div>
        </div>
      </div>

      {/* Additional Help Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container-custom py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Need Personal Advice?</h2>
            <p className="text-lg mb-6 opacity-90">
              Our UK-based vaping experts are available to answer questions about device selection, compatibility, and features. Contact us for personalized guidance beyond the quiz recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Our Experts
              </a>
              <a
                href="/faq"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Browse FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
