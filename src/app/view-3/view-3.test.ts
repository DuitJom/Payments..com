import { describe, it, expect } from 'vitest';
import View3 from './view-3.js';

describe('View3', () => {
  it('<app-view-3> is an instance of View3', async () => {
    const element = document.createElement('app-view-3');
    expect(element).to.be.instanceOf(View3);
  });
});
