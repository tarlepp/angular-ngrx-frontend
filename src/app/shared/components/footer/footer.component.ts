import { AfterViewInit, Component, ElementRef, HostBinding, ViewChild } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

export class FooterComponent implements AfterViewInit {
  @HostBinding('style.top') private topOffset = '0';
  @HostBinding('style.position') private position = 'relative';
  @HostBinding('style.margin-top') private topMargin = '0';
  @ViewChild('footerContainer', {static: false}) private footerContainer: ElementRef;

  public ngAfterViewInit(): void {
    setTimeout((): void => {
      const element = this.footerContainer.nativeElement;

      this.topOffset = `${element.offsetHeight}px`;
      this.topMargin = `-${element.offsetHeight}px`;
    }, 0);
  }
}
