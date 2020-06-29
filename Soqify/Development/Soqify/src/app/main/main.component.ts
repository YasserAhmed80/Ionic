import { Component } from '@angular/core';
import { CartService } from '../cart/service/cart.service';

@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss']
})
export class MainComponent {
  items_count:number=0;
  constructor(private cartService:CartService) {
    if(cartService.orders?.length){
      this.items_count=cartService.orders.map(o=>o.count).reduce((a,b)=>a+b)
    }else{
      this.items_count = 0;
    }
    
  }

}
