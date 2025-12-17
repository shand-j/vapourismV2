import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {useState} from 'react';
import {Search, ChevronDown, ChevronUp, Package, CreditCard, Truck, HelpCircle, Shield, Zap} from 'lucide-react';

// FAQ Data Structure
const faqCategories = [
  {
    id: 'ordering',
    title: 'Ordering, Payment & Subscriptions',
    icon: CreditCard,
    color: 'purple',
    questions: [
      {
        question: 'How do I place an order?',
        answer: 'Simply browse our products, add items to your basket, and proceed to checkout. You\'ll need to create an account and verify your age (18+) as required by UK law. Follow the checkout process to enter your delivery details and payment information.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely through certified payment providers.'
      },
      {
        question: 'Why do I need age verification?',
        answer: 'UK law requires that all customers purchasing vaping products must be 18 or over. We use certified third-party age verification services to confirm your identity and age before processing orders. This is a legal requirement, not an optional step.'
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'You can modify or cancel your order within 30 minutes of placing it by contacting customer service immediately. Once your order enters our fulfillment process, changes may not be possible, but you can return items under our returns policy.'
      },
      {
        question: 'Do you offer subscriptions?',
        answer: 'Yes! We offer subscription services for eligible prefilled pod products with 20% savings on every delivery. You can pause, skip, or cancel your subscription anytime through your account dashboard.'
      }
    ]
  },
  {
    id: 'delivery',
    title: 'Delivery & Shipping',
    icon: Truck,
    color: 'blue',
    questions: [
      {
        question: 'How long does delivery take?',
        answer: 'Standard UK delivery typically takes 1-3 working days. Orders placed before 2pm Monday-Friday are usually dispatched the same day. We offer next-day delivery options for urgent orders.'
      },
      {
        question: 'Do you deliver to my area?',
        answer: 'We deliver throughout the UK mainland. Some remote areas, Scottish Highlands, and islands may take an extra 1-2 days. We also offer international shipping to selected countries - check at checkout for availability.'
      },
      {
        question: 'How much does delivery cost?',
        answer: 'Free standard delivery on orders over £20. Under £20, standard delivery costs £3.99. Express next-day delivery is available for £5.99. Saturday delivery costs £7.99.'
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order is dispatched, you\'ll receive a tracking email with a tracking number. You can also track your order by logging into your account or using our order tracking page.'
      },
      {
        question: 'What if I\'m not in when delivery arrives?',
        answer: 'Our couriers will attempt delivery and leave a card if you\'re not in. You can usually rearrange delivery online or collect from a local depot. Some services offer safe place or neighbor delivery options.'
      }
    ]
  },
  {
    id: 'products',
    title: 'Products & Vaping',
    icon: Zap,
    color: 'green',
    questions: [
      {
        question: 'Are your products genuine?',
        answer: 'Yes, all our products are 100% genuine and sourced directly from authorized distributors and manufacturers. We never sell counterfeit or clone products. All items come with manufacturer warranties where applicable.'
      },
      {
        question: 'What\'s the difference between freebase and salt nicotine?',
        answer: 'Freebase nicotine provides a stronger throat hit and is typically used in lower concentrations (3-6mg). Salt nicotine is smoother and allows higher concentrations (10-20mg) without harshness, making it ideal for pod systems and mouth-to-lung vaping.'
      },
      {
        question: 'How do I choose the right nicotine strength?',
        answer: 'Heavy smokers (20+ cigarettes/day): 18-20mg salt or 6mg freebase. Moderate smokers (10-20/day): 12-18mg salt or 3-6mg freebase. Light smokers (<10/day): 6-12mg salt or 3mg freebase. Non-smokers should choose 0mg.'
      },
      {
        question: 'How long do coils last?',
        answer: 'Coil lifespan varies by usage, e-liquid type, and wattage. Typically 1-3 weeks for average users. Signs to replace: burnt taste, reduced flavor, poor vapor production, or gurgling sounds. Sweet e-liquids may reduce coil life.'
      },
      {
        question: 'Can I return opened e-liquids?',
        answer: 'For hygiene and safety reasons, opened e-liquid bottles cannot be returned unless faulty. Unopened bottles can be returned within 14 days. Always check flavors and nicotine strength before opening.'
      }
    ]
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    icon: Package,
    color: 'amber',
    questions: [
      {
        question: 'What is your returns policy?',
        answer: 'You have 14 days from delivery to return unopened items. Items must be in original condition with all packaging. E-liquids cannot be returned once opened for hygiene reasons. Return shipping costs are customer\'s responsibility unless items are faulty.'
      },
      {
        question: 'How do I return an item?',
        answer: 'Contact our customer service team to get a returns authorization number. Package items securely with the RMA number, and send via a tracked service. Once received and inspected, we\'ll process your refund within 5-7 business days.'
      },
      {
        question: 'What if my item is faulty?',
        answer: 'Contact us immediately with photos and description of the fault. Faulty items are covered under warranty and we\'ll provide a free return label. We\'ll repair, replace, or refund faulty items depending on the issue.'
      },
      {
        question: 'Can I exchange for a different product?',
        answer: 'We don\'t offer direct exchanges. Please return the unwanted item for a refund and place a new order for your preferred product. This ensures faster processing and accurate stock management.'
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Refunds are processed within 5-7 business days of receiving your returned item. The refund will appear in your original payment method. Bank processing times vary but typically take 3-5 additional business days.'
      }
    ]
  },
  {
    id: 'account',
    title: 'Account & Legal',
    icon: Shield,
    color: 'red',
    questions: [
      {
        question: 'Why do I need to create an account?',
        answer: 'UK law requires age verification for vaping products. An account allows us to verify your age once and store this verification. It also enables order tracking, faster checkout, subscription management, and access to order history.'
      },
      {
        question: 'How do you protect my personal data?',
        answer: 'We comply with UK GDPR and use industry-standard security measures including SSL encryption, secure servers, and limited data access. We never sell your data to third parties. Read our Privacy Policy for full details.'
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can request account deletion by contacting customer service. Note that we may need to retain some information for legal compliance (tax records, age verification) for up to 7 years as required by UK law.'
      },
      {
        question: 'What information do you store about me?',
        answer: 'We store your contact details, delivery addresses, order history, age verification status, and communication preferences. Payment details are securely handled by our payment processors and not stored on our servers.'
      },
      {
        question: 'Are there any age restrictions?',
        answer: 'You must be 18 or over to purchase any vaping products. This is a legal requirement in the UK. We use certified age verification services to confirm your age. Attempting to purchase underage is illegal and orders will be cancelled.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: HelpCircle,
    color: 'indigo',
    questions: [
      {
        question: 'My device isn\'t working properly',
        answer: 'First, check the basics: Is it charged? Are connections clean? Is the coil installed correctly? Try a different coil if available. If problems persist, contact our technical support team with your device model and issue description.'
      },
      {
        question: 'How do I clean my device?',
        answer: 'Regular cleaning extends device life. Clean connections with a dry cotton swab, wipe external surfaces with a slightly damp cloth. For deep cleaning, disassemble (if possible) and clean components separately. Never submerge electronic parts in water.'
      },
      {
        question: 'Why does my e-liquid taste burnt?',
        answer: 'Burnt taste usually indicates a worn coil that needs replacing. Other causes: insufficient e-liquid in the tank, wattage too high for the coil, or chain vaping without allowing the coil to re-saturate between puffs.'
      },
      {
        question: 'My device is leaking e-liquid',
        answer: 'Common causes: overfilled tank, damaged o-rings, incorrect coil installation, or temperature changes. Check all seals, ensure coil is properly tightened, and avoid overfilling. Clean any leaked e-liquid immediately.'
      },
      {
        question: 'Battery safety tips',
        answer: 'Never leave charging unattended, use original chargers, avoid overcharging, store batteries safely, and replace if damaged or performance decreases significantly. Look for swelling, overheating, or unusual behavior.'
      }
    ]
  }
];

export const meta: MetaFunction = () => {
  // Generate FAQ schema for search engines
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqCategories.flatMap(category => 
      category.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    )
  };

  return [
    {
      title: 'FAQ - Frequently Asked Questions | Vapourism UK Vape Shop'
    },
    {
      name: 'description',
      content: 'Vapourism\'s FAQ answers your vaping questions! Get fast help on e-liquids, devices, UK delivery, age verification, and returns. Find what you need today.'
    },
    {
      name: 'keywords',
      content: 'vaping FAQ, vape shop questions, UK vape delivery, age verification, e-liquid returns, vape device help, nicotine strength guide, coil replacement, battery safety, vaping support'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Frequently Asked Questions | Vapourism'
    },
    {
      property: 'og:description',
      content: 'Vaping questions answered: UK delivery, returns & tech support.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://www.vapourism.co.uk/faq'
    },
    {
      property: 'og:site_name',
      content: 'Vapourism'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary'
    },
    {
      name: 'twitter:site',
      content: '@vapourismuk'
    },
    {
      name: 'twitter:title',
      content: 'FAQ - Frequently Asked Questions | Vapourism'
    },
    {
      name: 'twitter:description',
      content: 'Get answers to common questions about vaping products, UK delivery, age verification, and more.'
    },
    // JSON-LD Structured Data
    {
      "script:ld+json": faqSchema
    }
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  return json({
    header: await context.storefront.query(`#graphql
      query FAQHeader {
        shop {
          name
        }
      }
    `),
    footer: await context.storefront.query(`#graphql
      query FAQFooter {
        shop {
          name
        }
      }
    `),
    cart: await context.cart.get(),
    isLoggedIn: await context.customerAccount.isLoggedIn(),
    publicStoreDomain: context.env.PUBLIC_STORE_DOMAIN,
  });
}

export default function FAQ() {
  const {header, footer, cart, isLoggedIn, publicStoreDomain} = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filter FAQ items based on search and category
  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(item => {
      const matchesSearch = searchTerm === '' ||
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || selectedCategory === category.id;
      return matchesSearch && matchesCategory;
    })
  })).filter(category => category.questions.length > 0);

  const toggleExpanded = (categoryId: string, questionIndex: number) => {
    const itemId = `${categoryId}-${questionIndex}`;
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'border-purple-200 bg-purple-50 text-purple-800',
      blue: 'border-blue-200 bg-blue-50 text-blue-800',
      green: 'border-green-200 bg-green-50 text-green-800',
      amber: 'border-amber-200 bg-amber-50 text-amber-800',
      red: 'border-red-200 bg-red-50 text-red-800',
      indigo: 'border-indigo-200 bg-indigo-50 text-indigo-800',
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Vapourism
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find instant answers to common questions about ordering, delivery, products, and more.
              Can&apos;t find what you&apos;re looking for? <Link to="/contact" className="text-purple-600 hover:underline">Contact our support team</Link>.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {faqCategories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFAQs.map(category => {
              const Icon = category.icon;
              return (
                <div key={category.id} className={`border rounded-lg p-6 ${getColorClasses(category.color)}`}>
                  <div className="flex items-center mb-6">
                    <Icon className="w-8 h-8 mr-3" />
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>

                  <div className="space-y-4">
                    {category.questions.map((item, index) => {
                      const itemId = `${category.id}-${index}`;
                      const isExpanded = expandedItems.includes(itemId);

                      return (
                        <div key={item.question} className="bg-white rounded-lg border border-gray-200">
                          <button
                            onClick={() => toggleExpanded(category.id, index)}
                            className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 border-t border-gray-100">
                              <p className="text-gray-700 leading-relaxed pt-4">{item.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <HelpCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or browse all categories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-purple-600 hover:underline"
              >
                Clear search and show all FAQs
              </button>
            </div>
          )}

          {/* Still Need Help */}
          <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-lg mb-6 opacity-90">
              Our friendly customer service team is here to help with any questions not covered in our FAQ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                to="/help"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Help Centre
              </Link>
            </div>
            <div className="mt-6 text-sm opacity-80">
              <p>📞 Phone: 0123 456 7890 | ✉️ Email: hello@vapourism.co.uk</p>
              <p>Monday-Friday: 9AM-6PM | Response within 24 hours</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400 text-sm">
            © 2024 Vapourism. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}