import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
})

export class AutoFocusDirective implements OnChanges {
  @Input() public appAutoFocus: boolean;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private readonly hostElement: ElementRef,
  ) {
    this.appAutoFocus = false;
  }

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
