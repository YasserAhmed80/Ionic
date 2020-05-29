import { Component, OnInit ,AfterViewInit,  ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { IGeoLocation } from 'src/app/model/types';

declare var google: any;

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements  AfterViewInit {

  @Input ('currentLocation') currentLocation: IGeoLocation;
  @Output() getLocation = new EventEmitter();

  @ViewChild('mapElement',{read:ElementRef, static:false}) mapElement: ElementRef;

  map:any;

  marker: google.maps.Marker []=[];

  positionMarker: google.maps.Marker;

  currentPosition: IGeoLocation;


  constructor() { }

  ngAfterViewInit() {
     this.initMap(this.currentLocation)
  }


  initMap(loc:IGeoLocation) {

    this.currentPosition = loc;

    let coords = new google.maps.LatLng(loc.latitude, loc.longitude)
    let mapOptions: google.maps.MapOptions ={
      center:coords,
      
      zoom:4,
      mapTypeControl:false
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    //set start marker
    this.positionMarker = new google.maps.Marker({
      map:this.map,
      position:coords,
      title:'Drag me!',
      draggable: true,
      label: 'موقع عملك'
    })

    this.positionMarker.addListener('dragend', (m)=>{
      // do shome thing
    });

    //this.addMarkers ();

    google.maps.event.addListener(this.map, 'click', (event)=>this.addMarkerPosition(event.latLng, this.map));
  


  }

  addMarkerPosition(coords, map){
    if (this.positionMarker) this.positionMarker.setMap(null);

    this.positionMarker = new google.maps.Marker({
      position:coords,
      draggable: true,
      map:map,
      //animation: google.maps.Animation.DROP,
      label: 'Your Position' 
    });

    

  }

  getMarkerPosition(){
    let x,y; 
    x = this.positionMarker.getPosition().lng();
    y = this.positionMarker.getPosition().lat();
    
    this.currentPosition.longitude=x;
    this.currentPosition.latitude=y;


    this.getLocation.emit(this.currentPosition)
  }


    

  // addMarker(coords){
  //   console.log(coords)
  //   let marker: google.maps.Marker = new google.maps.Marker({
  //     position:{lat: coords.lat  , lng:  coords.lng},
  //     draggable: true,
  //     map:this.map,
  //     animation: google.maps.Animation.DROP,
  //     label: 'Point#' 
  //     })

  //     return marker
  // }
    

  // addMarkers(){
  //   for (let i=1; i < 10 ; i++){
      
  //       let position ={lat: 30.511 +  Math.random()* i, lng: 30.447 -  Math.random()* i};
  //       this.marker.push(this.addMarker(position))
  //     }

      
  // }
    


 

}
