import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnChanges {
  title = 'Danh sách khóa học';
  loggedMsv = '';
  constructor(private common: CommonService, private cdr: ChangeDetectorRef, private route: Router, private api: ApiService, private route1: ActivatedRoute) {
    if (!this.isAuthScreen) {
      this.common.loading = true;
    };
  };

  ngOnInit(): void {
    this.common.$screenTitle.subscribe(title => {
      this.title = title;
      this.cdr.markForCheck();
    });
    setTimeout(this.getCurrentAccount.bind(this), 1000)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges: ', changes)
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
    const r = await this.api.onRead('user-admin', loggedMsv!);
    this.common.loading = false;
    this.loggedMsv = r?.name || 'Unknown Account';
    this.cdr.markForCheck();
    return r;
  }

  get isAuthScreen(): boolean {
    return location.href.endsWith('auth')
  }
}
