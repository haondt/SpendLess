import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  // see theme/material-themes.scss for available themes
  theme: string = 'dark-gold-theme';

  constructor(@Inject(DOCUMENT) private document: Document){
    this.document.documentElement.classList.add(this.theme);
  }

  switchTheme(newTheme: string){
    this.document.documentElement.classList.replace(this.theme, newTheme);
    this.theme = newTheme;
  }
}
