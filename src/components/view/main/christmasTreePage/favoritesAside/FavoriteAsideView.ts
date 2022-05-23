import { BaseComponent } from '../../../BaseComponent';
import { FavoritesContainerView } from '../favoritesContainer/FavoritesContainerView';
import { FavoritesDecorateView } from '../favoritesDecorate/FavoritesDecorateView';
import './favorites-aside.scss';

export class FavoriteAsideView extends BaseComponent {
  private favoritesContainer: FavoritesContainerView;
  private favoritesDecorate: FavoritesDecorateView;

  constructor() {
    super('div', ['favorites-aside']);
    this.favoritesContainer = new FavoritesContainerView();
    this.favoritesDecorate = new FavoritesDecorateView();
  }

  createFavoriteAsideView(): HTMLElement {
    const fragment: DocumentFragment = document.createDocumentFragment();
    fragment.appendChild(this.favoritesContainer.element);
    fragment.appendChild(this.favoritesDecorate.createFavoritesDecorateView());
    this.element.appendChild(fragment);
    return this.element;
  }
}
