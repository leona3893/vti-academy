import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  constructor(
    private api: ApiService,
    private route: Router, private common: CommonService) { }
  msv = new FormControl('', [Validators.required, Validators.minLength(7)]);
  password = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.common.screenTitle = 'VTI Academy Tester';
  }

  async onSubmit() {
    if (this.isFormIsInvalid) {
      const msg = this.getErrorMsg(this.msv.errors as any, this.password.errors as any);
      this.common.showMsg(msg);
      return;
    };
    const acc = await this.api.onGetAccount(this.msv.value);
    if (acc) {
      this.common.showMsg(`Mã ${this.msv.value} đã được sử dụng, vui lòng thử lại.`)
      return;
    }
    this.api.onRegisterAccount({ msv: this.msv.value, pwd: this.password.value, name: 'Hello', age: new Date() })
    this.route.navigateByUrl('home/class');
    localStorage.setItem('logged_msv', String(this.msv.value))
  }

  get isFormIsInvalid(): boolean {
    return this.msv.invalid || this.password.invalid
  }

  getErrorMsg(msv: Record<string, string>, pwd: Record<string, string>): string {
    const msvError = Object.seal(msv || {});
    const pwdError = Object.seal(pwd || {});
    let msg = 'Unknown Error'
    switch (true) {
      case Boolean(msvError['minlength']): {
        msg = `Mã học sinh yêu cầu tối thiểu 7 kí tự.`;
        break;
      }
      case Boolean(msvError['required']): {
        msg = `Hãy nhập mã học sinh.`;
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
