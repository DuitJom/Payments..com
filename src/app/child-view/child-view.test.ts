import { describe, it, expect } from 'vitest';
import ChildView from './child-view.js';

describe('ChildView', () => {
  it('<app-child-view> is an instance of ChildView', async () => {
    const element = document.createElement('app-child-view');
    expect(element).to.be.instanceOf(ChildView);
  });
});
