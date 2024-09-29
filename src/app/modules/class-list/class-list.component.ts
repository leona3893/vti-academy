import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { classL } from '../../const';
import { BehaviorSubject, debounceTime, pipe } from 'rxjs';
import { delay } from '../../const/helper';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialog } from '../confirm-delete/confirm-delete.component';
import { CreateOrDeleteDialog } from '../create-or-edit/create-or-edit.component';

@Component({
  selector: 'app-main',
  templateUrl: './class-list.component.html',
  styleUrl: './class-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassListComponent implements OnInit {
  constructor(private api: ApiService, private route: ActivatedRoute,
    private common: CommonService,
    private cdr: ChangeDetectorRef,
    private r: Router, private dialog: MatDialog) { }
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

  onDeleteClass(id: string) {
    const r = this.dialog.open(ConfirmDeleteDialog);
    r.afterClosed().subscribe(async res => {
      if (res) {
        await this.api.onDelete('class', id);
        this.onInitApp();
      }
    })
  }

  onCreateOrUpdate(id?: string) {
    const r = this.dialog.open(CreateOrDeleteDialog, {
      data: {
        isClass: true, id: id || this.route.snapshot.params['id'],
        isCreate: !id
      }
    });
    r.afterClosed().subscribe(async res => {
      console.log('res', res)
    })
  }

  async onSearch() {
    await delay(100);
    this.#search.next(this.value)
  }
}
