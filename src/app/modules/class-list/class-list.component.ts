import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { classL } from '../../const';

@Component({
  selector: 'app-main',
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassListComponent implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute, private common: CommonService, private cdr: ChangeDetectorRef, private r: Router) { }
  dataSource: any[] = [];
  displayedColumns = ['id', 'classId', 'className', 'startDate', 'endDate', 'stCount', 'status', 'action'];

  ngOnInit(): void {
    this.onInitApp();
  }

  async onInitApp() {
    this.common.loading = true;
    const id = this.route.snapshot.params['id'];
    this.common.screenTitle = classL.find(v => v.id === id)!.title;
    const dataSource = await this.api.onReadAll('class', (d) => String(d.classId).startsWith(id.toUpperCase()));
    this.dataSource = dataSource;
    this.common.loading = false;
    this.cdr.detectChanges();
  }

  onNavigateTo(p: string) {
    this.r.navigateByUrl('home/class-detail/' + p)
  }
}
