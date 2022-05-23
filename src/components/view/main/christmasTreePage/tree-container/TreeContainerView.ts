import { BaseComponent } from '../../../BaseComponent';
import './tree-container.scss';

export class TreeContainerView extends BaseComponent {
  private treeCollection: number[];

  constructor() {
    super('div', ['tree-container']);
    this.treeCollection = [1, 2, 3, 4, 5, 6];
  }

  createTreeContainerView(): HTMLElement {
    this.element.className = 'tree-container menu-container';
    const fragment: DocumentFragment = document.createDocumentFragment();
    this.treeCollection.forEach((el: number) => {
      const div = document.createElement('div');
      div.className = 'tree menu-item';
      div.setAttribute('data-tree', `${el}`);
      fragment.appendChild(div);
    });
    this.element.appendChild(fragment);
    return this.element;
  }
}
