import { CardType } from '../models/cardType';
import { CardView } from '../view/main/toysPage/card/CardView';
import { LoadToysPage } from './LoadToysPage';
import data from '../../data';

export class ToysPageController {
  cardsCollection: CardType[];
  filteredCardsCollection: CardType[];
  favouriteCollection: CardType[];
  mainBlock: HTMLDivElement | null;

  constructor() {
    this.mainBlock = document.querySelector('.main');
    this.cardsCollection = [];
    this.filteredCardsCollection = [];
    this.favouriteCollection = [];
    this.getCardsCollection();
    this.getFavouriteCards();
  }

  getCardsCollection(): CardType[] {
    this.cardsCollection = data.map((el) => {
      return {
        num: Number(el.num),
        name: el.name,
        count: Number(el.count),
        year: Number(el.year),
        shape: el.shape,
        color: el.color,
        size: el.size,
        favorite: el.favorite ? 'Да' : 'Нет',
      };
    });
    this.filteredCardsCollection = this.cardsCollection;
    return this.cardsCollection;
  }

  getFavouriteCards(): void {
    const cards: string | null = localStorage.getItem('favouriteCards');
    if (cards) {
      this.favouriteCollection = JSON.parse(cards);
    }
  }

  private getAllCardsView(): HTMLElement[] {
    return this.filteredCardsCollection.map((el: CardType) => {
      return new CardView().createCardsContainer(el);
    });
  }

  renderAllCards(): void {
    const cardsContainer: HTMLDivElement | null = document.querySelector('.cards-container');
    if (cardsContainer) {
      while (cardsContainer.firstChild) {
        cardsContainer.removeChild(cardsContainer.firstChild);
      }
      cardsContainer.append(...this.getAllCardsView());
    }
  }

  renderToysPage(): void {
    if (this.mainBlock) {
      while (this.mainBlock.firstChild) {
        this.mainBlock.removeChild(this.mainBlock.firstChild);
      }
      this.mainBlock.appendChild(new LoadToysPage().getToysPageView());
    }
  }

  filterCardsByValue(type: string): void {
    this.filteredCardsCollection = [];
    if (localStorage.getItem(`${type}`) != null) {
      if (localStorage.getItem(`${type}`) == '') {
        this.filteredCardsCollection = this.cardsCollection;
      } else {
        const elements: string[] | undefined = localStorage
          .getItem(`${type}`)
          ?.split(',')
          .filter((el) => el != '');
        if (type == 'shape') {
          elements?.forEach((el: string) => {
            this.filteredCardsCollection = this.filteredCardsCollection.concat(
              this.cardsCollection.filter((elem: CardType) => elem.shape == el)
            );
          });
        }
        if (type == 'color') {
          elements?.forEach((el: string) => {
            this.filteredCardsCollection = this.filteredCardsCollection.concat(
              this.cardsCollection.filter((elem: CardType) => elem.color == el)
            );
          });
        }
        if (type == 'size') {
          elements?.forEach((el: string) => {
            this.filteredCardsCollection = this.filteredCardsCollection.concat(
              this.cardsCollection.filter((elem: CardType) => elem.size == el)
            );
          });
        }
      }
      this.renderAllCards();
    }
  }

  filterCardsByFavourite(): void {
    this.filteredCardsCollection = [];
    if (localStorage.getItem('favourite') != null) {
      if (localStorage.getItem('favourite') == 'true') {
        this.filteredCardsCollection = this.cardsCollection.filter((elem: CardType) => elem.favorite == 'Да');
      } else {
        this.filteredCardsCollection = this.cardsCollection;
      }
      this.renderAllCards();
    }
  }

  filterCardsByRange(type: string): void {
    this.filteredCardsCollection = [];
    if (localStorage.getItem(`${type}SliderValues`) != null) {
      const values: string | null = localStorage.getItem(`${type}SliderValues`);
      if (values) {
        const valuesArr: string[] = values.split(',');
        if (type == 'count') {
          this.filteredCardsCollection = this.cardsCollection.filter(
            (elem: CardType) => elem.count >= Number(valuesArr[0]) && elem.count <= Number(valuesArr[1])
          );
        }
        if (type == 'year') {
          this.filteredCardsCollection = this.cardsCollection.filter(
            (elem: CardType) => elem.year >= Number(valuesArr[0]) && elem.year <= Number(valuesArr[1])
          );
        }
      }
    }
    this.renderAllCards();
  }

  sortCards() {
    if (localStorage.getItem('sort') != null) {
      const sort: string | null = localStorage.getItem('sort');
      switch (sort) {
        case 'sort-name-max':
          this.filteredCardsCollection = this.sortNameMax();
          break;
        case 'sort-name-min':
          this.filteredCardsCollection = this.sortNameMin();
          break;
        case 'sort-count-max':
          this.filteredCardsCollection = this.sortCountMax();
          break;
        case 'sort-count-min':
          this.filteredCardsCollection = this.sortCountMin();
          break;
      }
      this.renderAllCards();
    }
  }

  sortNameMax(): CardType[] {
    return this.filteredCardsCollection.sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  sortNameMin(): CardType[] {
    return this.filteredCardsCollection.sort((a, b) => (a.name < b.name ? 1 : -1));
  }

  sortCountMax(): CardType[] {
    return this.filteredCardsCollection.sort((a, b) => (a.year > b.year ? 1 : -1));
  }

  sortCountMin(): CardType[] {
    return this.filteredCardsCollection.sort((a, b) => (a.year < b.year ? 1 : -1));
  }

  addToFavouriteCollection(cardEl: HTMLElement, select: HTMLDivElement | null): void {
    const card: CardType = this.cardsCollection.filter(
      (el: CardType) => el.name == cardEl.firstElementChild?.textContent
    )[0];
    this.favouriteCollection.push(card);
    if (select) {
      select.innerHTML = `${this.favouriteCollection.length}`;
    }
    localStorage.setItem('favouriteCount', `${this.favouriteCollection.length}`);
    localStorage.setItem('favouriteCards', `${JSON.stringify(this.favouriteCollection)}`);
  }

  deleteFromFavouriteCollection(cardEl: HTMLElement, select: HTMLDivElement | null): void {
    const card: CardType = this.cardsCollection.filter(
      (el: CardType) => el.name == cardEl.firstElementChild?.textContent
    )[0];
    this.favouriteCollection.forEach((el: CardType, index: number) => {
      if (el.name == card.name) {
        this.favouriteCollection.splice(index, 1);
      }
    });
    if (select) {
      select.innerHTML = `${this.favouriteCollection.length}`;
    }
    localStorage.setItem('favouriteCount', `${this.favouriteCollection.length}`);
    localStorage.setItem('favouriteCards', `${JSON.stringify(this.favouriteCollection)}`);
  }
}
