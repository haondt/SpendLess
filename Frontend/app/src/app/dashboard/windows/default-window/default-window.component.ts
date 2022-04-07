import { AfterViewInit, Component, ElementRef } from "@angular/core";
import { languages, highlight } from "prismjs";
@Component({
    selector: 'app-default-window',
    templateUrl: './default-window.component.html',
    styleUrls: ['./default-window.component.scss']
})
export class DefaultWindowComponent implements AfterViewInit {
    constructor(private el: ElementRef){}
    ngAfterViewInit(): void {
        let code = this.el.nativeElement.innerText;
        code = this.fixIndent(code);
    const grammar = languages['javascript'];
    const html = highlight(code, grammar, 'javascript');
    this.el.nativeElement.innerHTML = html;
  }

  private fixIndent(code: string): string {
    const removeThis = (code.match(/^([ ]+)/) || [])[1];
    if (removeThis) {
      const re = new RegExp(`^${removeThis}`, 'gm')
      return code.replace(re, '');
    }
    return code;
  }


}