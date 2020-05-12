import { Component } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  storedData:string ;
  constructor() {}


  // writeToStorage(){
  //   console.log("dfffff");
  //   this.storage.setData("yasser", "yasser name");
    
  //   this.storage.getData("yasser").then((x)=>{
  //     this.storedData = x;
  //   })
  // }

}
