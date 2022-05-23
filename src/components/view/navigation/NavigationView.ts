import { BaseComponent } from '../BaseComponent';
import './navigation.scss';

export class NavigationView extends BaseComponent {
  constructor() {
    super('nav', ['navigation']);
    this.createNav();
  }

  private createNav(): void {
    this.element.className = 'nav-bar';
    this.element.innerHTML = `
      <a class="start-page-link" href="#"></a>
      <a class="toys-page-link" href="#">Игрушки</a>
      <a class="christmas-tree-page-link" href="#">Ёлка</a>
    `;
  }
}
