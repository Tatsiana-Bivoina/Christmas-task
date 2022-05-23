import { StartPageView } from '../view/main/startPage/StartPageView';

export class LoadStartPage {
  getStartPageView(): HTMLElement {
    return new StartPageView().createStartPage();
  }
}
