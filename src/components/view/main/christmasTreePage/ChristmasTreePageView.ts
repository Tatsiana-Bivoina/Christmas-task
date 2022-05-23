import { BaseComponent } from '../../BaseComponent';
import './christmas-tree-page.scss';
import { PageContainerView } from './pageContainer/PageContainerView';

export class ChristmasTreePageView extends BaseComponent {
  private pageContainer: PageContainerView;

  constructor() {
    super('div', ['christmas-tree-page']);
    this.pageContainer = new PageContainerView();
  }

  createChristmasTreePage(): HTMLElement {
    this.element.className = 'page christmas-tree-page';
    this.element.setAttribute('data-page', 'christmas-tree-page');
    const fragment: DocumentFragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.className = 'blur';
    div.appendChild(this.pageContainer.createPageContainerView());
    fragment.appendChild(div);
    this.element.appendChild(fragment);
    return this.element;
  }
}
