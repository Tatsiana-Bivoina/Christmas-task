import { CardType } from '../models/cardType';
import { ChristmasTreePageController } from './ChristmasTreePageController';
import { ToysPageController } from './ToysPageController';

export class LocalStorageData {
  toysPageController: ToysPageController;
  private christmasTreeController: ChristmasTreePageController;

  constructor() {
    this.toysPageController = new ToysPageController();
    this.christmasTreeController = new ChristmasTreePageController();
  }

  getFromLocalStorage(type: string): void {
    const values: string[] | undefined = localStorage.getItem(type)?.split(',');
    if (values && values != ['']) {
      values.forEach((el) => {
        const element: Element | null = document.querySelector(`.${type} button[data-filter="${el}"]`);
        element?.classList.add('active');
      });
    }
  }

  changeFavouriteBlockByLocalStorage(): void {
    const favorite: string | null = localStorage.getItem('favourite');
    const favoriteInput: HTMLInputElement | null = document.querySelector('.favorite-input');

    if (favorite && favorite == 'true' && favoriteInput) {
      favoriteInput.checked = true;
    }
  }

  changeSortSelectByLocalStorage(): void {
    const selectedOptionValue: string | null = localStorage.getItem('sort');
    const sortSelectOptions: NodeListOf<HTMLSelectElement> = document.querySelectorAll('.sort-select option');

    sortSelectOptions.forEach((el) => {
      if (el.value == selectedOptionValue) {
        el.setAttribute('selected', 'selected');
      } else {
        el.removeAttribute('selected');
      }
    });
    this.toysPageController.sortCards();
  }

  changeFavouriteCardsCountByLocalStorage(): void {
    const select: HTMLDivElement | null = document.querySelector('.select span');
    const favouriteCount: string | null = localStorage.getItem('favouriteCount');
    if (select && favouriteCount) {
      select.innerHTML = `${favouriteCount}`;
    }
  }

  changeFavouriteCardsByLocalStorage(): void {
    const cardEl: NodeListOf<Element> = document.querySelectorAll('.card');
    const cards: string | null = localStorage.getItem('favouriteCards');
    if (cards) {
      const favouriteCards: CardType[] = JSON.parse(cards);
      cardEl.forEach((el: Element) => {
        favouriteCards.forEach((elem: CardType) => {
          if (el.firstElementChild?.textContent == elem.name) {
            el.classList.add('active');
          }
        });
      });
    }
  }

  // Christmas Tree Page

  changeAudioConditionByLocalStorage(audio: HTMLMediaElement): void {
    const audioControl: HTMLElement | null = document.querySelector('.audio-control');
    const christmasTreeContainer: HTMLElement | null = document.querySelector('.christmas-tree-page');
    const condition: string | null = localStorage.getItem('audio');

    if (audioControl && condition && condition == 'played') {
      audioControl.classList.add('active');

      christmasTreeContainer?.addEventListener(
        'click',
        () => {
          audio.play();
        },
        { once: true }
      );
    }
  }

  changeSnowflakesByLocalStorage(): void {
    const snowControl: HTMLElement | null = document.querySelector('.snow-control');
    const snowflakes: HTMLElement | null = document.querySelector('.snowflakes');
    const isSnowFall: string | null = localStorage.getItem('snowflakes');

    if (snowControl && isSnowFall && isSnowFall == 'true') {
      snowControl.classList.add('active');
      snowflakes?.classList.remove('hide');
    }
  }

  changeMainTreeByLocalStorage(): void {
    const mainTree: HTMLElement | null = document.querySelector('.main-tree');
    const mainTreeNum: string | null = localStorage.getItem('mainTreeNum');

    if (mainTree && mainTreeNum) {
      mainTree.setAttribute('src', `./assets/tree/${mainTreeNum}.png`);
    }
  }

  changeBgMainTreeByLocalStorage(): void {
    const mainTreeContainer: HTMLDivElement | null = document.querySelector('.main-tree-container');
    const mainTreeBgNum: string | null = localStorage.getItem('mainTreeBgNum');

    if (mainTreeContainer && mainTreeBgNum) {
      mainTreeContainer.style.backgroundImage = `url(./assets/bg/${mainTreeBgNum}.jpg)`;
    }
  }

  changeGarlandByLocalStorage(): void {
    const garlandState: string | null = localStorage.getItem('isGarlandOn');
    const garlandColor: string | null = localStorage.getItem('garlandColor');
    const switchEl: HTMLDivElement | null = document.querySelector('.onoffswitch-switch');
    const switchInner: HTMLDivElement | null = document.querySelector('.onoffswitch-inner');

    if (garlandState && garlandState == 'true' && switchEl && switchInner) {
      this.christmasTreeController.createGarland(garlandColor);
      switchEl.style.right = '55px';
      switchInner.style.marginLeft = '-100%';
    }
  }
}
