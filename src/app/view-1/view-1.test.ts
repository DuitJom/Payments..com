import { describe, it, expect } from 'vitest';
import View1 from './view-1.js';

describe('View1', () => {
  it('<app-view-1> is an instance of View1', async () => {
    const element = document.createElement('app-view-1');
    expect(element).to.be.instanceOf(View1);
  });
});
