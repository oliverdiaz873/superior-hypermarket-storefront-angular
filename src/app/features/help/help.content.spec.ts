import { describe, it, expect } from 'vitest';
import { HELP_CATEGORIES, isValidHelpCategory, isValidHelpTopic } from './help.content';

describe('help.content', () => {
  it('has 7 categories and 21 topics', () => {
    expect(HELP_CATEGORIES.length).toBe(7);
    const total = HELP_CATEGORIES.reduce((a, c) => a + c.topics.length, 0);
    expect(total).toBe(21);
  });

  it('validates category', () => {
    expect(isValidHelpCategory('orders')).toBe(true);
    expect(isValidHelpCategory('invalid')).toBe(false);
  });

  it('validates topic', () => {
    expect(isValidHelpTopic('orders', 'track')).toBe(true);
    expect(isValidHelpTopic('orders', 'invalid')).toBe(false);
    expect(isValidHelpTopic('invalid', 'track')).toBe(false);
  });

  it('all slugs are ascii', () => {
    const re = /^[a-z0-9-]+$/;
    for (const cat of HELP_CATEGORIES) {
      expect(re.test(cat.id)).toBe(true);
      for (const t of cat.topics) expect(re.test(t.id)).toBe(true);
    }
  });
});
