import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppThemeService {

  constructor() { }

   
  
   // Add or remove the "dark" class based on if the media query matches
   toggleDarkTheme(darkMode:boolean) {
      // Use matchMedia to check the user preference
      // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      // console.log(prefersDark);
     document.body.classList.toggle('dark', darkMode);
   }
}
