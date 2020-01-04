import { Directive, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})
export class AutoFocusDirective implements OnChanges {
  @Input() private appAutoFocus: boolean;

  public constructor(private host: ElementRef) {
    this.appAutoFocus = false;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.appAutoFocus.currentValue === true) {
      setTimeout((): void => this.host.nativeElement.focus(), 0);
    }
  }
}
