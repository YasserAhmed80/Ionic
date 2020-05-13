import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  cards = [];
  constructor() { }

  ngOnInit() {
    this.createCards();
  }

  createCards(){
    for (let i=1; i<20; i++){
      this.cards.push({
        title:`Card# ${i}`,
        subtitle: `Subtitle ${i}`,
        content:`lorem20 djned edkedked dnendked ededkemd kedekdmked edknedkendk`,
        image: `https://source.unsplash.com/random/${i*100}×${i*100}`
      })
    }
  }

}
