import { Bindings, initializeBindings } from '@coveo/atomic';
import { Component, Element, h, Prop, State } from '@stencil/core';
import { TabState, Tab as HeadlessTab, TabOptions, TabProps, buildTab, Unsubscribe, loadFacetOptionsActions } from '@coveo/headless';

@Component({
  tag: 'atomic-custom-tab',
  styleUrl: 'atomic-custom-tab.css',
  shadow: true,
})

/**
 * The `custom-tab` component will provide a tab functionality in the search interface.
 *
 * @part tab-anchor - the tab anchor tag.
 * @part tab-label - the tab label.
 */
export class AtomicCustomTab {
  @Prop() expression!: string;
  @Prop() label!: string;
  @Prop() isActive!: boolean;
  @Prop() excludedFacets!: string;
  @Prop() fullFacetList!: string;

  private bindings?: Bindings;
  private error?: Error;
  private tabController!: HeadlessTab;
  private tabUnsubscribe: Unsubscribe = () => {};
  private excludedFacetsList!: string[];
  private hasFacetList: boolean = false;
  private hasFullFacetList: boolean = false;

  @Element() private host!: Element;
  @State() private tabState!: TabState;

  public async connectedCallback() {
    await customElements.whenDefined('atomic-search-interface');
    try {
      this.bindings = await initializeBindings(this.host);

      this.hasFacetList = this.excludedFacets ? true : false;
      this.hasFullFacetList = this.fullFacetList ? true : false;

      const options: TabOptions = {
        id: this.label,
        expression: this.expression,
      };

      const props: TabProps = {
        initialState: { isActive: this.isActive },
        options: options,
      };

      this.tabController = buildTab(this.bindings.engine, props);

      //Subscribe to controller state changes.
      this.tabUnsubscribe = this.tabController.subscribe(() => this.updateState());
    } catch (error) {
      console.error(error);
      this.error = error as Error;
    }
  }

  public disconnectedCallback() {
    this.tabUnsubscribe();
  }

  private updateState() {
    this.tabState = this.tabController.state;

    if (this.tabState.isActive && this.hasFacetList && this.hasFullFacetList) {
      this.excludedFacetsList = this.excludedFacets.split(',');
      const enabledFacets = this.fullFacetList.split(',').filter(f => !this.excludedFacetsList.includes(f.trim()));
      this.disableExcludedFacets(this.excludedFacetsList);
      this.enableExcludedFacets(enabledFacets);
    }
  }

  private disableExcludedFacets(facets: string[]) {
    if (this.bindings) {
      const { disableFacet } = loadFacetOptionsActions(this.bindings.engine);
      facets.forEach(facet => {
        this.bindings?.engine.dispatch(disableFacet(facet.trimStart()));
      });
    }
  }

  private enableExcludedFacets(facets: string[]) {
    if (this.bindings) {
      const { enableFacet } = loadFacetOptionsActions(this.bindings.engine);
      facets.forEach(facet => {
        this.bindings?.engine.dispatch(enableFacet(facet.trimStart()));
      });
    }
  }

  public render() {
    if (this.error) {
      return <div>Error when initializing the component, please view the console for more information.</div>;
    }

    if (!this.bindings || !this.tabState) {
      return;
    }

    const activeClass = this.tabState.isActive ? 'active' : '';
    return (
      <a part="tab-anchor" class={activeClass} onClick={() => this.tabController.select()}>
        <span part="tab-label">{this.label}</span>
      </a>
    );
  }
}
