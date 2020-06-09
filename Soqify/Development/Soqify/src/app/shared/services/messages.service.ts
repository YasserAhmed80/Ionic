import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(public toastController:ToastController,
              public loadingController:LoadingController) 
  { }

 
  async showToast(header:string, message:string, type:string) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      position: 'top',
      duration:2000,
      cssClass: type==='success'? 'toast-success' : 'toast-danger',
      buttons: [{
          text: 'شكرا',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }

  async showLoading(message:string) {
    const loading = await this.loadingController.create({
      //spinner:"bubbles",
      duration:20000, // max of 20 sec 
      message: message,

    });
    await loading.present();
    return loading;
  }

}
