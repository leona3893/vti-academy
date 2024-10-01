import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { randomBetweenNumber, convertDateToString, randomMsv } from '../../const/helper';

@Component({
  selector: 'app-create-or-edit',
  templateUrl: './create-or-edit.component.html',
  styleUrl: './create-or-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrDeleteDialog implements OnInit {
  className = new FormControl('', [Validators.required, Validators.minLength(5)]);
  startDate = new FormControl('', [Validators.required]);
  endDate = new FormControl('', [Validators.required]);

  studentName = new FormControl('', [Validators.required, Validators.minLength(5)]);
  birthday = new FormControl('', [Validators.required]);
  studentType = new FormControl('', [Validators.required]);
  cn = new FormControl('HN', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.required, Validators.minLength(8)]);
  temp: any;
  constructor(
    private api: ApiService, private dialogRef: MatDialogRef<CreateOrDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { isClass: boolean, id: string, isCreate?: boolean },
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!this.#isCreate) {
      this.initUpdate(this.data.id);
    }
  }

  async onClose(ok?: boolean) {
    if (this.#isCreate) {
      if (this.data.isClass) {
        const id = `${this.data.id.toUpperCase()}_${randomBetweenNumber(10000, 99999)}`;
        const newClass = {
          id,
          classId: id,
          className: this.className.value,
          startDate: this.startDate.value,
          endDate: this.endDate.value,
          status: 'new'
        }
        await this.api.onCreate('class', id, newClass);
      } else {
        const msv = randomMsv(this.cn.value!);
        const newClass = {
          birthday: this.birthday.value,
          joined: this.data.id,
          msv,
          name: this.studentName.value,
          type: this.studentType.value,
          phone: this.phoneNumber.value
        }
        await this.api.onCreate('user', newClass.msv, newClass);
      }
    } else {
      if (this.data.isClass) {
        const newClass = {
          id: this.data.id,
          classId: this.data.id,
          className: this.className.value,
          startDate: this.startDate.value,
          endDate: this.endDate.value,
          status: 'new'
        }
        await this.api.onUpdate('class', this.data.id, newClass);
      } else {
        const newClass = {
          ...this.temp,
          birthday: this.birthday.value,
          joined: this.temp.joined,
          msv: this.temp.msv,
          name: this.studentName.value,
          type: this.studentType.value,
          phone: this.phoneNumber.value,
        }

        await this.api.onUpdate('user', newClass.msv, newClass);
      }

    }
    this.dialogRef.close(!!ok);
  }

  async initUpdate(id: string) {
    const target = this.data.isClass ? 'class' : 'user';
    const d = await this.api.onRead(target, id);
    this.temp = d;
    if (this.data.isClass) {
      this.className.patchValue(d.className);
      this.startDate.patchValue(convertDateToString(d.startDate, true));
      this.endDate.patchValue(convertDateToString(d.endDate, true));
    } else {
      this.studentName.patchValue(d.name);
      this.birthday.patchValue(convertDateToString(d.birthday, true));
      this.phoneNumber.patchValue(d.phone);
      this.studentType.patchValue(d.type);
    }
  }

  get #isCreate(): boolean {
    return !!this.data.isCreate
  }
}
