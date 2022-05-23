import { BaseComponent } from '../../../BaseComponent';
import './favorites-decorate-container.scss';

export class FavoritesDecorateContainerView extends BaseComponent {
  constructor() {
    super('div', ['favorites-decorate-container']);
  }

  createFavoritesDecorateContainerView(): HTMLElement {
    const fragment: DocumentFragment = document.createDocumentFragment();
    for (let i = 1; i < 6; i++) {
      const div = document.createElement('div');
      div.className = 'tree-decorate';
      const img = document.createElement('img');
      img.className = 'tree-decorate-img';
      img.setAttribute('src', `./assets/tree/${i}.png`);
      img.setAttribute('alt', 'decorate-tree');
      div.appendChild(img);
      fragment.appendChild(div);
    }
    this.element.appendChild(fragment);
    return this.element;
  }
}
