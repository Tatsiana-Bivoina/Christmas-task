import { BaseComponent } from '../../../BaseComponent';
import './garland-container.scss';

export class GarlandContainerView extends BaseComponent {
  constructor() {
    super('div', ['garland-container']);
  }

  createGarlandContainerView(): HTMLElement {
    this.element.className = 'garland-container menu-container';
    this.element.innerHTML = `         
      <div class="garland-btns">
        <button class="color-btn multicolor-btn" data-color="multicolor"></button>
        <button class="color-btn red-btn" data-color="red"></button>
        <button class="color-btn blue-btn" data-color="blue"></button>
        <button class="color-btn yellow-btn" data-color="yellow"></button>
        <button class="color-btn green-btn" data-color="green"></button>
      </div>
      <div class="onoffswitch">
        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" checked="">
        <label class="onoffswitch-label" for="myonoffswitch">
            <div class="onoffswitch-inner"></div>
            <div class="onoffswitch-switch"></div>
        </label>
      </div>
    `;

    return this.element;
  }
}
