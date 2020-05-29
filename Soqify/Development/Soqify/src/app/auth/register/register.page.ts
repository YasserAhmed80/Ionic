import { Component, OnInit } from '@angular/core';
import { MasterDataService } from '../../shared/services/master-data.service'
import { main_cat, parent_cat,sub_cat, IParent_cat, IMain_cat, ISub_cat,IBusiness_type, business_type, IGovernate, ICity } from '../../data/master-data';
import { IUser, IGeoLocation } from 'src/app/model/types';
import { AuthService } from '../services/auth.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from '@capacitor/core';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  businessType: IBusiness_type[]=[];
  parentCat:IParent_cat[]=[];
  governates: IGovernate[]=[];

  cities: ICity[]=[];

  selectedCities: ICity[]=[];


  user:IUser = null;
  selectedBusSec: number[]=[];

  selectedGov="";
  dataLoaded:Boolean =false;
  govChangeInitial:boolean= true;

  map:any;



  constructor(public masterDataService: MasterDataService, 
              public authServcie:AuthService,
              public messagesService:MessagesService,
              public loadingController: LoadingController
             ) { 

  }


  ngOnInit() {

    this.user = this.authServcie.user;
    this.selectedBusSec = this.user.bus_sec;
    

    this.masterDataService.getMasterData().then(()=>{

      let loader = this.messagesService.showLoading('جاري تحميل البيانات')
      this.businessType=this.masterDataService.businessType;
      this.parentCat = this.masterDataService.productParentCat;
      this.governates = this.masterDataService.governates;
      this.cities = this.masterDataService.cities;

      this.getSelectedCities(this.user.gov);
      this.govChangeInitial = false;

      this.dataLoaded = true
      loader.then((loading)=> loading.dismiss());


    });

    
  }

  saveUser(){
    console.log('updated user =>', this.user);
    this.authServcie.user = this.user;
    this.authServcie.updateUserData(this.user).then(()=>{
      this.messagesService.showToast('','تم حفظ بياناتك بنجاح!')
    })
  }

  addBusinessSection(event, sec:number){ 

    let index = this.selectedBusSec.indexOf(sec);

    // reomve item if exist
    if (index>=0) {
      this.selectedBusSec.splice(index,1)
    }

    // add item if checked
    if (event.detail.checked == true){
      this.selectedBusSec.push(sec);
      console.log('sec added', this.selectedBusSec)
    }

    this.user.bus_sec = this.selectedBusSec
    
  }

  setToggalCheck(sec:number){
    let index = this.selectedBusSec.indexOf(sec);
    if (index>=0) {
      return true;
    }else{
      return false;
    }
  }

  getSelectedCities(gov_key){
    if (!this.govChangeInitial ){
      // set city to null if user selected a governate
      this.user.cty = null;
    }
    
    this.selectedCities = this.masterDataService.selectCity(gov_key)
  }


  

  getLocation(){
    Geolocation.getCurrentPosition().then((coord)=>{
      let loc = {latitude: coord.coords.latitude,longitude: coord.coords.longitude};
      this.map(loc)
    })
    
  }



}
