import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { classL } from '../../const';

@Component({
  selector: 'app-detail',
  templateUrl: './class-detail.component.html',
  styleUrl: './class-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassDetailComponent implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute, private common: CommonService, private cdr: ChangeDetectorRef, private r: Router) { }
  dataSource: any[] = [];
  displayedColumns = ['id', 'classId', 'className', 'startDate', 'endDate', 'stCount', 'status', 'action'];

  ngOnInit(): void {
    this.onInitApp();
  }

  async onInitApp() {
    this.common.loading = true;
    const id = this.route.snapshot.params['id'];

    const dataSource = await this.api.onRead('class', id);
    console.log('dataSource', dataSource);
    // this.dataSource = dataSource;
    this.common.screenTitle = dataSource.className;
    this.common.loading = false;
    this.cdr.detectChanges();
  }

  onNavigateTo(p: string) {
    this.r.navigateByUrl('home/class-detail/' + p)
  }
}
