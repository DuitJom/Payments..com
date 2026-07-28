import { describe, it, expect } from 'vitest';
import View2 from './view-2.js';

describe('View2', () => {
  it('<app-view-2> is an instance of View2', async () => {
    const element = document.createElement('app-view-2');
    expect(element).to.be.instanceOf(View2);
  });
});
