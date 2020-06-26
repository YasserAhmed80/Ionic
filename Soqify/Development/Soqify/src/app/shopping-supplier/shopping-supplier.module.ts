import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingSupplierRoutingModule } from './shopping-supplier-routing.module';
import { HomeComponent } from './home/home.component';
import { IonicModule } from '@ionic/angular';
import { ShoppingComponent } from './shopping/shopping.component';
import { SharedModule } from '../shared/shared.module';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemDetailWideComponent } from './item-detail-wide/item-detail-wide.component';


@NgModule({
  declarations: [HomeComponent, ShoppingComponent, ItemDetailComponent,ItemDetailWideComponent],
  imports: [
    CommonModule,
    ShoppingSupplierRoutingModule,
    IonicModule,
    SharedModule
  ]
})
export class ShoppingSupplierModule { }
