import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  cards = [];
  constructor(private data:DataService) { 
  
  }

  ngOnInit() {
    this.data.createCards(6);
    this.cards = this.data.cards;
  }

}
