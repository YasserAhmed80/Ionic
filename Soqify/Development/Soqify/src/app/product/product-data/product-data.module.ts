import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDataPageRoutingModule } from './product-data-routing.module';

import { ProductDataPage } from './product-data.page';
import { ControlMessageComponent } from 'src/app/shared/control-message/control-message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDataPageRoutingModule, ReactiveFormsModule
  ],
  declarations: [ProductDataPage, ControlMessageComponent]
})
export class ProductDataPageModule {}
