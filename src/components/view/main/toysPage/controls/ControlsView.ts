import { BaseComponent } from '../../../BaseComponent';
import { FiltersView } from '../filters/FiltersView';
import { RangeView } from '../range/RangeView';
import { SortView } from '../sort/SortView';
import './controls.scss';

export class ControlsView extends BaseComponent {
  private filtersBlock: FiltersView;
  private rangeBlock: RangeView;
  private sortBlock: SortView;

  constructor() {
    super('div', ['controls']);
    this.filtersBlock = new FiltersView();
    this.rangeBlock = new RangeView();
    this.sortBlock = new SortView();
  }

  createControlsBlock(): HTMLElement {
    const fragment: DocumentFragment = document.createDocumentFragment();
    fragment.appendChild(this.filtersBlock.renderFilterBlock());
    fragment.appendChild(this.rangeBlock.renderRangeBlock());
    fragment.appendChild(this.sortBlock.element);
    this.element.appendChild(fragment);
    return this.element;
  }
}
