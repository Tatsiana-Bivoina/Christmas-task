import { BaseComponent } from '../../../BaseComponent';
import './bg-container.scss';

export class BgContainerView extends BaseComponent {
  private bgCollection: number[];

  constructor() {
    super('div', ['bg-container']);
    this.bgCollection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  createBgContainerView(): HTMLElement {
    this.element.className = 'bg-container menu-container';
    const fragment: DocumentFragment = document.createDocumentFragment();
    this.bgCollection.forEach((el: number) => {
      const bg = document.createElement('div');
      bg.className = 'bg menu-item';
      bg.setAttribute('data-bg', `${el}`);
      fragment.appendChild(bg);
    });
    this.element.appendChild(fragment);
    return this.element;
  }
}
