import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { IOrder } from 'src/app/model/order';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AlertController } from '@ionic/angular';
import { installations } from 'firebase';
import { OrderService } from 'src/app/order/services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  orders:IOrder[]
  supplierName:string;

  constructor(private cartService:CartService,
              private authService:AuthService,
              public alertController:AlertController,
              private orderService:OrderService
              

  ) { }

  ngOnInit() {
    this.orders = this.cartService.orders;
    this.supplierName = this.authService.currentUser.name;
  }

  deleteItem(order,item){
    this.cartService.deleteItem(order,item);
  }

  saveOrdersToDB(order: IOrder){
    let action = "حفظ"
    this.presentAlertConfirm(action, 1,order)
  }

  deleteOrderFromCart(order){
    let action = "حذف"
    this.presentAlertConfirm(action, 2,order)
  }

  async presentAlertConfirm(msg:string, actionType:number, order:IOrder) {
    // actionType: 1= save order, 2=delete order from cart
    let message = 'هل تريد';
    message +=  "<strong> <<" + msg + ">> </strong>"
    message +=  "هذة الفاتورة!!! "

    const alert = await this.alertController.create({

      cssClass: 'my-custom-class',
      header: 'من فضلك اكد اختيارك',
      message: message,
      buttons: [
        {
          text: 'الغاء',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'موافق',
          cssClass: 'danger',
          handler: () => {
            if (actionType===1) {
              // save order
              this.orderService.saveOrderToDB(order);
              this.cartService.deleteOrderFromCart(order);
            } else if (actionType ===2){
              // delete order
              this.cartService.deleteOrderFromCart(order)
            }

          }
        }
      ]
    });

    await alert.present();
  }

}
