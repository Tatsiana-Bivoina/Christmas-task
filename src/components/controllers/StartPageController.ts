import { LoadStartPage } from './LoadStartPage';

export class StartPageController {
  mainBlock: HTMLDivElement | null;

  constructor() {
    this.mainBlock = document.querySelector('.main');
  }

  renderStartPage() {
    if (this.mainBlock) {
      while (this.mainBlock.firstChild) {
        this.mainBlock.removeChild(this.mainBlock.firstChild);
      }
      this.mainBlock.appendChild(new LoadStartPage().getStartPageView());
    }
  }
}
