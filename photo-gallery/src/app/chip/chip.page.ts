import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.page.html',
  styleUrls: ['./chip.page.scss'],
})
export class ChipPage implements OnInit {
  currentPos= 0;
  pageSize=5;
  cardsAll = [];
  cards = [];
  currentPage = 1;
  pageEnd: boolean = false;
  constructor(private data:DataService) { }


  ngOnInit() {
    this.data.createCards (30);
    this.cardsAll = this.data.cards;
    this.cards = this.cardsAll.slice (this.currentPos, this.pageSize);
    this.currentPage = this.currentPage+1;
    this.currentPos = this.currentPage  * this.pageSize;

    if (this.currentPos > this.cardsAll.length) {
      this.pageEnd = true
    }

    console.log(`current pos:${this.currentPos} and current page: ${this,this.currentPage}`)

  }


  LoadMoreData(){
    console.log(`current pos:${this.currentPos} and current page: ${this,this.currentPage}`)
    this.cards = this.cardsAll.slice(0, this.currentPos);

    this.currentPos = this.currentPage  * this.pageSize;
    this.currentPage = this.currentPage+1;
    if (this.currentPos > this.cardsAll.length) {
      this.pageEnd = true
    }

  }

}
