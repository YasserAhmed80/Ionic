import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class MyStorageService {

  constructor() { }

  // save object to local storage 
  async setItem(key:string, object:any) {
    await Storage.set({
      key,
      value: JSON.stringify(object)
    });
  }

  // get object from storage
  async getItem(key:string) {
    const ret = await Storage.get({ key: key });
    if ( ret.value !== 'undefined' && ret){
      return JSON.parse(ret.value);
      
    }else{
      return null;
    }   
  }

 

  async removeItem(key:string) {
    await Storage.remove({ key: key });
  }

  async keys() {
    const { keys } = await Storage.keys();
    console.log('Storgae Got keys: ', keys);
  }

  async clear() {
    await Storage.clear();
  }
}
