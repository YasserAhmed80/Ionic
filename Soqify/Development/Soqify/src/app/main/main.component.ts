import { Component } from '@angular/core';
import { CartService } from '../cart/service/cart.service';

@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss']
})
export class MainComponent {
  items_count:number=0;
  constructor(public cartService:CartService) {
  }

}
