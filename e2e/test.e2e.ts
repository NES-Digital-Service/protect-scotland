import {expect, device, element, by} from 'detox';

describe('E2E journey', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });
});
