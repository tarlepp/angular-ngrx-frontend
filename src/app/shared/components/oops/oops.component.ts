import { Component } from '@angular/core';
import { FlexFillDirective, DefaultLayoutDirective, DefaultLayoutAlignDirective } from '@ngbracket/ngx-layout/flex';
import { MatAnchor } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-oops',
  templateUrl: './oops.component.html',
  styleUrls: ['./oops.component.scss'],
  imports: [
    FlexFillDirective,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatAnchor,
    TranslocoPipe,
  ],
})

export class OopsComponent { }
