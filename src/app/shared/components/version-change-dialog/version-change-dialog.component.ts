import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { VersionContentInterface } from 'src/app/shared/components/version-change-dialog/version-content.interface';

@Component({
  selector: 'app-version-change-dialog',
  templateUrl: './version-change-dialog.component.html',
  styleUrls: ['./version-change-dialog.component.scss'],
  standalone: false,
})
export class VersionChangeDialogComponent {
  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: VersionContentInterface,
  ) {
  }
}
