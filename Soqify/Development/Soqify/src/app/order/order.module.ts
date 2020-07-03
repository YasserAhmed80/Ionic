import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderComponent } from './order/order.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [OrderListComponent, OrderComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    IonicModule
  ]
})
export class OrderModule { }
