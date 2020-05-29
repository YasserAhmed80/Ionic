import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GoogleMapComponent } from './google-map/google-map.component';

const COMPONENTS =[
  GoogleMapComponent,
]


@NgModule({
  declarations: [GoogleMapComponent],
  imports: [
    CommonModule,IonicModule.forRoot(), 
    
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  exports:[GoogleMapComponent]
  
})
export class SharedModule { }
