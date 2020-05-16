import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  cardsAll = [];
  cards = [];
  currentPos = 0;
  page = 1;
  pageSize = 5;
  showSpinner = false;
  loadMore = "Loading Data ...";
  spinner = "circular";
  constructor(private data:DataService) { 
  
  }

  ngOnInit() {
    this.data.createCards(16);
    this.cardsAll = this.data.cards;
    this.loadData(event,true);
  }

  loadData(event, firstLoad:boolean = false){
    setTimeout(()=>{
      
      if (!firstLoad) {
        event.target.complete();
      };
      
      let lastItem = this.pageSize * this.page;

      if (lastItem > this.cardsAll.length){
        lastItem = this.cardsAll.length ; 
        this.loadMore = "No more data to be loaded";
        this.showSpinner=false;
        this.spinner = "null"
      } else {
        this.showSpinner=true;
        this.page++;
      }  
      
      this.cards = this.cardsAll.slice(this.currentPos, lastItem)

    },2000)
  }

}
