import { AfterViewInit, Component, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';

import { environment } from 'src/environments/environment';
import { EnvironmentInterface } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

export class FooterComponent implements OnInit, AfterViewInit {
  @HostBinding('style.top') public topOffset = '0';
  @HostBinding('style.position') public position = 'relative';
  @HostBinding('style.margin-top') public topMargin = '0';
  @ViewChild('footerContainer') public footerContainer: ElementRef;

  public environment: EnvironmentInterface;

  public ngOnInit(): void {
    this.environment = environment;
  }

  public ngAfterViewInit(): void {
    setTimeout((): void => {
      const element = this.footerContainer.nativeElement;

      this.topOffset = `${ element.offsetHeight }px`;
      this.topMargin = `-${ element.offsetHeight }px`;
    }, 0);
  }
}
