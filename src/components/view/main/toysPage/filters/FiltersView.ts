import { BaseComponent } from '../../../BaseComponent';
import './filters.scss';

export class FiltersView extends BaseComponent {
  constructor() {
    super('div', ['filters']);
  }

  renderFilterBlock(): HTMLElement {
    this.element.innerHTML = `
      <div class="controls-title">Фильтры по значению</div>
      <div class="shape">Форма:  
        <button data-filter="шар"></button>
        <button data-filter="колокольчик"></button>
        <button data-filter="шишка"></button>
        <button data-filter="снежинка"></button>
        <button data-filter="фигурка"></button>
      </div>
      <div class="color">Цвет:   
        <button data-filter="белый"></button>
        <button data-filter="желтый"></button>
        <button data-filter="красный"></button>
        <button data-filter="синий"></button>
        <button data-filter="зелёный"></button>
      </div>
      <div class="size">Размер: 
        <button data-filter="большой"></button>
        <button data-filter="средний"></button>
        <button data-filter="малый"></button>
      </div>
      <div class="favorite-container">Только любимые:
        <div class="form-group">
          <input type="checkbox" class="favorite-input" id="checkbox">
          <label for="checkbox" class="favorite-input-label"></label>
        </div>   
      </div> 
    `;
    return this.element;
  }
}
