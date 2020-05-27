import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(public toastController:ToastController) 
  { }

 
  async showToast(header:string, message:string) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      position: 'top',
      duration:2000,
      cssClass: 'toast-success',
      buttons: [{
          text: 'شكرا',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
}
