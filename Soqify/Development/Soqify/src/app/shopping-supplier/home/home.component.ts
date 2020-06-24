import { Component, OnInit } from '@angular/core';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {


  parentCat= [];
  mainCat = [];
  subCat=[];

  selectedParentCat:number;
  selectedMainCat:number;
  selectedSubCat:number;

  dataLoaded: boolean=false;

  constructor(private masterDataService:MasterDataService,
              private messagesService:MessagesService,
              private authUser: AuthService,
    ) { }


  

  ngOnInit() {
    let loader = this.messagesService.showLoading('جاري تحميل البيانات')
    this.dataLoaded = false;
    this.masterDataService.getMasterData().then(()=>{
      this.getParentCat();
      
      this.dataLoaded = true;
      loader.then((loading)=> loading.dismiss());
    });

  }

    /*-----------------------------------------------------------------------------*/
  //  Get parent categories based on user business type and save to array
  /*-----------------------------------------------------------------------------*/
  getParentCat(){
    // if business type not defined set it to 1 [clothes]
    var businessSections;

    if (this.authUser.user){
      businessSections = this.authUser.user.bus_sec
    }else{
      businessSections = [1] 
    }

    this.parentCat= this.masterDataService.selectParentCat()
    this.selectedParentCat = this.parentCat[0].key;

    this.getMainCat (this.selectedParentCat);

  }
  /*-----------------------------------------------------------------------------*/
  //  Get main categories based on parent category
  /*-----------------------------------------------------------------------------*/
  getMainCat(p_cde:number){
    this.mainCat = this.masterDataService.selectMainCat(p_cde);
    this.selectedMainCat = this.mainCat[0].key;
    this.getSubCat(this.selectedMainCat)
    //console.log('main cat',p_cde,  this.mainCat)
    
  }
  /*-----------------------------------------------------------------------------*/
  //  Get sub categories based on main category
  /*-----------------------------------------------------------------------------*/
  getSubCat(m_cde:number){
    this.subCat = this.masterDataService.selectSubCat(m_cde);
  }

  ParentCatClick(ev){
    // console.log(ev.detail.value);
    this.selectedParentCat = ev.detail.value;
    this.getMainCat (this.selectedParentCat );
  }

  mainCatClick(cat){
    this.selectedMainCat = cat.key
    this.getSubCat(this.selectedMainCat)
    //console.log(this.subCat)
  }

  SubCatClick(key){
    this.selectedSubCat = key
  }



}
