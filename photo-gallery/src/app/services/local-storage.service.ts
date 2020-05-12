import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(public storage:Storage ) { }

  async setData(key, value) {
    const res = await this.storage.setItem(key, value);
    console.log(res);
  }

   async getData(key) {
    const keyVal = await this.storage.getItem(key);
    return keyVal;
  }
}
