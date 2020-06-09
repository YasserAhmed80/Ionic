import { Component, OnInit, ViewChild , AfterViewInit, OnChanges} from '@angular/core';
import { MasterDataService } from '../../shared/services/master-data.service'
import { main_cat, parent_cat,sub_cat, IParent_cat, IMain_cat, ISub_cat,IBusiness_type, business_type, IGovernate, ICity } from '../../data/master-data';
import { IUser, IGeoLocation } from 'src/app/model/identity';
import { AuthService } from '../services/auth.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from '@capacitor/core';
import { GoogleMapComponent } from 'src/app/shared/google-map/google-map.component';
import { NgControlStatusGroup } from '@angular/forms';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild ('map') map:GoogleMapComponent;

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

  currentLocation:IGeoLocation;



  constructor(public masterDataService: MasterDataService, 
              public authServcie:AuthService,
              public messagesService:MessagesService,
              public loadingController: LoadingController
             ) { 

  }

 

  ngOnInit() {

    //set the default location (my home)
    this.currentLocation ={"latitude":30.167038399999996,"longitude":31.319837900000003};

    this.user = this.authServcie.user;
    this.selectedBusSec = this.user.bus_sec;

    console.log (this.user.loc)

    if (this.user.loc !== undefined){
      this.currentLocation = {... this.user.loc};
    }else{
      this.getLocation();
    }

    let loader = this.messagesService.showLoading('جاري تحميل البيانات')
    this.masterDataService.getMasterData().then(()=>{

      
      this.businessType=this.masterDataService.businessType;
      this.parentCat = this.masterDataService.productParentCat;
      this.governates = this.masterDataService.governates;
      this.cities = this.masterDataService.cities;

      this.getSelectedCities(this.user.gov);
      this.govChangeInitial = false;

      this.dataLoaded = true
      loader.then((loading)=> loading.dismiss());
    });

  

    google.maps.event.addDomListener(window, 'load', ()=>{
      this.centerLocation();
    });

    
  }

  saveUser(){
    console.log('updated user =>', this.user);
    this.authServcie.user = this.user;
    this.authServcie.updateUserData(this.user).then(()=>{
      this.messagesService.showToast('','تم حفظ بياناتك بنجاح!','success')
    })
  }

  saveUserLocation(){
    this.user.loc=this.currentLocation;
    this.authServcie.user = this.user;
    this.authServcie.updateUserData(this.user).then(()=>{
      this.messagesService.showToast('','تم حفظ بياناتك بنجاح!','success')
    })
  }

  addBusinessSection(event, sec:number){ 

    if(this.selectedBusSec === undefined){
      this.selectedBusSec = [];
    }
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

    if(this.selectedBusSec !== undefined){
      let index = this.selectedBusSec.indexOf(sec);
      if (index>=0) {
        return true;
      }else{
        return false;
      }
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
      this.currentLocation={...loc};
      this.centerLocation();
    })
    
  }

  changeLocation(loc){
    this.currentLocation = loc;
    //console.log('user location 1: ',this.user.loc);
  }

  centerLocation (){
    this.map.initMap({...this.currentLocation})
  }

}
