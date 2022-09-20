import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSelectOnFoscus]'
})
export class SelectOnFoscusDirective {

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('focus', ['$event']) onFocus() {
    this.elementRef.nativeElement.select();
  }
}
