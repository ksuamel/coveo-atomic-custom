import { newSpecPage } from '@stencil/core/testing';
import { AtomicCustomTab } from './atomic-custom-tab';

describe('atomic-custom-tab', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [AtomicCustomTab],
      html: '<atomic-custom-tab></atomic-custom-tab>',
    });
    expect(root).toEqualHtml(`
      <atomic-custom-tab>
        <mock:shadow-root>
          <div>
            tab
          </div>
        </mock:shadow-root>
      </atomic-custom-tab>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [AtomicCustomTab],
      html: `<atomic-custom-tab first="Stencil" last="'Don't call me a framework' JS"></atomic-custom-tab>`,
    });
    expect(root).toEqualHtml(`
      <atomic-custom-tab first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </atomic-custom-tab>
    `);
  });
});
