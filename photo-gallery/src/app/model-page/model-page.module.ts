import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModelPagePageRoutingModule } from './model-page-routing.module';

import { ModelPagePage } from './model-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModelPagePageRoutingModule
  ],
  declarations: [ModelPagePage],

})
export class ModelPagePageModule {}
