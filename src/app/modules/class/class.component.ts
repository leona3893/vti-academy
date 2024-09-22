import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { classL } from '../../const';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrl: './class.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassComponent implements OnInit {
  classList = classL;
  constructor(private api: ApiService, private common: CommonService, private route: Router) { }

  ngOnInit(): void {
    this.common.screenTitle = 'Danh sách khóa học';
  }

  toDetail(id: string) {
    this.route.navigateByUrl('home/class-list/'+id);
  }

}
