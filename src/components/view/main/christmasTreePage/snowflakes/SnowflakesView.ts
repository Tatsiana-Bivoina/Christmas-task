import { BaseComponent } from '../../../BaseComponent';
import './snowflakes.scss';

export class SnowflakesView extends BaseComponent {
  constructor() {
    super('div', ['snowflakes']);
  }

  createSnowflakesView(): HTMLElement {
    this.element.className = 'snowflakes hide';
    const fragment: DocumentFragment = document.createDocumentFragment();
    for (let i = 0; i < 126; i++) {
      const el = document.createElement('i');
      fragment.appendChild(el);
    }
    this.element.appendChild(fragment);
    return this.element;
  }
}
