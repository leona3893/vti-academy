import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrl: './confirm-delete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteDialog {
  constructor(private dialogRef: MatDialogRef<ConfirmDeleteDialog>) { }

  closeDb(ok?: boolean) {
    this.dialogRef.close(!!ok);
  }
}
