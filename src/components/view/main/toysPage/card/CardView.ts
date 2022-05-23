import { CardType } from '../../../../models/cardType';
import { BaseComponent } from '../../../BaseComponent';
import './card.scss';

export class CardView extends BaseComponent {
  constructor() {
    super('div', ['card']);
  }

  createCardsContainer(model: CardType): HTMLElement {
    this.element.innerHTML = `
      <h2 class="card-title">${model.name}</h2>
      <img class="card-img" src="./assets/toys/${model.num}.png" alt="toy">
      <div class="card-description">      
        <p class="count">Количество:<span>${model.count}</span></p>
        <p class="year">Год покупки:<span>${model.year}</span></p>
        <p class="shape">Форма:<span>${model.shape}</span></p>
        <p class="color">Цвет:<span>${model.color}</span></p>
        <p class="size">Размер:<span>${model.size}</span></p>
        <p class="favorite">Любимая:<span>${model.favorite}</span></p>
      </div>
      <div class="ribbon"></div>
    `;
    return this.element;
  }
}
