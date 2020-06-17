import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailsPageRoutingModule } from './product-details-routing.module';

import { ProductDataPage } from './product-details.page';
import { ControlMessageComponent } from 'src/app/shared/control-message/control-message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsPageRoutingModule, ReactiveFormsModule
  ],
  declarations: [ProductDataPage, ControlMessageComponent]
})
export class ProductDetailsPageModule {}
