import { ChristmasTreePageController } from './ChristmasTreePageController';

export class ChristmasTreeListeners {
  private christmasTreeController: ChristmasTreePageController;

  constructor() {
    this.christmasTreeController = new ChristmasTreePageController();
  }

  addListenerToAudioControl(audio: HTMLMediaElement): void {
    const audioControl: HTMLElement | null = document.querySelector('.audio-control');

    audioControl?.addEventListener('click', () => {
      audioControl.classList.toggle('active');
      if (audio.paused) {
        audio.play();
        localStorage.setItem('audio', 'played');
      } else {
        audio.pause();
        localStorage.setItem('audio', 'paused');
      }
    });
  }

  addListenerToSnowControl(): void {
    const snowControl: HTMLElement | null = document.querySelector('.snow-control');
    const snowflakes: HTMLElement | null = document.querySelector('.snowflakes');

    snowControl?.addEventListener('click', () => {
      snowControl.classList.toggle('active');
      if (snowflakes?.classList.contains('hide')) {
        snowflakes?.classList.remove('hide');
        localStorage.setItem('snowflakes', 'true');
      } else {
        snowflakes?.classList.add('hide');
        localStorage.setItem('snowflakes', 'false');
      }
    });
  }

  addListenerToTreeContainer(): void {
    const treeContainer: HTMLDivElement | null = document.querySelector('.tree-container');
    const mainTree: HTMLElement | null = document.querySelector('.main-tree');

    if (treeContainer && mainTree) {
      treeContainer.addEventListener('click', (ev: Event) => {
        const tree: HTMLElement | null = ev.target as HTMLElement;

        mainTree.setAttribute('src', `./assets/tree/${tree.getAttribute('data-tree')}.png`);
        localStorage.setItem('mainTreeNum', `${tree.getAttribute('data-tree')}`);
      });
    }
  }

  addListenerToBgContainer(): void {
    const treeContainer: HTMLDivElement | null = document.querySelector('.bg-container');
    const mainTreeContainer: HTMLDivElement | null = document.querySelector('.main-tree-container');

    if (treeContainer && mainTreeContainer) {
      treeContainer.addEventListener('click', (ev: Event) => {
        const bg = ev.target as HTMLElement;
        const img = new Image();
        img.src = `./assets/bg/${bg.getAttribute('data-bg')}.jpg`;
        img.onload = () => {
          mainTreeContainer.style.backgroundImage = `url(${img.src})`;
        };
        localStorage.setItem('mainTreeBgNum', `${bg.getAttribute('data-bg')}`);
      });
    }
  }

  addListenerToOnOffSwitch(): void {
    const onOffSwitchLabel: HTMLDivElement | null = document.querySelector('.onoffswitch-label');
    const garlandContainer: HTMLDivElement | null = document.querySelector('.garland-tree-container');
    const switchEl: HTMLDivElement | null = document.querySelector('.onoffswitch-switch');
    const switchInner: HTMLDivElement | null = document.querySelector('.onoffswitch-inner');
    const garlandColor: string | null = localStorage.getItem('garlandColor');

    if (onOffSwitchLabel && switchEl && switchInner) {
      onOffSwitchLabel.addEventListener('click', () => {
        if (garlandContainer?.firstChild == null) {
          this.christmasTreeController.createGarland(garlandColor);
          localStorage.setItem('isGarlandOn', 'true');
          switchEl.style.right = '55px';
          switchInner.style.marginLeft = '-100%';
        } else {
          while (garlandContainer?.firstChild) {
            garlandContainer.removeChild(garlandContainer.firstChild);
          }
          localStorage.setItem('isGarlandOn', 'false');
          switchEl.style.right = '0';
          switchInner.style.marginLeft = '0';
        }
      });
    }
  }

  addListenerToGarlandsBtns(): void {
    const garlandBtnsBlock = document.querySelector('.garland-btns');

    if (garlandBtnsBlock) {
      garlandBtnsBlock.addEventListener('click', (ev: Event) => {
        const garlandColor: HTMLElement | null = ev.target as HTMLElement;
        const lightsCollection: NodeListOf<HTMLElement> = document.querySelectorAll('.lightrope li');
        if (garlandColor) {
          lightsCollection.forEach((el: Element) => {
            el.className = '';
            el.className = `${garlandColor.getAttribute('data-color')}`;
          });
          localStorage.setItem('garlandColor', `${garlandColor.getAttribute('data-color')}`);
        }
      });
    }
  }

  addListenerToBtnClearLocalStorage(audio: HTMLMediaElement): void {
    const btnReset: HTMLElement | null = document.querySelector('.favorites-decorate button');

    btnReset?.addEventListener('click', () => {
      this.christmasTreeController.clearLocalStorage();
      this.christmasTreeController.resetToOriginalState(audio);
    });
  }
}
