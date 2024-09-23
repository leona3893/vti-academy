import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-reg-dialog',
  templateUrl: './reg.component.html',
  styleUrl: './reg.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegAdminComponent implements OnInit {
  username = new FormControl('', [Validators.required, Validators.minLength(5)]);
  constructor(public dialogRef: MatDialogRef<RegAdminComponent>, private common: CommonService) { }

  ngOnInit(): void { }

  onClose() {
    if (!this.username.valid) {
      const pwdError = Object.seal(this.username.errors || {});
      let msg = 'Unknown Error';
      switch (true) {
        case Boolean(pwdError['minlength']): {
          msg = `Tên yêu cầu tối thiểu 5 kí tự.`;
          break;
        }
        case Boolean(pwdError['required']): {
          msg = `Hãy nhập tên của bạn.`;
          break;
        }
      }
      this.common.showMsg(msg);
      return;
    }
    this.dialogRef.close(this.username.value)
  }
}
