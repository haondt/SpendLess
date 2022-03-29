import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  theme: string = 'dark-gold';
  constructor(@Inject(DOCUMENT) private document: Document){
    this.document.body.classList.add(this.theme);
  }

  switchTheme(newTheme: string){
    this.document.body.classList.replace(this.theme, newTheme);
    this.theme = newTheme;
  }
}
