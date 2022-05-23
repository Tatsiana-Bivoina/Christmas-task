import { ChristmasTreePageView } from '../view/main/christmasTreePage/ChristmasTreePageView';

export class LoadChristmasTreePage {
  getChristmasTreePageView(): HTMLElement {
    return new ChristmasTreePageView().createChristmasTreePage();
  }
}
