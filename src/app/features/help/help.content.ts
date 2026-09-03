export const HELP_CATEGORIES = [
  {
    id: 'orders',
    topics: [
      { id: 'track', orderContext: true },
      { id: 'cancel', orderContext: true },
      { id: 'address', orderContext: true },
      { id: 'late-delivery', orderContext: true },
    ],
  },
  {
    id: 'returns',
    topics: [
      { id: 'policy' },
      { id: 'damaged', orderContext: true },
      { id: 'refund', orderContext: true },
    ],
  },
  {
    id: 'account',
    topics: [
      { id: 'create' },
      { id: 'login' },
      { id: 'data' },
      { id: 'logout' },
    ],
  },
  {
    id: 'payments',
    topics: [
      { id: 'methods' },
      { id: 'pending', orderContext: true },
      { id: 'invoice' },
    ],
  },
  {
    id: 'products',
    topics: [
      { id: 'availability' },
      { id: 'offers' },
      { id: 'search' },
    ],
  },
  {
    id: 'stores',
    topics: [
      { id: 'contact' },
      { id: 'pickup' },
    ],
  },
  {
    id: 'other',
    topics: [
      { id: 'privacy' },
      { id: 'other' },
    ],
  },
] as const;

export type HelpCategoryId = (typeof HELP_CATEGORIES)[number]['id'];
export type HelpTopicId = (typeof HELP_CATEGORIES)[number]['topics'][number]['id'];

export function isValidHelpCategory(category: string): boolean {
  return HELP_CATEGORIES.some((c) => c.id === category);
}

export function isValidHelpTopic(category: string, topic: string): boolean {
  const cat = HELP_CATEGORIES.find((c) => c.id === category);
  if (!cat) return false;
  return cat.topics.some((t) => t.id === topic);
}

export function getHelpCategory(category: string) {
  return HELP_CATEGORIES.find((c) => c.id === category) ?? null;
}

export function getHelpTopic(category: string, topic: string) {
  const cat = getHelpCategory(category);
  if (!cat) return null;
  return cat.topics.find((t) => t.id === topic) ?? null;
}
