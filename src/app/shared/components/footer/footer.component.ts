import { AfterViewInit, Component, ElementRef, HostBinding, ViewChild } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

export class FooterComponent implements AfterViewInit {
  @HostBinding('style.top') public topOffset = '0';
  @HostBinding('style.position') public position = 'relative';
  @HostBinding('style.margin-top') public topMargin = '0';
  @ViewChild('footerContainer') public footerContainer: ElementRef;

  public ngAfterViewInit(): void {
    setTimeout((): void => {
      const element = this.footerContainer.nativeElement;

      this.topOffset = `${ element.offsetHeight }px`;
      this.topMargin = `-${ element.offsetHeight }px`;
    }, 0);
  }
}
