import { BaseComponent } from '../../BaseComponent';
import { CardsContainerView } from './cardsContainer/CardsContainerView';
import { ControlsView } from './controls/ControlsView';
import './toys-page.scss';

export class ToysPageView extends BaseComponent {
  private controls: ControlsView;
  private cardsContainer: CardsContainerView;

  constructor() {
    super('div', ['toys-page']);
    this.controls = new ControlsView();
    this.cardsContainer = new CardsContainerView();
  }

  createToysPage(): HTMLElement {
    this.element.className = 'page toys-page';
    this.element.setAttribute('data-page', 'toysPage');
    const fragment: DocumentFragment = document.createDocumentFragment();
    const blur: HTMLDivElement = document.createElement('div');
    blur.className = 'blur';
    blur.appendChild(this.controls.createControlsBlock());
    blur.appendChild(this.cardsContainer.element);
    fragment.appendChild(blur);
    this.element.appendChild(fragment);
    return this.element;
  }
}
