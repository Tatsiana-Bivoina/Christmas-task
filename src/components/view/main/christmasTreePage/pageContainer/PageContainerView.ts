import { BaseComponent } from '../../../BaseComponent';
import { BgContainerView } from '../bgContainer/BgContainerView';
import { FavoriteAsideView } from '../favoritesAside/FavoriteAsideView';
import { GarlandContainerView } from '../garlandContainer/GarlandContainerView';
import { MainTreeContainerView } from '../mainTreeContainer/MainTreeContainerView';
import { SnowAudioContainerView } from '../snowAudioContainer/snowAudioContainerView';
import { TreeContainerView } from '../tree-container/TreeContainerView';
import './page-container.scss';

export class PageContainerView extends BaseComponent {
  snowAudioContainer: SnowAudioContainerView;
  treeContainer: TreeContainerView;
  bgContainer: BgContainerView;
  garlandContainer: GarlandContainerView;
  private mainTreeContainer: MainTreeContainerView;
  private favoriteAside: FavoriteAsideView;

  constructor() {
    super('div', ['page-container']);
    this.snowAudioContainer = new SnowAudioContainerView();
    this.treeContainer = new TreeContainerView();
    this.bgContainer = new BgContainerView();
    this.garlandContainer = new GarlandContainerView();
    this.mainTreeContainer = new MainTreeContainerView();
    this.favoriteAside = new FavoriteAsideView();
  }

  createPageContainerView(): HTMLElement {
    const fragment: DocumentFragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.className = 'favorites-menu';
    div.appendChild(this.snowAudioContainer.createSnowAudioContainerView());
    div.appendChild(this.treeContainer.createTreeContainerView());
    div.appendChild(this.bgContainer.createBgContainerView());
    div.appendChild(this.garlandContainer.createGarlandContainerView());
    fragment.append(
      div,
      this.mainTreeContainer.createMainTreeContainerView(),
      this.favoriteAside.createFavoriteAsideView()
    );
    this.element.appendChild(fragment);
    return this.element;
  }
}
