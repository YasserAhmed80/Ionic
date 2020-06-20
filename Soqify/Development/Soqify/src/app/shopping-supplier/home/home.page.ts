import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  selectedSubCat:number =2 ;

  constructor() { }

  ngOnInit() {
  }

  selectSubCat(i){
    this.selectedSubCat=i;
    console.log(this.selectedSubCat)
  }

}
