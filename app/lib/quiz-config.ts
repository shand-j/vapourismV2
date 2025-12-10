/**
 * Quiz Configuration for Tailored Shopping Experiences
 * 
 * Defines the step-by-step quiz flows for:
 * - Flavour Lab: E-liquids, disposables, nicotine pouches discovery
 * - Device Studio: Hardware selection and comparison
 * 
 * Uses the controlled vocabulary tag system from the data analyst's spec.
 */

export type ProductCategory = 
  | 'e-liquid'
  | 'nicotine_pouches'
  | 'disposable'
  | 'device'
  | 'pod_system'
  | 'box_mod'
  | 'tank'
  | 'coil'
  | 'accessory'
  | 'pod'
  | 'CBD';

export type FlavourType = 
  | 'fruity'
  | 'ice'
  | 'tobacco'
  | 'desserts/bakery'
  | 'beverages'
  | 'nuts'
  | 'spices_&_herbs'
  | 'cereal'
  | 'unflavoured';

export type NicotineStrength = 
  | '0mg'
  | '3mg'
  | '6mg'
  | '10mg'
  | '12mg'
  | '15mg'
  | '18mg'
  | '20mg';

export type NicotineType = 
  | 'nic_salt'
  | 'freebase_nicotine'
  | 'traditional_nicotine'
  | 'pouch';

export type BottleSize = 
  | '5ml'
  | '10ml'
  | '20ml'
  | '30ml'
  | '50ml'
  | '100ml'
  | 'shortfill';

export type VGRatio = 
  | '50/50'
  | '60/40'
  | '70/30'
  | '80/20';

export type VapingStyle = 
  | 'mouth-to-lung'
  | 'direct-to-lung'
  | 'restricted-direct-to-lung';

export type DeviceStyle = 
  | 'pen_style'
  | 'pod_style'
  | 'box_style'
  | 'stick_style'
  | 'compact'
  | 'mini';

export type PowerSupply = 
  | 'rechargeable'
  | 'removable_battery';

export type CoilOhm = 
  | '0.3ohm'
  | '0.4ohm'
  | '0.5ohm'
  | '0.6ohm'
  | '0.8ohm'
  | '1.0ohm'
  | '1.2ohm'
  | '1.5ohm';

// Quiz step types
export interface QuizOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: string;
  tags?: string[]; // Tags to apply when selected
}

export interface QuizStep<T = string> {
  id: string;
  question: string;
  subtitle?: string;
  multiSelect?: boolean;
  options: QuizOption<T>[];
  skipable?: boolean;
  dependsOn?: {
    stepId: string;
    values: string[];
  };
}

export interface QuizConfig {
  id: string;
  title: string;
  subtitle: string;
  heroImage: string;
  accentColor: string;
  steps: QuizStep[];
}

// ============================================================================
// FLAVOUR LAB QUIZ CONFIGURATION
// ============================================================================

export const FLAVOUR_LAB_QUIZ: QuizConfig = {
  id: 'flavour-lab',
  title: 'Flavour Lab',
  subtitle: 'Discover your perfect vape flavours with our guided tasting journey',
  heroImage: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1400&q=80',
  accentColor: '#5b2be0',
  steps: [
    {
      id: 'product-type',
      question: 'What type of product are you looking for?',
      subtitle: 'Select all that interest you',
      multiSelect: true,
      options: [
        {
          value: 'e-liquid',
          label: 'E-Liquids',
          description: 'Bottled vape juice for refillable devices',
          tags: ['e-liquid'],
        },
        {
          value: 'disposable',
          label: 'Reusables',
          description: 'Ready-to-use devices with pre-filled flavours',
          tags: ['disposable'],
        },
        {
          value: 'pod',
          label: 'Pre-filled Pods',
          description: 'Replacement pods with pre-filled e-liquid',
          tags: ['pod', 'prefilled_pod'],
        },
        {
          value: 'nicotine_pouches',
          label: 'Nicotine Pouches',
          description: 'Tobacco-free oral nicotine pouches',
          tags: ['nicotine_pouches'],
        },
      ],
    },
    {
      id: 'flavour-profile',
      question: 'What flavour profiles appeal to you?',
      subtitle: 'Select your favourites — we\'ll find matching products',
      multiSelect: true,
      options: [
        {
          value: 'fruity',
          label: 'Fruity',
          description: 'Berry, citrus, tropical and orchard fruits',
          tags: ['fruity'],
        },
        {
          value: 'ice',
          label: 'Ice & Menthol',
          description: 'Cool, refreshing menthol and ice blends',
          tags: ['ice'],
        },
        {
          value: 'desserts/bakery',
          label: 'Desserts & Bakery',
          description: 'Cakes, custards, creams and sweet treats',
          tags: ['desserts/bakery'],
        },
        {
          value: 'tobacco',
          label: 'Tobacco',
          description: 'Classic tobacco and smoky profiles',
          tags: ['tobacco'],
        },
        {
          value: 'beverages',
          label: 'Beverages',
          description: 'Coffee, cola, cocktails and drinks',
          tags: ['beverages'],
        },
        {
          value: 'cereal',
          label: 'Cereal',
          description: 'Breakfast cereals and milk flavours',
          tags: ['cereal'],
        },
      ],
    },
    {
      id: 'nicotine-strength',
      question: 'What nicotine strength do you prefer?',
      subtitle: 'Select one or more strengths',
      multiSelect: true,
      options: [
        {
          value: '0mg',
          label: '0mg',
          description: 'Nicotine-free',
          tags: ['0mg'],
        },
        {
          value: '3mg',
          label: '3mg',
          description: 'Very light',
          tags: ['3mg'],
        },
        {
          value: '6mg',
          label: '6mg',
          description: 'Light',
          tags: ['6mg'],
        },
        {
          value: '10mg',
          label: '10mg',
          description: 'Medium',
          tags: ['10mg'],
        },
        {
          value: '12mg',
          label: '12mg',
          description: 'Medium-strong',
          tags: ['12mg'],
        },
        {
          value: '18mg',
          label: '18mg',
          description: 'Strong',
          tags: ['18mg'],
        },
        {
          value: '20mg',
          label: '20mg',
          description: 'Maximum (UK legal limit)',
          tags: ['20mg'],
        },
      ],
    },
    {
      id: 'nicotine-type',
      question: 'What type of nicotine do you prefer?',
      subtitle: 'Different types suit different vaping styles',
      multiSelect: true,
      skipable: true,
      options: [
        {
          value: 'nic_salt',
          label: 'Nic Salts',
          description: 'Smooth hit, quick absorption — great for pod devices',
          tags: ['nic_salt'],
        },
        {
          value: 'freebase_nicotine',
          label: 'Freebase',
          description: 'Traditional feel, throat hit — suits sub-ohm vaping',
          tags: ['freebase_nicotine'],
        },
        {
          value: 'traditional_nicotine',
          label: 'Traditional',
          description: 'Classic nicotine experience',
          tags: ['traditional_nicotine'],
        },
      ],
    },
    {
      id: 'bottle-size',
      question: 'What bottle size works best for you?',
      subtitle: 'Larger bottles offer better value',
      multiSelect: true,
      skipable: true,
      dependsOn: {
        stepId: 'product-type',
        values: ['e-liquid'],
      },
      options: [
        {
          value: '10ml',
          label: '10ml',
          description: 'Nic salt standard, easy to carry',
          tags: ['10ml'],
        },
        {
          value: '50ml',
          label: '50ml Shortfill',
          description: 'Add your own nicotine shot',
          tags: ['50ml', 'shortfill'],
        },
        {
          value: '100ml',
          label: '100ml Shortfill',
          description: 'Best value for regular vapers',
          tags: ['100ml', 'shortfill'],
        },
      ],
    },
    {
      id: 'vg-ratio',
      question: 'Do you have a VG/PG ratio preference?',
      subtitle: 'VG = more clouds, PG = more flavour and throat hit',
      multiSelect: false,
      skipable: true,
      dependsOn: {
        stepId: 'product-type',
        values: ['e-liquid'],
      },
      options: [
        {
          value: '50/50',
          label: '50/50',
          description: 'Balanced — suits most pod devices',
          tags: ['50/50'],
        },
        {
          value: '70/30',
          label: '70VG/30PG',
          description: 'More clouds, smooth draw',
          tags: ['70/30'],
        },
        {
          value: '80/20',
          label: '80VG/20PG',
          description: 'Maximum clouds, sub-ohm friendly',
          tags: ['80/20'],
        },
      ],
    },
  ],
};

// ============================================================================
// DEVICE STUDIO QUIZ CONFIGURATION
// ============================================================================

export const DEVICE_STUDIO_QUIZ: QuizConfig = {
  id: 'device-studio',
  title: 'Device Studio',
  subtitle: 'Find your perfect vaping device with our guided comparison tool',
  heroImage: 'https://images.unsplash.com/photo-1486591038957-19e7c73bdc41?auto=format&fit=crop&w=1400&q=80',
  accentColor: '#1fb2ff',
  steps: [
    {
      id: 'experience-level',
      question: 'How would you describe your vaping experience?',
      subtitle: 'This helps us recommend the right complexity level',
      multiSelect: false,
      options: [
        {
          value: 'beginner',
          label: 'Just starting out',
          description: 'I\'m new to vaping or switching from smoking',
        },
        {
          value: 'intermediate',
          label: 'Some experience',
          description: 'I\'ve used basic devices and want to upgrade',
        },
        {
          value: 'advanced',
          label: 'Experienced vaper',
          description: 'I know my way around mods and settings',
        },
      ],
    },
    {
      id: 'device-type',
      question: 'What type of device interests you?',
      subtitle: 'Select all that appeal to you',
      multiSelect: true,
      options: [
        {
          value: 'disposable',
          label: 'Reusable',
          description: 'Use and recycle — no maintenance',
          tags: ['disposable'],
        },
        {
          value: 'pod_system',
          label: 'Pod System',
          description: 'Compact, refillable or pre-filled pods',
          tags: ['pod_system'],
        },
        {
          value: 'device',
          label: 'Vape Pen / Starter Kit',
          description: 'Simple devices with replaceable coils',
          tags: ['device'],
        },
        {
          value: 'box_mod',
          label: 'Box Mod',
          description: 'Advanced features, customisable settings',
          tags: ['box_mod'],
        },
      ],
    },
    {
      id: 'vaping-style',
      question: 'How do you prefer to vape?',
      subtitle: 'This affects the draw style and vapour production',
      multiSelect: false,
      options: [
        {
          value: 'mouth-to-lung',
          label: 'Mouth-to-Lung (MTL)',
          description: 'Similar to smoking — draw to mouth then inhale',
          tags: ['mouth-to-lung'],
        },
        {
          value: 'direct-to-lung',
          label: 'Direct-to-Lung (DTL)',
          description: 'Deep inhale straight to lungs — big clouds',
          tags: ['direct-to-lung'],
        },
        {
          value: 'restricted-direct-to-lung',
          label: 'Restricted DTL (RDTL)',
          description: 'Somewhere in between — versatile',
          tags: ['restricted-direct-to-lung'],
        },
      ],
    },
    {
      id: 'device-style',
      question: 'What form factor do you prefer?',
      subtitle: 'Choose based on portability and aesthetics',
      multiSelect: true,
      skipable: true,
      options: [
        {
          value: 'pen_style',
          label: 'Pen Style',
          description: 'Slim, pocket-friendly design',
          tags: ['pen_style'],
        },
        {
          value: 'pod_style',
          label: 'Pod Style',
          description: 'Ultra-compact, lightweight',
          tags: ['pod_style'],
        },
        {
          value: 'box_style',
          label: 'Box Style',
          description: 'Ergonomic grip, larger battery',
          tags: ['box_style'],
        },
        {
          value: 'compact',
          label: 'Compact',
          description: 'Small but feature-packed',
          tags: ['compact'],
        },
      ],
    },
    {
      id: 'power-supply',
      question: 'What power option works best for you?',
      subtitle: 'Consider your usage and charging habits',
      multiSelect: true,
      skipable: true,
      options: [
        {
          value: 'rechargeable',
          label: 'Built-in Rechargeable',
          description: 'USB-C charging, no spare batteries needed',
          tags: ['rechargeable'],
        },
        {
          value: 'removable_battery',
          label: 'Removable Battery',
          description: 'Swap batteries for all-day vaping',
          tags: ['removable_battery'],
        },
      ],
    },
    {
      id: 'coil-resistance',
      question: 'Do you have a coil resistance preference?',
      subtitle: 'Lower ohms = more power and clouds',
      multiSelect: true,
      skipable: true,
      options: [
        {
          value: '0.3ohm',
          label: '0.3Ω',
          description: 'Sub-ohm, high power',
          tags: ['0.3ohm'],
        },
        {
          value: '0.6ohm',
          label: '0.6Ω',
          description: 'Versatile, good balance',
          tags: ['0.6ohm'],
        },
        {
          value: '0.8ohm',
          label: '0.8Ω',
          description: 'RDTL sweet spot',
          tags: ['0.8ohm'],
        },
        {
          value: '1.0ohm',
          label: '1.0Ω+',
          description: 'MTL, lower power',
          tags: ['1.0ohm', '1.2ohm'],
        },
      ],
    },
    {
      id: 'nicotine-preference',
      question: 'What nicotine approach do you prefer?',
      subtitle: 'This affects compatible e-liquid types',
      multiSelect: true,
      skipable: true,
      options: [
        {
          value: 'nic_salt',
          label: 'Nic Salts',
          description: 'Higher strength, smooth hit',
          tags: ['nic_salt'],
        },
        {
          value: 'freebase_nicotine',
          label: 'Freebase',
          description: 'Traditional, throat hit',
          tags: ['freebase_nicotine'],
        },
        {
          value: '0mg',
          label: 'Nicotine-Free',
          description: 'Just for the flavour',
          tags: ['0mg'],
        },
      ],
    },
  ],
};

// ============================================================================
// QUIZ STATE MANAGEMENT
// ============================================================================

export interface QuizState {
  currentStepIndex: number;
  answers: Record<string, string[]>;
  completedSteps: string[];
}

export const initialQuizState: QuizState = {
  currentStepIndex: 0,
  answers: {},
  completedSteps: [],
};

/**
 * Build search tags from quiz answers
 */
export function buildSearchTagsFromAnswers(
  config: QuizConfig,
  answers: Record<string, string[]>,
): string[] {
  const tags: string[] = [];

  for (const step of config.steps) {
    const selectedValues = answers[step.id] || [];
    for (const value of selectedValues) {
      const option = step.options.find((opt) => opt.value === value);
      if (option?.tags) {
        tags.push(...option.tags);
      }
    }
  }

  // Deduplicate
  return Array.from(new Set(tags));
}

/**
 * Build URL search params from quiz answers
 */
export function buildSearchParamsFromAnswers(
  config: QuizConfig,
  answers: Record<string, string[]>,
): URLSearchParams {
  const tags = buildSearchTagsFromAnswers(config, answers);
  const params = new URLSearchParams();

  // Add each tag as a tag filter parameter
  for (const tag of tags) {
    params.append('tag', tag);
  }

  // Add quiz source for analytics
  params.set('source', config.id);

  return params;
}

/**
 * Determine if a step should be shown based on dependencies
 */
export function shouldShowStep(
  step: QuizStep,
  answers: Record<string, string[]>,
): boolean {
  if (!step.dependsOn) return true;

  const dependencyAnswers = answers[step.dependsOn.stepId] || [];
  return step.dependsOn.values.some((value) => dependencyAnswers.includes(value));
}

/**
 * Get the next visible step index
 */
export function getNextStepIndex(
  config: QuizConfig,
  currentIndex: number,
  answers: Record<string, string[]>,
): number | null {
  for (let i = currentIndex + 1; i < config.steps.length; i++) {
    const step = config.steps[i];
    if (shouldShowStep(step, answers)) {
      return i;
    }
  }
  return null; // Quiz complete
}

/**
 * Get the previous visible step index
 */
export function getPreviousStepIndex(
  config: QuizConfig,
  currentIndex: number,
  answers: Record<string, string[]>,
): number | null {
  for (let i = currentIndex - 1; i >= 0; i--) {
    const step = config.steps[i];
    if (shouldShowStep(step, answers)) {
      return i;
    }
  }
  return null; // At start
}

/**
 * Calculate quiz progress percentage
 */
export function calculateProgress(
  config: QuizConfig,
  currentIndex: number,
  answers: Record<string, string[]>,
): number {
  const visibleSteps = config.steps.filter((step) => shouldShowStep(step, answers));
  const currentVisibleIndex = visibleSteps.findIndex(
    (_, i) => config.steps.indexOf(visibleSteps[i]) >= currentIndex,
  );
  
  if (visibleSteps.length === 0) return 100;
  return Math.round(((currentVisibleIndex + 1) / visibleSteps.length) * 100);
}
