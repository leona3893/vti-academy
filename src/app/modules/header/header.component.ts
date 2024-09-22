import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  title = 'Danh sách khóa học';
  loggedMsv = '';
  constructor(private common: CommonService, private cdr: ChangeDetectorRef, private route: Router, private api: ApiService) {
    this.common.loading = true;
  };

  ngOnInit(): void {
    this.common.$screenTitle.subscribe(title => {
      this.title = title;
      this.cdr.markForCheck();
    });
    setTimeout(this.getCurrentAccount.bind(this), 1000)
  }

  logout() {
    localStorage.removeItem('logged_msv');
    this.route.navigateByUrl('auth');
  }

  async getCurrentAccount() {
    if (this.isAuthScreen) {
      return;
    }
    const loggedMsv = localStorage.getItem('logged_msv');
    const r = await this.api.getAccountByMsv(loggedMsv!);
    this.common.loading = false;
    this.loggedMsv = r?.name || 'Unknown Account';
    this.cdr.markForCheck();
    return r;
  }

  get isAuthScreen(): boolean {
    return location.href.endsWith('auth')
  }
}
