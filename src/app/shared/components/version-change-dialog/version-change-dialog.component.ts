import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';

import { VersionContentInterface } from 'src/app/shared/components/version-change-dialog/version-content.interface';

@Component({
  selector: 'app-version-change-dialog',
  templateUrl: './version-change-dialog.component.html',
  styleUrls: ['./version-change-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    TranslocoDirective,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslocoPipe,
  ],
})
export class VersionChangeDialogComponent {
  public readonly data: VersionContentInterface = inject<VersionContentInterface>(MAT_DIALOG_DATA);
}
