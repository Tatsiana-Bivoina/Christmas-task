import { BaseComponent } from '../../BaseComponent';
import './start-page.scss';

export class StartPageView extends BaseComponent {
  constructor() {
    super('div', ['start-page']);
  }

  createStartPage(): HTMLElement {
    this.element.className = 'page start-page';
    this.element.setAttribute('data-page', 'startPage');
    this.element.innerHTML = `
      <div class="ball ball1"></div>
      <div class="ball ball2"></div>
      <h1 class="start-page-title">Новогодняя игра «Наряди ёлку»</h1>
      <button class="switch-toys-page" data-page="toysPage">Начать</button>
    `;
    return this.element;
  }
}
