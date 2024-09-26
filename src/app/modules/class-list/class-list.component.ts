import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { classL } from '../../const';
import { BehaviorSubject, debounceTime, pipe } from 'rxjs';
import { delay } from '../../const/helper';

@Component({
  selector: 'app-main',
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassListComponent implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute, private common: CommonService, private cdr: ChangeDetectorRef, private r: Router) { }
  dataSource: any[] = [];
  displayData: any[] = [];
  displayedColumns = ['id', 'classId', 'className', 'startDate', 'endDate', 'stCount', 'status', 'action'];
  value = '';
  #search = new BehaviorSubject("");
  ngOnInit(): void {
    this.onInitApp();
    this.#search.pipe(debounceTime(500)).subscribe((res: string) => {
      const r = res.toLowerCase().trim();
      console.log('search: ', res);
      this.common.loading = true;
      if (!r) {
        this.displayData = this.dataSource;
        this.cdr.markForCheck();

        this.common.loading = false;
        return;
      }

      this.displayData = this.dataSource.filter(({ classId, className }, index) => {
        return classId.toLowerCase().includes(r) || className.toLowerCase().includes(r) || +index + 1 === +r;
      })

      this.cdr.markForCheck();
      this.common.loading = false;
    })
  }

  async onInitApp() {
    this.common.loading = true;
    const id = this.route.snapshot.params['id'];
    this.common.screenTitle = classL.find(v => v.id === id)!.title;
    const dataSource = await this.api.onReadAll('class', (d) => String(d.classId).startsWith(id.toUpperCase()));
    this.dataSource = dataSource;
    this.displayData = dataSource;
    this.common.loading = false;
    this.cdr.detectChanges();
  }

  onNavigateTo(p: string) {
    this.r.navigateByUrl('home/class-detail/' + p)
  }

  async onSearch() {
    await delay(100);
    this.#search.next(this.value)
  }
}
