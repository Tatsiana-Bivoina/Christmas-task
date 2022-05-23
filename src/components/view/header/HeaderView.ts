import { NavigationView } from '../navigation/NavigationView';
import { HeaderControlsView } from '../header-controls/HeaderControlsView';
import { BaseComponent } from '../BaseComponent';
import './header.scss';

export class HeaderView extends BaseComponent {
  private headerContainer: HTMLElement;
  private navigation: NavigationView;
  private headerControls: HeaderControlsView;

  constructor() {
    super('header', ['header']);
    this.headerContainer = document.createElement('div');
    this.navigation = new NavigationView();
    this.headerControls = new HeaderControlsView();
    this.createHeader();
  }

  private createHeader(): void {
    this.headerContainer.className = 'header-container';
    this.headerContainer.appendChild(this.navigation.element);
    this.headerContainer.appendChild(this.headerControls.element);
    this.element.appendChild(this.headerContainer);
  }
}
