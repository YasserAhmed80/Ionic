import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderItemComponent } from './order-item/order-item.component';
import { IonicModule } from '@ionic/angular';
import { OrderDetailComponent} from './order-detail/order-detail.component';


@NgModule({
  declarations: [OrderListComponent, OrderItemComponent,OrderDetailComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    IonicModule
  ]
})
export class OrderModule { }
