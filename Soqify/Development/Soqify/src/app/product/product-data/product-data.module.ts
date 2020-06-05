import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDataPageRoutingModule } from './product-data-routing.module';

import { ProductDataPage } from './product-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDataPageRoutingModule
  ],
  declarations: [ProductDataPage]
})
export class ProductDataPageModule {}
