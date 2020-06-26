import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingSupplierRoutingModule } from './shopping-supplier-routing.module';
import { HomeComponent } from './home/home.component';
import { IonicModule } from '@ionic/angular';
import { ShoppingComponent } from './shopping/shopping.component';
import { SharedModule } from '../shared/shared.module';
import { ItemDetailGridComponent } from './item-detail-grid/item-detail-grid.component';
import { ItemDetailListComponent } from './item-detail-list/item-detail-list.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';


@NgModule({
  declarations: [HomeComponent, 
                 ShoppingComponent, 
                 ItemDetailGridComponent,
                 ItemDetailComponent,
                 ItemDetailListComponent],
  imports: [
    CommonModule,
    ShoppingSupplierRoutingModule,
    IonicModule,
    SharedModule
  ]
})
export class ShoppingSupplierModule { }
