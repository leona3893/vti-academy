import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { classL } from '../../const';
import { randomBetweenNumber, randomNameStudent } from '../../const/helper';

@Component({
  selector: 'app-detail',
  templateUrl: './class-detail.component.html',
  styleUrl: './class-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassDetailComponent implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute, private common: CommonService, private cdr: ChangeDetectorRef, private r: Router) { }
  dataSource: any[] = [];
  displayedColumns = ['id', 'msv', 'name', 'type', 'birthday', 'phone'];

  ngOnInit(): void {
    this.common.screenTitle = '';
    this.onInitApp();
  }

  async onInitApp() {
    const id = this.route.snapshot.params['id'];
    const dataSource = await this.api.onReadAll('user', (d) => d.joined === id);
    const title = await this.api.onRead('class', id);
    this.dataSource = dataSource;
    this.common.screenTitle = title.className;
    this.cdr.detectChanges();
  }

  onNavigateTo(p: string) {
    this.r.navigateByUrl('home/class-detail/' + p)
  }
}
