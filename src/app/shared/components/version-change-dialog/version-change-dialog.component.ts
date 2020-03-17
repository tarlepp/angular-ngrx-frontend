import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-version-change-dialog',
  templateUrl: './version-change-dialog.component.html',
  styleUrls: ['./version-change-dialog.component.scss'],
})
export class VersionChangeDialogComponent {
  public contentParams: { versionOld: string, versionNew: string };

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private dialogRef: MatDialogRef<VersionChangeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { versionOld: string, versionNew: string },
  ) {
    this.contentParams = {
      ...data,
    };
  }
}
