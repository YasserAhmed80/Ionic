import { Component, OnInit } from '@angular/core';
import { MasterDataService } from '../../shared/services/master-data.service'
import { main_cat, parent_cat,sub_cat, IParent_cat, IMain_cat, ISub_cat,IBusiness_type, business_type } from '../../data/master-data';
import { IUser } from 'src/app/model/types';
import { AuthService } from '../services/auth.service';
import { installations } from 'firebase';
import { MessagesService } from 'src/app/shared/services/messages.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  businessType: IBusiness_type[];
  parentCat:IParent_cat[];

  user:IUser = null;

  selectedBusSec: number[]=[];

  constructor(public masterDataService: MasterDataService, 
              public authServcie:AuthService,
              public messagesService:MessagesService
             ) { 

  }

  ngOnInit() {
    this.masterDataService.getMasterData().then(()=>{
      this.businessType=this.masterDataService.businessType;
      this.parentCat = this.masterDataService.productParentCat;
    });

    this.user = this.authServcie.user
    this.selectedBusSec = this.user.bus_sec;
    
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



}
