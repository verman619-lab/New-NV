import { NicheCategory } from '../types';

export const NICHES: NicheCategory[] = [
  {
    id: 'dentist',
    label: 'Dentists & Dental Clinics',
    geoapifyCategory: 'healthcare.dentist',
    iconName: 'Stethoscope',
    description: 'Local general, cosmetic, and pediatric dental practices',
    commonProblems: [
      'No online booking widgets',
      'Hero image lacks patient trust proof',
      'Phone CTA hidden on mobile views',
      'Outdated Google review badge'
    ]
  },
  {
    id: 'restaurant',
    label: 'Restaurants & Dining',
    geoapifyCategory: 'catering.restaurant',
    iconName: 'Utensils',
    description: 'Independent restaurants, bistros, and eateries',
    commonProblems: [
      'PDF menu instead of web menu',
      'Missing online table reservation link',
      'No mobile click-to-call for takeout orders',
      'Slow loading hero imagery'
    ]
  },
  {
    id: 'lawyer',
    label: 'Lawyers & Legal Services',
    geoapifyCategory: 'office.lawyer,service.financial',
    iconName: 'Scale',
    description: 'Personal injury, family law, and corporate attorneys',
    commonProblems: [
      'Generic headline with zero value proposition',
      'No instant case evaluation form',
      'Missing client outcome case studies',
      'Non-responsive contact forms'
    ]
  },
  {
    id: 'hvac',
    label: 'HVAC & Plumbing Contractors',
    geoapifyCategory: 'service.construction,service.handyman',
    iconName: 'Wrench',
    description: 'Heating, air conditioning, and emergency plumbing',
    commonProblems: [
      'No 24/7 emergency dispatch callout banner',
      'Form requires too many fields on mobile',
      'Missing service area coverage badges',
      'Slow mobile page speed'
    ]
  },
  {
    id: 'real_estate',
    label: 'Real Estate Agents & Agencies',
    geoapifyCategory: 'service.real_estate',
    iconName: 'Home',
    description: 'Residential property brokers and boutique realtors',
    commonProblems: [
      'Slow home search embed',
      'Missing immediate home valuation widget',
      'No recent client testimonial slider',
      'Inconsistent contact button placement'
    ]
  },
  {
    id: 'auto_repair',
    label: 'Auto Repair & Detailing',
    geoapifyCategory: 'service.vehicle',
    iconName: 'Car',
    description: 'Mechanic shops, tire centers, and auto spa detailing',
    commonProblems: [
      'No online appointment booking module',
      'Missing transparent pricing schedule',
      'No map/directions CTA above the fold',
      'Unoptimized mobile images'
    ]
  },
  {
    id: 'roofing',
    label: 'Roofing & Exterior Contractors',
    geoapifyCategory: 'service.construction',
    iconName: 'Hammer',
    description: 'Roof repair, siding, and storm restoration services',
    commonProblems: [
      'No instant roof estimate calculator tool',
      'Missing before/after gallery modal',
      'No emergency storm repair contact banner',
      'Non-clickable phone numbers'
    ]
  },
  {
    id: 'accounting',
    label: 'CPA & Accounting Firms',
    geoapifyCategory: 'office.financial',
    iconName: 'Calculator',
    description: 'Tax preparers, CPAs, and business bookkeepers',
    commonProblems: [
      'No secure portal upload button',
      'Missing tax deadline calendar reminder CTA',
      'Dense wall of text without benefit bullet points',
      'Vague CTA buttons like "Learn More"'
    ]
  },
  {
    id: 'gym',
    label: 'Gyms & Fitness Studios',
    geoapifyCategory: 'sport.fitness',
    iconName: 'Dumbbell',
    description: 'CrossFit, Pilates, martial arts, and personal training',
    commonProblems: [
      'No free trial pass claim popup or banner',
      'Class schedule is a low-res image instead of live table',
      'Missing instructor bio highlights',
      'Hidden membership pricing'
    ]
  },
  {
    id: 'medspa',
    label: 'MedSpas & Beauty Salons',
    geoapifyCategory: 'healthcare.clinic_or_praxis,beauty',
    iconName: 'Sparkles',
    description: 'Aesthetics, laser centers, skin clinics, and day spas',
    commonProblems: [
      'No direct online booking software integration',
      'Missing clear before-and-after skin treatment photos',
      'No special consultation discount offer badge',
      'Complex navigation layout'
    ]
  }
];
