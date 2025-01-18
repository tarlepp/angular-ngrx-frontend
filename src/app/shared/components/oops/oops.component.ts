import { Component } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { FlexFillDirective, DefaultLayoutDirective, DefaultLayoutAlignDirective } from '@ngbracket/ngx-layout/flex';

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
