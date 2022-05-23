import { CardType } from '../models/cardType';
import { FavoriteCardView } from '../view/main/christmasTreePage/favoritesCard/FavoritesCardView';
import { LoadChristmasTreePage } from './LoadChristmasTreePage';
import { ToysPageController } from './ToysPageController';

export class ChristmasTreePageController {
  private mainBlock: HTMLDivElement | null;
  private toysPageController: ToysPageController;
  favouriteCardsCollection: CardType[];

  constructor() {
    this.mainBlock = document.querySelector('.main');
    this.toysPageController = new ToysPageController();
    this.favouriteCardsCollection = [];
  }

  private getFavoriteToys(): CardType[] {
    const favoriteCards: string | null = localStorage.getItem('favouriteCards');

    if (favoriteCards && favoriteCards != '[]') {
      return JSON.parse(favoriteCards);
    } else {
      return this.getCardsCollection();
    }
  }

  private getCardsCollection() {
    const cardArr: CardType[] = [];
    for (let i = 0; i < this.toysPageController.cardsCollection.length; i++) {
      if (i < 20) {
        cardArr.push(this.toysPageController.cardsCollection[i]);
      } else {
        break;
      }
    }
    return cardArr;
  }

  private getAllFavouriteCardsView(): HTMLElement[] {
    this.favouriteCardsCollection = this.getFavoriteToys();
    return this.favouriteCardsCollection.map((el: CardType) => {
      return new FavoriteCardView().createFavoritesCard(el);
    });
  }

  renderAllFavoriteCards(): void {
    const favoritecardsContainer: HTMLDivElement | null = document.querySelector('.favorites-container');
    if (favoritecardsContainer) {
      while (favoritecardsContainer.firstChild) {
        favoritecardsContainer.removeChild(favoritecardsContainer.firstChild);
      }
      favoritecardsContainer.append(...this.getAllFavouriteCardsView());
    }
  }

  renderChristmasTreePage() {
    if (this.mainBlock) {
      while (this.mainBlock.firstChild) {
        this.mainBlock.removeChild(this.mainBlock.firstChild);
      }
      this.mainBlock.appendChild(new LoadChristmasTreePage().getChristmasTreePageView());
    }
  }

  createGarland(garlandColor: string | null) {
    const garlandContainer = document.querySelector('.garland-tree-container');

    if (garlandContainer) {
      const fragment: DocumentFragment = document.createDocumentFragment();
      fragment.appendChild(this.createGarlandLine1(garlandColor));
      fragment.appendChild(this.createGarlandLine2(garlandColor));
      fragment.appendChild(this.createGarlandLine3(garlandColor));
      fragment.appendChild(this.createGarlandLine4(garlandColor));
      fragment.appendChild(this.createGarlandLine5(garlandColor));
      fragment.appendChild(this.createGarlandLine6(garlandColor));
      fragment.appendChild(this.createGarlandLine7(garlandColor));
      fragment.appendChild(this.createGarlandLine8(garlandColor));
      garlandContainer.appendChild(fragment);
    }
  }

  private createGarlandLine1(garlandColor: string | null = 'multicolor'): HTMLElement {
    const ul = document.createElement('ul');
    ul.className = 'lightrope';
    ul.style.width = '120px';
    ul.style.height = '120px';
    let rotate = 65;
    for (let i = 0; i < 5; i++) {
      const li = document.createElement('li');
      li.className = `${garlandColor}`;
      li.style.transform = `rotate(${rotate}deg) translate(60px) rotate(-${rotate}deg)`;
      ul.appendChild(li);
      rotate += 12;
    }
    return ul;
  }

  private createGarlandLine2(garlandColor: string | null = 'multicolor'): HTMLElement {
    const ul = document.createElement('ul');
    ul.className = 'lightrope';
    ul.style.width = '170px';
    ul.style.height = '170px';
    let rotate = 60;
    for (let i = 0; i < 7; i++) {
      const li = document.createElement('li');
      li.className = `${garlandColor}`;
      li.style.transform = `rotate(${rotate}deg) translate(85px) rotate(-${rotate}deg)`;
      ul.appendChild(li);
      rotate += 10;
    }
    return ul;
  }

  private createGarlandLine3(garlandColor: string | null = 'multicolor'): HTMLElement {
    const ul = document.createElement('ul');
    ul.className = 'lightrope';
    ul.style.width = '230px';
    ul.style.height = '230px';
    let rotate = 60;
    for (let i = 0; i < 8; i++) {
      const li = document.createElement('li');
      li.className = `${garlandColor}`;
      li.style.transform = `rotate(${rotate}deg) translate(115px) rotate(-${rotate}deg)`;
      ul.appendChild(li);
      rotate += 8;
    }
    return ul;
  }

  private createGarlandLine4(garlandColor: string | null = 'multicolor'): HTMLElement {
    const ul = document.createElement('ul');
    ul.className = 'lightrope';
    ul.style.width = '300px';
    ul.style.height = '300px';
    let rotate = 60;
    for (let i = 0; i < 11; i++) {
      const li = document.createElement('li');
      li.className = `${garlandColor}`;
      li.style.transform = `rotate(${rotate}deg) translate(150px) rotate(-${rotate}deg)`;
      ul.appendChild(li);
      rotate += 6;
    }
    return ul;
  }

  private createGarlandLine5(garlandColor: string | null = 'multicolor'): HTMLElement {
    const ul = document.createElement('ul');
    ul.className = 'lightrope';
    ul.style.width = '380px';
    ul.style.height = '380px';
    let rotate = 55;
    for (let i = 0; i < 18; i++) {
      const li = document.createElement('li');
      li.className = `${garlandColor}`;
      li.style.transform = `rotate(${rotate}deg) translate(190px) rotate(-${rotate}deg)`;
      ul.appendChild(li);
      rotate += 4;
    }
    return ul;
  }

  private createGarlandLine6(garlandColor: string | null = 'multicolor'): HTMLElement {
    const ul = document.createElement('ul');
    ul.className = 'lightrope';
    ul.style.width = '465px';
    ul.style.height = '465px';
    let rotate = 55;
    for (let i = 0; i < 21; i++) {
      const li = document.createElement('li');
      li.className = `${garlandColor}`;
      li.style.transform = `rotate(${rotate}deg) translate(232.5px) rotate(-${rotate}deg)`;
      ul.appendChild(li);
      rotate += 3.5;
    }
    return ul;
  }

  private createGarlandLine7(garlandColor: string | null = 'multicolor'): HTMLElement {
    const ul = document.createElement('ul');
    ul.className = 'lightrope';
    ul.style.width = '555px';
    ul.style.height = '555px';
    let rotate = 58;
    for (let i = 0; i < 24; i++) {
      const li = document.createElement('li');
      li.className = `${garlandColor}`;
      li.style.transform = `rotate(${rotate}deg) translate(277.5px) rotate(-${rotate}deg)`;
      ul.appendChild(li);
      rotate += 3;
    }
    return ul;
  }

  private createGarlandLine8(garlandColor: string | null = 'multicolor'): HTMLElement {
    const ul = document.createElement('ul');
    ul.className = 'lightrope';
    ul.style.width = '650px';
    ul.style.height = '650px';
    let rotate = 58;
    for (let i = 0; i < 29; i++) {
      const li = document.createElement('li');
      li.className = `${garlandColor}`;
      li.style.transform = `rotate(${rotate}deg) translate(325px) rotate(-${rotate}deg)`;
      ul.appendChild(li);
      rotate += 2.5;
    }
    return ul;
  }

  clearLocalStorage() {
    if (localStorage.getItem('audio')) {
      localStorage.removeItem('audio');
    }
    if (localStorage.getItem('snowflakes')) {
      localStorage.removeItem('snowflakes');
    }
    if (localStorage.getItem('mainTreeNum')) {
      localStorage.removeItem('mainTreeNum');
    }
    if (localStorage.getItem('mainTreeBgNum')) {
      localStorage.removeItem('mainTreeBgNum');
    }
    if (localStorage.getItem('garlandColor')) {
      localStorage.removeItem('garlandColor');
    }
    if (localStorage.getItem('isGarlandOn')) {
      localStorage.removeItem('isGarlandOn');
    }
  }

  resetToOriginalState(audio: HTMLMediaElement) {
    const audioControl: HTMLElement | null = document.querySelector('.audio-control');
    const snowControl: HTMLElement | null = document.querySelector('.snow-control');
    const snowflakes: HTMLElement | null = document.querySelector('.snowflakes');
    const mainTree: HTMLElement | null = document.querySelector('.main-tree');
    const mainTreeContainer: HTMLDivElement | null = document.querySelector('.main-tree-container');
    const switchEl: HTMLDivElement | null = document.querySelector('.onoffswitch-switch');
    const switchInner: HTMLDivElement | null = document.querySelector('.onoffswitch-inner');
    const garlandContainer: HTMLDivElement | null = document.querySelector('.garland-tree-container');

    audioControl?.classList.remove('active');
    audio.pause();

    snowControl?.classList.remove('active');
    snowflakes?.classList.add('hide');

    mainTree?.setAttribute('src', './assets/tree/1.png');

    if (mainTreeContainer && switchEl && switchInner) {
      mainTreeContainer.style.backgroundImage = 'url(./assets/bg/1.jpg)';
      switchEl.style.right = '0';
      switchInner.style.marginLeft = '0';
    }

    while (garlandContainer?.firstChild) {
      garlandContainer.removeChild(garlandContainer.firstChild);
    }
  }
}
