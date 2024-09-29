import { Injectable } from '@angular/core';
import { delay, randomBetweenNumber, randomBirthDay, randomMsv, randomNameStudent, randomPhoneNumber } from '../const/helper';
import { classL } from '../const';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  dbName = 'vti-academy';
  collectionNames = ['class', 'user', 'user-admin']
  request = window.indexedDB.open(this.dbName);
  db: IDBDatabase | null = null;
  constructor(private common: CommonService) {
    this.request.onsuccess = (event: any) => {
      const db = event.target!.result;
      this.db = db;
    };

    // This event is only implemented in recent browsers
    this.request.onupgradeneeded = (event: any) => {
      const db = event.target!.result;
      this.collectionNames.forEach(i => {
        db.createObjectStore(i, {
          autoIncrement: true
        })
      })

      this.db = db;
      this.initDB();
    };
  }

  async onRegisterAccount(body: any) {
    this.common.loading = true;
    await delay(1000);
    this.onCreate('user-admin', body.username, body);
    this.common.loading = false
  }


  async onGetAccount(key: any) {
    this.common.loading = true;
    await delay(1000);
    const r = await this.onRead('user', key)
    this.common.loading = false
    return r;
  }

  // async getAccountByMsv(msv: string): Promise<any> {
  //   this.common.loading = true;
  //   const [account] = await this.onReadAll('user', (account) => account.msv === msv);
  //   console.log('getAccountByMsv', account)
  //   this.common.loading = false
  //   return account || null;

  // }

  async onCreate(name: string, key: string, body: any) {
    this.common.loading = true;
    await delay(1000);
    this.db?.transaction(name, 'readwrite').objectStore(name).add(body, key);
    this.common.loading = false
  }

  async onRead(name: string, key: string): Promise<any> {
    this.common.loading = true;
    await delay(1000);
    return new Promise(ok => {
      const request = this.db!.transaction(name).objectStore(name).get(key)

      request.onsuccess = (event: any) => {
        this.common.loading = false
        ok(event.target!.result)
      }
    })
  }

  async onReadAll(name: string, filter?: (d: any) => boolean): Promise<any[]> {
    this.common.loading = true;
    await delay(1000);
    const r = await new Promise(ok => {
      let transaction = this.db!.transaction([name]);
      let objectStore = transaction.objectStore(name);
      let request = objectStore.openCursor();
      let result: any[] = [];
      request.onsuccess = function (event: any) {
        let cursor = event.target.result;
        if (cursor) {
          if (filter) {
            const rc = [cursor.value].filter(filter);
            if (rc.length) result.push(rc[0]);
          } else {
            result.push({ ...cursor.value, key: cursor.key });
          }
          cursor.continue();
        } else {
          ok(result);
        }
      };
    })
    this.common.loading = false;
    return r as any;
  }

  async onDelete(collectionName: string, key: string) {
    this.common.loading = true;
    return new Promise(ok => {
      let transaction = this.db!.transaction([collectionName], "readwrite");
      transaction.objectStore(collectionName).delete(key);
      transaction.oncomplete = () => {
        this.common.loading = false;
        ok(true);
      };
    })
  }

  async onUpdate(name: string, key: string, body: any): Promise<any> {
    this.common.loading = true;
    await delay(1000);
    const r = await new Promise(ok => {
      const objectStore = this.db!.transaction(name, 'readwrite').objectStore(name)
      const request = objectStore.get(key);

      request.onsuccess = (event: any) => {
        const data = event.target.result
        // Cập nhật giá trị mới
        data.p = body
        // Lưu vào DB
        objectStore.put(data, key);
        ok(data);
      }
    })
    this.common.loading = false;
    return r as any;
  }

  private initDB() {
    const classList = classL.map((i) => {
      let r = [];
      const numberOfClass = 5;
      for (let a = 1; a < numberOfClass + 1; a++) {
        const code = 0 + a;
        const c = `${i.id.toUpperCase()}_${code}`;
        const currentDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        r.push({
          id: code, classId: c, className: `${i.title} lớp ${c}`, startDate: new Date(), endDate: currentDate, stCount: 0, status: 'new'
        })
      }
      return r;
    });

    classList.forEach(i => {
      i.forEach(v => {
        let numStudent = randomBetweenNumber(15, 30);
        this.onCreate('class', v.classId, { ...v, stCount: numStudent });
        while (numStudent > 0) {
          const male = randomBetweenNumber(0, 1) === 0;
          const name = randomNameStudent(male);
          const msv = randomMsv();
          const a = ['Chuyển lớp', 'Tuyển mới', 'Bảo lưu'];
          const student = {
            msv,
            name,
            type: a[randomBetweenNumber(0, 2)],
            birthday: randomBirthDay(),
            phone: randomPhoneNumber(),
            joined: v.classId
          };

          this.onCreate('user', msv, student)
          numStudent--;
        }


      })
    }
    )
  }
}
