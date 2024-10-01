import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  constructor(private api: ApiService, private route: Router, private common: CommonService, private cdr: ChangeDetectorRef) { }
  isLoading = false;

  ngOnInit(): void {
    this.common.$loading.subscribe(i => {
      this.isLoading = i;
      this.cdr.markForCheck();
    })
  }


  onNavigateTo(api: string) {
    this.route.navigateByUrl(api);
  }
}
