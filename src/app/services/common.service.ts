import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  $screenTitle = new BehaviorSubject('');
  $loading = new BehaviorSubject(false);
  constructor(private snackBar: MatSnackBar) { }

  get screenTitle(): string {
    return this.$screenTitle.getValue();
  }

  set screenTitle(value: string) {
    this.$screenTitle.next(value);
  }

  set loading(v: boolean) {
    if (v) {
      this.$loading.next(v);
      return;
    }
    setTimeout(() => {
      this.$loading.next(v);
    }, 1000)
  }

  showMsg(msg: string) {
    this.snackBar.open(msg, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2000
    })
  }
}
