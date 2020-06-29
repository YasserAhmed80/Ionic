import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { IOrder } from 'src/app/model/order';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  orders:IOrder[]

  constructor(private cartService:CartService

  ) { }

  ngOnInit() {
    this.orders = this.cartService.orders;
  }

  deleteItem(order,item){
    this.cartService.deleteItem(order,item);
  }

}
