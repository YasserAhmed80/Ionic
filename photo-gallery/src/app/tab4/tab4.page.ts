import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, PopoverController, LoadingController } from '@ionic/angular';
import { ModelPagePage } from '../model-page/model-page.page';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  media = "sm";

  currentPercentage = 0;
  iteration = 0;

  constructor(private menuController:MenuController, public modalController : ModalController, 
              public popoverController: PopoverController,
              public loadingController: LoadingController) { }

  ngOnInit() {
    this.progressBar();
  }
  closeMenu(){
    this.menuController.close()
    this.media = "none"
  }

  addMedia(){
    this.media = "sm"
    console.log(this.media)
  }

  async openModal(){
    const modal =await this.modalController.create({
      component: ModelPagePage
    });

    return await modal.present();
  }

  async openPopover(ev:any){
    const popOver =await this.popoverController.create({
      component: ModelPagePage,
      event: ev,
      translucent: true
    });

    return await popOver.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

   presentLoadingWithOptions1() {
     this.loadingController.create({
      spinner: "bubbles",
     // duration: 5000,
      message: 'Click the backdrop to dismiss early...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true,
      
    }).then((res)=>{
      res.present();
      res.onDidDismiss().then((dis)=>{
        console.log(dis);
      });

    })


  }

  presentLoadingWithOptions(){
    this.presentLoadingWithOptions1();
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 5000);

  }

  progressBar(){
    setInterval(()=>{
      this.currentPercentage = this.iteration/100;
      this.iteration ++;
    },500)
  }
}
