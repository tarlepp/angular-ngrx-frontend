import { Component } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { FlexFillDirective, LayoutAlignDirective, LayoutDirective } from '@ngbracket/ngx-layout/flex';

@Component({
  selector: 'app-oops',
  templateUrl: './oops.component.html',
  styleUrls: ['./oops.component.scss'],
  imports: [
    FlexFillDirective,
    LayoutDirective,
    LayoutAlignDirective,
    MatAnchor,
    TranslocoPipe,
  ],
})

export class OopsComponent { }
