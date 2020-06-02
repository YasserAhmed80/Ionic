import { Component } from '@angular/core';
import { Data } from '@angular/router';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  storedData:string ;
  constructor(public dataservice:DataService) {}

}
