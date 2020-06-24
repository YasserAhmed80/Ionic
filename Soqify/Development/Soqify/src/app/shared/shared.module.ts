import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GoogleMapComponent } from './google-map/google-map.component';
import { ImgLoaderComponent } from './img-loader/img-loader.component';
import { ControlMessageComponent } from './control-message/control-message.component';

const COMPONENTS =[
  GoogleMapComponent,
  ImgLoaderComponent,
  ControlMessageComponent
]


@NgModule({
  declarations: [COMPONENTS,],
  imports: [
    CommonModule,IonicModule.forRoot(),
    
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  exports:[COMPONENTS]
  
})
export class SharedModule { }
