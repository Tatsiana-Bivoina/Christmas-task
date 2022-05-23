import { ToysPageView } from '../view/main/toysPage/ToysPageView';

export class LoadToysPage {
  getToysPageView(): HTMLElement {
    return new ToysPageView().createToysPage();
  }
}
