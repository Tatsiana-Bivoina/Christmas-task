import { BaseComponent } from '../BaseComponent';
import './footer.scss';

export class FooterView extends BaseComponent {
  constructor() {
    super('footer', ['footer']);
    this.createFooter();
  }

  private createFooter(): void {
    this.element.innerHTML = `
      <div class="footer-container">
        <div class="footer-data">
          <p class="copyright">©</p>
          <p class="year">2021</p>
          <a class="github-username" href="https://github.com/Tatsiana-Bivoina" target="_blank" rel="noopener noreferrer">github</a>
        </div>
        <a class="rss-logo" href="https://rs.school/js/" target="_blank" ></a>
      </div>
    `;
  }
}
