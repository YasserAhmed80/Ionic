import { Component } from '@angular/core';
import { MasterDataService } from '../shared/services/master-data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(public masterData:MasterDataService) {}

}
