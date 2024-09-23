import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { RegAdminComponent } from '../reg-admin/reg.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  constructor(
    private api: ApiService,
    private route: Router, private common: CommonService,
    private dialog: MatDialog, private cdr: ChangeDetectorRef) { }
  username = new FormControl('', [Validators.required, Validators.minLength(5)]);
  password = new FormControl('', [Validators.required]);
  repassword = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required, Validators.minLength(5)]);
  isLogin = true;
  isLoading = false;

  ngOnInit(): void {
    this.common.screenTitle = 'VTI Academy Tester';
    this.common.$loading.subscribe(i => {
      console.log('i', i)
      this.isLoading = i;
      this.cdr.markForCheck();
    })
  }

  async onRegAccount(force?: boolean) {
    this.isLogin = force ?? false;
    this.clearForm();
    this.cdr.markForCheck();
  }

  clearForm() {
    this.password.patchValue('');
    this.password.markAsUntouched()
    this.username.patchValue('');
    this.password.markAsUntouched();
    this.repassword.patchValue('');
    this.repassword.markAsUntouched();
    this.name.patchValue('');
    this.name.markAsUntouched();
  }

  async onSubmit() {
    if (this.isFormIsInvalid) {
      const msg = this.getErrorMsg(this.username.errors as any, this.password.errors as any);
      this.common.showMsg(msg);
      return;
    };

    if (!this.isLogin) {
      if (this.password.value?.trim() !== this.repassword.value?.trim()) {
        return this.common.showMsg('Mật khẩu không trùng khớp.')
      }
      return await this.onCreate();
    }

    const acc = await this.api.onRead('user-admin', this.username.value!);
    if (!acc) {
      this.common.showMsg(`Account ${this.username.value?.trim()} không tồn tại, vui lòng thử lại.`);
      return;
    }

    if (acc.pwd !== this.password.value) {
      this.common.showMsg(`Mật khẩu không đúng, vui lòng thử lại.`);
      return;
    }


    this.route.navigateByUrl('home/class');
    localStorage.setItem('logged_msv', String(this.username.value))
  }

  async onCreate() {
    await this.api.onRegisterAccount({ username: this.username.value?.trim(), pwd: this.password.value, name: this.name.value });
    this.common.showMsg('Tạo thành công account.');
    this.isLogin = true;
    this.clearForm();
    this.cdr.markForCheck();
  }

  get isFormIsInvalid(): boolean {
    return this.username.invalid || this.password.invalid
  }

  getErrorMsg(msv: Record<string, string>, pwd: Record<string, string>): string {
    const msvError = Object.seal(msv || {});
    const pwdError = Object.seal(pwd || {});
    let msg = 'Unknown Error'
    switch (true) {
      case Boolean(msvError['minlength']): {
        msg = `Username yêu cầu tối thiểu 5 kí tự.`;
        break;
      }
      case Boolean(msvError['required']): {
        msg = `Hãy nhập username.`;
        break;
      }
    }

    switch (true) {
      case Boolean(pwdError['required']): {
        msg = `Hãy nhập mật khẩu.`;
        break;
      }
    }
    return msg;
  }
}
