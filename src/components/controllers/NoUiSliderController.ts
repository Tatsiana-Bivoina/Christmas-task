import noUiSlider from '../../../node_modules/nouislider/dist/nouislider';
import { API, target } from '../../../node_modules/nouislider/dist/nouislider';
import { ToysPageController } from './ToysPageController';
import 'nouislider/dist/nouislider.css';

export class NoUiSliderController {
  countSliderValues: string[];
  yearSliderValues: string[];
  toysPageController: ToysPageController;

  constructor() {
    this.toysPageController = new ToysPageController();
    this.yearSliderValues = [];
    this.countSliderValues = [];
  }

  createCountSlider(): void {
    const countRange: target = <target>document.getElementById('count-slider');
    let values: string[] | undefined = localStorage.getItem('countSliderValues')?.split(',');
    const outputMin: Element | null = document.querySelectorAll('.count .slider-output')[0];
    const outputMax: Element | null = document.querySelectorAll('.count .slider-output')[1];

    if (!values) {
      values = ['1', '12'];
    }

    if (countRange && values) {
      noUiSlider.create(countRange, {
        range: {
          min: 1,
          max: 12,
        },
        step: 1,
        start: [Number(values[0]), Number(values[1])],
        margin: 0,
        connect: true,
        behaviour: 'tap-drag',
        tooltips: false,
        format: {
          to: function (value) {
            return Number(value);
          },
          from: function (value) {
            return Number(value);
          },
        },
      });
      if (outputMin && outputMax) {
        outputMin.innerHTML = values[0];
        outputMax.innerHTML = values[1];
      }
    }
    this.addListenerToCountSlider(countRange, outputMin, outputMax);
  }

  private addListenerToCountSlider(countRange: target, outputMin: Element | null, outputMax: Element | null): void {
    if (countRange) {
      (<API>countRange.noUiSlider).on('slide', () => {
        this.countSliderValues = (<API>countRange.noUiSlider)
          .get()
          .toString()
          .split(',')
          .map((el) => {
            return Math.round(Number(el)).toString();
          });
        localStorage.setItem('countSliderValues', `${this.countSliderValues}`);
        this.changeCountOutput(outputMin, outputMax);
        this.toysPageController.filterCardsByRange('count');
      });
    }
  }

  private changeCountOutput(outputMin: Element | null, outputMax: Element | null): void {
    if (outputMin && outputMax) {
      outputMin.innerHTML = this.countSliderValues[0];
      outputMax.innerHTML = this.countSliderValues[1];
    }
  }

  createYearSlider(): void {
    const yearRange: target = <target>document.getElementById('year-slider');
    let values: string[] | undefined = localStorage.getItem('yearSliderValues')?.split(',');
    const outputMin: Element | null = document.querySelectorAll('.year .slider-output')[0];
    const outputMax: Element | null = document.querySelectorAll('.year .slider-output')[1];

    if (!values) {
      values = ['1940', '2020'];
    }

    if (yearRange && values) {
      noUiSlider.create(yearRange, {
        range: {
          min: 1940,
          max: 2020,
        },
        step: 10,
        start: [Number(values[0]), Number(values[1])],
        margin: 1,
        connect: true,
        behaviour: 'tap-drag',
        tooltips: false,
        format: {
          to: function (value) {
            return Number(value);
          },
          from: function (value) {
            return Number(value);
          },
        },
      });

      if (outputMin && outputMax) {
        outputMin.innerHTML = values[0];
        outputMax.innerHTML = values[1];
      }
    }
    this.addListenerToYearSlider(yearRange, outputMin, outputMax);
  }

  private addListenerToYearSlider(yearRange: target, outputMin: Element | null, outputMax: Element | null): void {
    if (yearRange) {
      (<API>yearRange.noUiSlider).on('slide', () => {
        this.yearSliderValues = (<API>yearRange.noUiSlider)
          .get()
          .toString()
          .split(',')
          .map((el) => {
            return Math.round(Number(el)).toString();
          });
        this.changeYearOutput(outputMin, outputMax);
        localStorage.setItem('yearSliderValues', `${this.yearSliderValues}`);
        this.toysPageController.filterCardsByRange('year');
      });
    }
  }

  private changeYearOutput(outputMin: Element | null, outputMax: Element | null): void {
    if (outputMin && outputMax) {
      outputMin.innerHTML = this.yearSliderValues[0];
      outputMax.innerHTML = this.yearSliderValues[1];
    }
  }
}
