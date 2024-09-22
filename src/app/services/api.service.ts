import { Injectable } from '@angular/core';
import { delay } from '../const/helper';
import { classL } from '../const';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  dbName = 'vti-academy';
  collectionNames = ['class', 'user']
  request = window.indexedDB.open(this.dbName);
  db: IDBDatabase | null = null;
  constructor() {
    this.request.onsuccess = (event: any) => {
      const db = event.target!.result;
      this.db = db;
      // this.initDB();
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
    await delay(1000);
    this.onCreate('user', body.msv, body)
  }


  async onGetAccount(key: any) {
    await delay(1000);
    return await this.onRead('user', key)
  }

  async getAccountByMsv(msv: string): Promise<any> {
    const [account] = await this.onReadAll('user', (account) => account.msv === msv);
    console.log('getAccountByMsv', account)
    return account || null;

  }

  async onCreate(name: string, key: string, body: any) {
    await delay(1000);
    this.db?.transaction(name, 'readwrite').objectStore(name).add(body, key);
  }

  async onRead(name: string, key: string): Promise<any> {
    await delay(1000);
    return new Promise(ok => {
      const request = this.db!.transaction(name).objectStore(name).get(key)

      request.onsuccess = (event: any) => {
        ok(event.target!.result)
      }
    })
  }

  async onReadAll(name: string, filter?: (d: any) => boolean): Promise<any[]> {
    await delay(1000);
    return new Promise(ok => {
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
  }

  async onUpdate(name: string, key: string, body: any): Promise<any> {
    await delay(1000);
    return new Promise(ok => {
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
        this.onCreate('class', v.classId, v)
      })
    }
    )
  }
}
