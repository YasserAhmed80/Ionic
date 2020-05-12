import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { ActionSheetController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService:PhotoService,public actionSheetControl:ActionSheetController,  private platform: Platform) {

  }
  
  ngOnInit(): void {
    this.photoService.loadSavedPhotos();

  }

  getPhoto(){
    this.photoService.addNewPhto();
    console.log (this.photoService.photos);
  }
  
  public async showMenu(photo, position){
    console.log("action sheet")
    const actionSheet =await this.actionSheetControl.create({
      header:"Photo",
      buttons:[
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            //this.photoService.deletePicture(photo, position);
          }
        }
      ]
    })

    await actionSheet.present();
  }
}
