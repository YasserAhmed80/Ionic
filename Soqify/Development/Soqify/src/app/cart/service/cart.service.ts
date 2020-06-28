import { Injectable } from '@angular/core';
import { IOrder, IOrderItem } from 'src/app/model/order';
import { IProduct } from 'src/app/model/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  orders: IOrder[] = []; // order can include many sub orders for each supplier.
  constructor() { }

  addToCard(product:IProduct, cus_id:string, qty:number,color:number, size:number){
    let sup_id = product.sup_id;
    var order:IOrder;

    // check of supplier order exists
    let order_index = this.orders.map((ord)=> ord.sup_id).indexOf(sup_id);
    if (order_index >-1){
      console.log('order exist')
      order = this.orders[order_index];
    }else{
      order ={
        sup_id:sup_id,
        cus_id:cus_id,
        sum:0,
        qty:0,
        status:1,
        cdate:null,
        items:[]
      }
      this.orders.push(order);
    };

    // add item to orders
    let item:IOrderItem ={
      pro_id:product.id,
      qty:qty,
      price:product.price,
      color:color,
      size:size,
      pro_name:product.name, // not saved in DB
    };

    order.items.push(item);
    let summary = this.OrderSummary(order);

    order.qty = summary.count;
    order.sum = summary.sum;



    console.log(order);

  }

  OrderSummary(order:IOrder){
    let items = order.items;

    let count = items.map((i)=>i.qty).reduce((a, b) => a+b);
    let sum = items.map((i)=>i.qty * i.price).reduce((a, b) => a+b);

    return {count, sum}

  }
}
