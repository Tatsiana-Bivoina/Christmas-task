import { BaseComponent } from '../../../BaseComponent';
import { FavoritesDecorateContainerView } from '../favoritesDecorateContainer/FavoritesDecorateContainerView';

export class FavoritesDecorateView extends BaseComponent {
  private favoritesDecorateContainer: FavoritesDecorateContainerView;

  constructor() {
    super('div', ['favorites-decorate']);
    this.favoritesDecorateContainer = new FavoritesDecorateContainerView();
  }

  createFavoritesDecorateView(): HTMLElement {
    const fragment: DocumentFragment = document.createDocumentFragment();
    fragment.appendChild(this.favoritesDecorateContainer.createFavoritesDecorateContainerView());
    const btn = document.createElement('button');
    btn.className = 'reset-settings';
    btn.innerText = 'Сброс настроек';
    fragment.append(btn);
    this.element.appendChild(fragment);
    return this.element;
  }
}
