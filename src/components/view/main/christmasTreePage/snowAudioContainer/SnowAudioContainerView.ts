import { BaseComponent } from '../../../BaseComponent';
import './snow-audio-container.scss';

export class SnowAudioContainerView extends BaseComponent {
  constructor() {
    super('div', ['snow-audio-container']);
  }

  createSnowAudioContainerView(): HTMLElement {
    this.element.className = 'snow-audio-container menu-container';
    this.element.innerHTML = `
      <div class="audio-control menu-item"></div>
      <div class="snow-control menu-item"></div>          
    `;

    return this.element;
  }
}
