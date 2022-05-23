import { BaseComponent } from '../../../BaseComponent';
import './range.scss';

export class RangeView extends BaseComponent {
  constructor() {
    super('div', ['range']);
  }

  renderRangeBlock(): HTMLElement {
    this.element.innerHTML = `
      <div class="controls-title">Фильтры по диапазону</div>
      <div class="count">
        <span class="control-span">Количество экземпляров:</span> 
        <div class="count-slider-container">
          <output class="slider-output">1</output>
          <div id="count-slider" class="count-slider"></div>
          <output class="slider-output">12</output>
        </div>          
      </div>
      <div class="year">
        <span class="control-span">Год приобретения:</span> 
        <div class="year-slider-container">
          <output class="slider-output">1940</output>
          <div id="year-slider" class="year-slider"></div>
          <output class="slider-output">2020</output>
        </div>          
      </div>
    `;
    return this.element;
  }
}
