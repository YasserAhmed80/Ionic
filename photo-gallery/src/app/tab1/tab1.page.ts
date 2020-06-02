import { Component } from '@angular/core';
import { AppThemeService } from '../services/app-theme.service';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  toggale: boolean = false;
  currentTheme:string = 'Normal';

  constructor(private appTheme:AppThemeService, public   dataservice:DataService) {}

  ngOnInit(): void {
    this.toggaleTheme ();
    
  }
 
  toggaleTheme(){
   
    this.currentTheme = this.toggale? 'Drak' : 'Normal'
    this.appTheme.toggleDarkTheme(this.toggale)

    this.toggale=!this.toggale
  }

}
