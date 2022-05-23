import { CardType } from '../../../../models/cardType';
import { BaseComponent } from '../../../BaseComponent';
import './favorites-card.scss';

export class FavoriteCardView extends BaseComponent {
  constructor() {
    super('div', ['favorites-card']);
  }

  createFavoritesCard(model: CardType): HTMLElement {
    this.element.setAttribute('data-num', `${model.num}`);
    const fragment: DocumentFragment = document.createDocumentFragment();
    const paragraph = document.createElement('p');
    paragraph.className = 'favorites-count';
    paragraph.innerHTML = `${model.count}`;
    fragment.append(paragraph);
    for (let i = model.count; i > 0; i--) {
      const img = document.createElement('img');
      img.id = `${model.num}-${i}`;
      img.className = 'favorites-card-img';
      img.setAttribute('src', `./assets/toys/${model.num}.png`);
      img.setAttribute('alt', 'toy');
      img.setAttribute('draggable', 'true');
      img.setAttribute('data-imgnum', `${model.num}`);
      fragment.append(img);
    }
    this.element.appendChild(fragment);
    return this.element;
  }
}
