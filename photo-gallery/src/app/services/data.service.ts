import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  cards = [];
  colors = [];
  constructor( ) {

   }


  createCards(itemsCount: number = 5){
    for (let i=1; i<=itemsCount; i++){
      this.cards.push({
        title:`Card# ${i}`,
        subtitle: `Subtitle ${i}`,
        content:`lorem20 djned edkedked dnendked ededkemd kedekdmked edknedkendk`,
        image: `https://source.unsplash.com/random/${i*100}×${i*100}`,
        color: this.getRandomColor()
      });

      
    }

  }

  setColors (){
    this.colors =  'primary ,  secondary ,  tertiary ,  success ,  warning ,  danger ,  light ,  medium ,   dark '.split(',').map((data)=>{
      return data.trim();
    })
    
  }
  getRandomColor (){
    this.setColors();
    let  i = this.colors.length-1;
    let index = Math.round(Math.random() * i);

    return this.colors[index];

  }
}
