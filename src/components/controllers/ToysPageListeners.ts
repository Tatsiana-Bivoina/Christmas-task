import { API, target } from '../../../node_modules/nouislider/dist/nouislider';
import { ToysPageController } from './ToysPageController';

export class ToysPageListeners {
  toysPageController: ToysPageController;

  constructor() {
    this.toysPageController = new ToysPageController();
  }

  addListenerToFiltersByValue(type: string) {
    const elBlock: HTMLDivElement | null = document.querySelector(`.${type}`);
    let elementsArr: string[] = [];
    const values: string[] | undefined = localStorage.getItem(`${type}`)?.split(',');
    if (values) {
      elementsArr = values;
    }
    if (elBlock) {
      elBlock.addEventListener('click', (ev: Event) => {
        const currentEl: HTMLElement | null = ev.target as HTMLElement;
        const currentElValue: string | undefined = currentEl.dataset.filter;

        if (currentElValue && currentEl.classList.contains('active')) {
          currentEl.classList.remove('active');
          elementsArr.splice(elementsArr.indexOf(currentElValue), 1);
        } else {
          currentEl.classList.add('active');
          if (currentElValue) {
            elementsArr.push(currentElValue);
          }
        }

        localStorage.setItem(`${type}`, `${elementsArr}`);
        this.toysPageController.filterCardsByValue(type);
      });
    }
  }

  addListenerToFavoiriteBlock(): void {
    const favouriteInput: HTMLInputElement | null = document.querySelector('.favorite-input');
    favouriteInput?.addEventListener('click', () => {
      if (favouriteInput.checked) {
        localStorage.setItem('favourite', `${true}`);
      } else {
        localStorage.setItem('favourite', `${false}`);
      }
      this.toysPageController.filterCardsByFavourite();
    });
  }

  addListenerToSortSelect(): void {
    const sortSelect: HTMLSelectElement | null = document.querySelector('.sort-select');
    const sortSelectOptions: NodeListOf<Element> = document.querySelectorAll('.sort-select option');
    sortSelect?.addEventListener('change', () => {
      localStorage.setItem('sort', `${sortSelect.options[sortSelect.selectedIndex].value}`);
      sortSelectOptions.forEach((el) => {
        el.removeAttribute('selected');
      });
      sortSelectOptions[sortSelect.selectedIndex].setAttribute('selected', 'selected');
      this.toysPageController.sortCards();
    });
  }

  private resetFilters() {
    const shapeButtons: NodeListOf<Element> = document.querySelectorAll('.shape button');
    const colorButtons: NodeListOf<Element> = document.querySelectorAll('.color button');
    const sizeButtons: NodeListOf<Element> = document.querySelectorAll('.size button');
    const favouriteInput: HTMLInputElement | null = document.querySelector('.favorite-input');
    const countSlider: target = <target>document.querySelector('.count-slider');
    const yearSlider: target = <target>document.querySelector('.year-slider');
    const sliderOutputs: NodeListOf<Element> = document.querySelectorAll('.slider-output');

    shapeButtons.forEach((el: Element) => {
      el.classList.remove('active');
    });

    colorButtons.forEach((el: Element) => {
      el.classList.remove('active');
    });

    sizeButtons.forEach((el: Element) => {
      el.classList.remove('active');
    });

    if (favouriteInput) favouriteInput.checked = false;

    if (countSlider) {
      (<API>countSlider.noUiSlider).set([1, 12]);
      sliderOutputs[0].innerHTML = '1';
      sliderOutputs[1].innerHTML = '12';
    }

    if (yearSlider) {
      (<API>yearSlider.noUiSlider).set([1940, 2020]);
      sliderOutputs[2].innerHTML = '1940';
      sliderOutputs[3].innerHTML = '2020';
    }

    this.toysPageController.filteredCardsCollection = this.toysPageController.cardsCollection;
    this.toysPageController.renderAllCards();
  }

  addListenerToResetSettingsBtn(): void {
    const btnReset: HTMLElement | null = document.querySelector('.sort .reset-settings');
    const select: HTMLDivElement | null = document.querySelector('.select span');
    const sortSelectOptions: NodeListOf<Element> = document.querySelectorAll('.sort-select option');

    btnReset?.addEventListener('click', () => {
      if (localStorage.getItem('shape')) {
        localStorage.removeItem('shape');
      }
      if (localStorage.getItem('color')) {
        localStorage.removeItem('color');
      }
      if (localStorage.getItem('size')) {
        localStorage.removeItem('size');
      }
      if (localStorage.getItem('favourite')) {
        localStorage.removeItem('favourite');
      }
      if (localStorage.getItem('countSliderValues')) {
        localStorage.removeItem('countSliderValues');
      }
      if (localStorage.getItem('yearSliderValues')) {
        localStorage.removeItem('yearSliderValues');
      }
      if (localStorage.getItem('sort')) {
        localStorage.removeItem('sort');
      }
      if (localStorage.getItem('favouriteCards')) {
        localStorage.removeItem('favouriteCards');
      }
      if (localStorage.getItem('favouriteCount')) {
        localStorage.removeItem('favouriteCount');
      }
      if (select) {
        select.innerHTML = '0';
      }
      sortSelectOptions.forEach((el) => {
        el.removeAttribute('selected');
      });
      sortSelectOptions[0].setAttribute('selected', 'selected');
      this.resetFilters();
    });
  }

  addListenerToResetFilterBtn(): void {
    const btnReset: HTMLElement | null = document.querySelector('.reset-filters');

    btnReset?.addEventListener('click', () => {
      this.resetFilters();
    });
  }

  addListenerToCards(): void {
    const cardsContainer: HTMLDivElement | null = document.querySelector('.cards-container');
    const select: HTMLDivElement | null = document.querySelector('.select span');

    cardsContainer?.addEventListener('click', (event: Event) => {
      const card: EventTarget | null = event.target;
      const cardEl = card as HTMLElement;
      if (cardEl.classList.contains('card')) {
        if (!cardEl.classList.contains('active')) {
          if (this.toysPageController.favouriteCollection.length < 20) {
            cardEl.classList.add('active');
            this.toysPageController.addToFavouriteCollection(cardEl, select);
          } else {
            alert('Извините, все слоты заполнены');
          }
        } else {
          cardEl.classList.remove('active');
          this.toysPageController.deleteFromFavouriteCollection(cardEl, select);
        }
      }
    });
  }
}
