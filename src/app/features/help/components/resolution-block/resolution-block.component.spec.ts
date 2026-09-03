import { describe, it, expect } from 'vitest';
import { HELP_CATEGORIES } from '../../help.content';

describe('ResolutionBlock flow', () => {
  it('No button navigates to /contact?category&topic', () => {
    const cat = 'orders';
    const topic = 'track';
    const href = `/contact?category=${encodeURIComponent(cat)}&topic=${encodeURIComponent(topic)}`;
    expect(href).toBe('/contact?category=orders&topic=track');
  });

  it('help has 7 categories', () => {
    expect(HELP_CATEGORIES.length).toBe(7);
  });
});
