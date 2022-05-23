import { BaseComponent } from '../../../BaseComponent';
import { SnowflakesView } from '../snowflakes/SnowflakesView';
import './main-tree-container.scss';

export class MainTreeContainerView extends BaseComponent {
  private snowflakes: SnowflakesView;

  constructor() {
    super('div', ['main-tree-container']);
    this.snowflakes = new SnowflakesView();
  }

  createMainTreeContainerView(): HTMLElement {
    const fragment: DocumentFragment = document.createDocumentFragment();
    fragment.appendChild(this.snowflakes.createSnowflakesView());
    const div = document.createElement('div');
    div.className = 'garland-tree-container';

    const map = document.createElement('map');
    map.setAttribute('name', 'tree-map');

    const area = document.createElement('area');
    area.setAttribute(
      'coords',
      '365,699,189,706,113,683,31,608,2,555,2,539,18,437,73,351,106,224,161,134,243,-1,306,75,353,144,399,221,424,359,452,459,496,550,444,664'
    );
    area.setAttribute('shape', 'poly');
    map.appendChild(area);

    const img = document.createElement('img');
    img.className = 'main-tree';
    img.setAttribute('src', './assets/tree/1.png');
    img.setAttribute('usemap', '#tree-map');
    img.setAttribute('alt', 'tree');

    fragment.append(div, map, img);
    this.element.appendChild(fragment);
    return this.element;
  }
}
