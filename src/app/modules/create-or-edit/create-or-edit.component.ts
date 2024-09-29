import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-or-edit',
  templateUrl: './create-or-edit.component.html',
  styleUrl: './create-or-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrDeleteDialog implements OnInit {
  className = new FormControl('', [Validators.required, Validators.minLength(5)]);
  startDate = new FormControl(new Date(), [Validators.required]);
  endDate = new FormControl('', [Validators.required]);
  sCount = new FormControl(20, [Validators.required, Validators.minLength(5)]);
  constructor(
    private api: ApiService, private dialogRef: MatDialogRef<CreateOrDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { isClass: boolean, id: string, isCreate?: boolean },
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!this.data.isCreate) {
      this.initUpdate(this.data.id);
    }
  }

  onClose(ok?: boolean) {
    this.dialogRef.close(!!ok);
  }

  async initUpdate(id: string) {
    const target = this.data.isClass ? 'class' : 'user';
    const d = await this.api.onRead(target, id);
    console.log('update', d)
  }
}
