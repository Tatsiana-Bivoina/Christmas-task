import { ToysPageController } from './components/controllers/ToysPageController';
import { FooterView } from './components/view/footer/FooterView';
import { HeaderView } from './components/view/header/HeaderView';
import { MainView } from './components/view/main/MainView';
import { StartPageController } from './components/controllers/StartPageController';
import { NoUiSliderController } from './components/controllers/NoUiSliderController';
import { ChristmasTreePageController } from './components/controllers/ChristmasTreePageController';
import { ChristmasTreeListeners } from './components/controllers/ChristmasTreeListeners';
import { ToysPageListeners } from './components/controllers/ToysPageListeners';
import { LocalStorageData } from './components/controllers/LocalStorageData';

export class App {
  private readonly header: HeaderView;
  private readonly main: MainView;
  private readonly footer: FooterView;
  private startPageController: StartPageController;
  private toysPageController: ToysPageController;
  private christmasPageController: ChristmasTreePageController;
  private isDestroy: boolean;
  private noUiSlider: NoUiSliderController;
  private toysPageListeners: ToysPageListeners;
  private christmasTreeListeners: ChristmasTreeListeners;
  private localStorageData: LocalStorageData;

  constructor() {
    this.header = new HeaderView();
    document.body.appendChild(this.header.element);
    this.main = new MainView();
    document.body.appendChild(this.main.element);
    this.footer = new FooterView();
    document.body.appendChild(this.footer.element);

    this.startPageController = new StartPageController();
    this.startPageController.renderStartPage();
    this.toysPageController = new ToysPageController();
    this.christmasPageController = new ChristmasTreePageController();
    this.isDestroy = false;
    this.noUiSlider = new NoUiSliderController();
    this.toysPageListeners = new ToysPageListeners();
    this.christmasTreeListeners = new ChristmasTreeListeners();
    this.localStorageData = new LocalStorageData();
  }

  start(): void {
    const navBar: HTMLElement | null = document.querySelector('.nav-bar');
    if (localStorage.getItem('favouriteCount')) {
      this.localStorageData.changeFavouriteCardsCountByLocalStorage();
    }

    if (navBar) {
      navBar.addEventListener('click', (e: Event) => {
        const navBtn: EventTarget | null = e.target;

        if ((navBtn as HTMLElement).classList.contains('start-page-link')) {
          this.startPageController.renderStartPage();
          if (this.isDestroy) {
            this.addListenerBtnBegin();
          }
        }
        if ((navBtn as HTMLElement).classList.contains('toys-page-link')) {
          this.isDestroy = true;
          this.switchToToysPage();
        }
        if ((navBtn as HTMLElement).classList.contains('christmas-tree-page-link')) {
          this.switchToChristmasTreePage();
        }
      });
    }
    this.addListenerBtnBegin();
  }

  addListenerBtnBegin(): void {
    const btnStart: HTMLElement | null = document.querySelector('.switch-toys-page');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        this.switchToToysPage();
      });
    }
  }

  switchToToysPage(): void {
    this.toysPageController.renderToysPage();
    this.toysPageController.renderAllCards();
    if (localStorage.getItem('shape')) {
      this.localStorageData.getFromLocalStorage('shape');
    }
    if (localStorage.getItem('color')) {
      this.localStorageData.getFromLocalStorage('color');
    }
    if (localStorage.getItem('size')) {
      this.localStorageData.getFromLocalStorage('size');
    }
    if (localStorage.getItem('favourite')) {
      this.localStorageData.changeFavouriteBlockByLocalStorage();
    }
    if (localStorage.getItem('sort')) {
      this.localStorageData.changeSortSelectByLocalStorage();
    }
    if (localStorage.getItem('favouriteCards')) {
      this.localStorageData.changeFavouriteCardsByLocalStorage();
    }

    this.noUiSlider.createCountSlider();
    this.noUiSlider.createYearSlider();

    this.toysPageListeners.addListenerToFiltersByValue('shape');
    this.toysPageListeners.addListenerToFiltersByValue('color');
    this.toysPageListeners.addListenerToFiltersByValue('size');
    this.toysPageListeners.addListenerToFavoiriteBlock();
    this.toysPageListeners.addListenerToSortSelect();
    this.toysPageListeners.addListenerToResetFilterBtn();
    this.toysPageListeners.addListenerToResetSettingsBtn();
    this.toysPageListeners.addListenerToCards();
  }

  switchToChristmasTreePage(): void {
    this.christmasPageController.renderChristmasTreePage();
    this.christmasPageController.renderAllFavoriteCards();
    const audio = new Audio();
    audio.src = './assets/audio/audio.mp3';
    audio.loop = true;
    if (localStorage.getItem('audio')) {
      this.localStorageData.changeAudioConditionByLocalStorage(audio);
    }
    if (localStorage.getItem('snowflakes')) {
      this.localStorageData.changeSnowflakesByLocalStorage();
    }
    if (localStorage.getItem('mainTreeNum')) {
      this.localStorageData.changeMainTreeByLocalStorage();
    }
    if (localStorage.getItem('mainTreeBgNum')) {
      this.localStorageData.changeBgMainTreeByLocalStorage();
    }
    if (localStorage.getItem('isGarlandOn')) {
      this.localStorageData.changeGarlandByLocalStorage();
    }

    this.christmasTreeListeners.addListenerToAudioControl(audio);
    this.christmasTreeListeners.addListenerToSnowControl();
    this.christmasTreeListeners.addListenerToTreeContainer();
    this.christmasTreeListeners.addListenerToBgContainer();
    this.christmasTreeListeners.addListenerToOnOffSwitch();
    this.christmasTreeListeners.addListenerToGarlandsBtns();
    this.christmasTreeListeners.addListenerToBtnClearLocalStorage(audio);
    this.christmasTreeListeners.dragImage();
  }
}
