import { BaseComponent } from '../BaseComponent';
import './header-controls.scss';

export class HeaderControlsView extends BaseComponent {
  constructor() {
    super('div', ['header-controls']);
    this.createHeaderControls();
  }

  private createHeaderControls(): void {
    this.element.innerHTML = `
      <input type="search" class="search" autocomplete="off">
      <div class="select">
        <span>0</span>
      </div>
    `;
  }
}
