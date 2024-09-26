import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { classL } from '../../const';
import { delay, randomBetweenNumber, randomNameStudent } from '../../const/helper';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './class-detail.component.html',
  styleUrl: './class-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassDetailComponent implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute, private common: CommonService, private cdr: ChangeDetectorRef, private r: Router) { }
  dataSource: any[] = [];
  displayData: any[] = [];
  displayedColumns = ['id', 'msv', 'name', 'type', 'birthday', 'phone'];
  value = '';
  #search = new BehaviorSubject("");
  ngOnInit(): void {
    this.common.screenTitle = '';
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

      this.displayData = this.dataSource.filter(({ msv, name }, index) => {
        return msv.toLowerCase().includes(r) || name.toLowerCase().includes(r) || +index + 1 === +r;
      })

      this.cdr.markForCheck();
      this.common.loading = false;
    })
  }

  async onInitApp() {
    const id = this.route.snapshot.params['id'];
    const dataSource = await this.api.onReadAll('user', (d) => d.joined === id);
    const title = await this.api.onRead('class', id);
    this.dataSource = dataSource;
    this.displayData = dataSource;
    this.common.screenTitle = title.className;
    this.cdr.detectChanges();
  }


  async onSearch() {
    await delay(100);
    this.#search.next(this.value)
  }
}
