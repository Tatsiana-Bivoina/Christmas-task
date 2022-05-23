import { BaseComponent } from '../../../BaseComponent';
import './sort.scss';

export class SortView extends BaseComponent {
  constructor() {
    super('div', ['sort']);
    this.renderSortBlock();
  }

  private renderSortBlock(): void {
    this.element.innerHTML = `
      <div class="controls-title">Сортировка</div>
      <select class="sort-select">
        <option selected="" value="sort-name-max">По названию от «А» до «Я»</option>
        <option value="sort-name-min">По названию от «Я» до «А»</option>
        <option value="sort-count-max">По году покупки по возрастанию</option>
        <option value="sort-count-min">По году покупки по убыванию</option>
      </select>
      <button class="reset-filters">Сброс фильтров</button>
      <button class="reset-settings">Сброс настроек</button>
    `;
  }
}
