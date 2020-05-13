import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-action-sheet',
  templateUrl: './action-sheet.page.html',
  styleUrls: ['./action-sheet.page.scss'],
})
export class ActionSheetPage {

  badgeItems = [];

  constructor(public actionSheetController: ActionSheetController,public alertControler:AlertController) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    this.getBadgeItems();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      subHeader: 'Please select item',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          alert ("delete");
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'arrow-dropright-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

  }

  async alertSampleOne(){
    const alert =await this.alertControler.create({
      header: 'Alert One',
      subHeader:'Aert one subheader',
      message:'Hello Alert one',
      buttons:["Ok", "Cancel"]
    });

    await alert.present();
  }

  async alertSampleTwo(){
    const alert1 = await this.alertControler.create({
      header: 'Alert 2',
      subHeader:'Sample 2',
      message:'With handler',
      buttons:[
        {
          text:'Cancel',
          role:'Cancel',
          cssClass:'warning',
          handler:(yasser)=>{
            alert('Hello Yasser from Sample 2');
          }  
        },
        {
          text:'Ok',
          cssClass:'primary',
          handler:()=>{
            alert ('Sample 2 from Ok');
          }
        }
      ]
    })

    await alert1.present()
  }

  async alertSampleThree(){
    const alert1 = await this.alertControler.create({
      header: 'Prompt!',
      subHeader: 'with inputs',
      inputs: [
        {
          name: 'name1',
          label:'name 1',
          type: 'text',
          placeholder: 'Placeholder 1'
        },
        {
          name: 'name2',
          type: 'text',
          id: 'name2-id',
          value: 'hello',
          placeholder: 'Placeholder 2'
        },
        // multiline input.
        {
          name: 'paragraph',
          id: 'paragraph',
          type: 'textarea',
          placeholder: 'Placeholder 3'
        },
        {
          name: 'name3',
          label:'site URL',
          value: 'http://ionicframework.com',
          type: 'url',
          placeholder: 'Favorite site ever'
        },
        // input date with min & max
        {
          name: 'name4',
          type: 'date',
          min: '2017-03-01',
          max: '2018-01-12'
        },
        // input date without min nor max
        {
          name: 'name5',
          type: 'date'
        },
        {
          name: 'name6',
          type: 'number',
          min: -5,
          max: 10
        },
        {
          name: 'name7',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            alert(JSON.stringify(data) )
          }
        }
      ]
    });

    await alert1.present();
  }

  async alertSampleFour(){
    let radio =[];

    for (let i=1; i <6 ; i++){
      radio.push({
        name: 'radio' + i,
        type: 'radio',
        label: 'Radio ' + i,
        value: 'value' + i,
        checked: i===1? true : false
      })
     
    }


    const alert1 = await this.alertControler.create({
      header: 'Radio',
      translucent:true,
      inputs:  radio,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            alert(data);
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            alert(data);
          }
        }
      ]
    });

    await alert1.present();
  }

  getBadgeItems(){
 
    for (let i=1 ; i<5 ; i++){
      this.badgeItems.push(`Item # ${i}`)
    }

    return this.badgeItems;
  }

  
}
