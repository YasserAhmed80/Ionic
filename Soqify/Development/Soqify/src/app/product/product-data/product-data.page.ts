import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { MessagesService } from 'src/app/shared/services/messages.service';

@Component({
  selector: 'app-product-data',
  templateUrl: './product-data.page.html',
  styleUrls: ['./product-data.page.scss'],
})
export class ProductDataPage implements OnInit {
  
  parentCat= [];
  mainCat = [];
  subCat=[];

  // selected category type
  selectedParentCat:number;
  selectedMainCat:number;
  selectedSubCat:number;

  dataLoaded:boolean = false;

  customPopoverOptions: any = {
    header: 'اختار من القائمة',
  };


  constructor(private authUser: AuthService,
              private masterDataService:MasterDataService,
              private messagesService:MessagesService)
  { }

  ngOnInit() {
    let loader = this.messagesService.showLoading('جاري تحميل البيانات')
    this.masterDataService.getMasterData().then(()=>{
      this.getParentCat();
      this.dataLoaded = true;
      loader.then((loading)=> loading.dismiss());
    });
  }

  //get parent category
  getParentCat(){
    let businessType = this.authUser.user.bus_sec;
    console.log('bus type', businessType);

    this.parentCat= businessType.map(key =>{
        return {key:key, name: this.masterDataService.getCatName(key, 'parent')}
    });

    if (this.parentCat.length===1){
      //console.log(this.selectedParentCat)
      if (this.selectedParentCat === undefined){
        this.selectedParentCat = this.parentCat[0].key;
        this.getMainCat(this.selectedParentCat);
      }
    }

    console.log('parent cats', this.parentCat);

  }

  getMainCat(p_cde:number){
    this.selectedMainCat=undefined
    this.mainCat = this.masterDataService.selectMainCat(p_cde);
    
  }

  getSubCat(m_cde:number){
    this.selectedSubCat=undefined;
    this.subCat = this.masterDataService.selectSubCat(m_cde);
  }


}
