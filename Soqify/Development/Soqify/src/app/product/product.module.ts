import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductDetailComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';


@NgModule({
  declarations: [ 
    ProductItemComponent, ProductDetailComponent, ProductListComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    IonicModule,
    FormsModule, ReactiveFormsModule ,
    SharedModule
  ],
  exports:[
    
  ]
})
export class ProductModule { }
