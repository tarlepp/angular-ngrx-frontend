import { Directive, ElementRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})

export class AutoFocusDirective implements OnChanges {
  private readonly hostElement: ElementRef = inject(ElementRef);

  @Input() public appAutoFocus: boolean = false;

  /**
   * A callback method that is invoked immediately after the default change
   * detector has checked data-bound properties if at least one has changed,
   * and before the view and content children are checked.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.appAutoFocus.currentValue === true) {
      setTimeout((): void => this.hostElement.nativeElement.focus(), 0);
    }
  }
}
