import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MainRoutingModule } from './main-routing.module';

import { MainComponent } from './main.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MainRoutingModule
  ],
  declarations: [MainComponent]
})
export class MainModule {}
