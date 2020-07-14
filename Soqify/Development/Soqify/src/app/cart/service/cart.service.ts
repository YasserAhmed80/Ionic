import { Injectable } from '@angular/core';
import { IOrder, IOrderItem } from 'src/app/model/order';
import { IProduct } from 'src/app/model/product';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IonMenuToggle } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  items_count:number =0;

  orders: IOrder[] = []; // order can include many sub orders for each supplier.
  constructor(private fireStore: AngularFirestore,
              private utilityService:UtilityService,

  ) { 
    let ords = localStorage.getItem('orders');
    if ( ords != 'undefined' &&  ords != null){
      this.orders = JSON.parse(ords);
      this.items_count = this.getItemsCount();
      // console.log ('from localstorgae',this.orders)
    }else{
      this.orders=[];
    }
    // console.log (this.orders)
  }

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
        count:0,
        status:1,//new 
        cdate: this.utilityService.serverTimeStamp,
        items:[]
      }
      this.orders.push(order);
    };

    // check if item added or is new
    let item_index = order.items.map((i)=> i.pro_id).indexOf(product.id);
    var item:IOrderItem;
    if (item_index>-1){
      item = order.items[item_index]
      item.qty = item.qty+qty;
    }else{
      // add item to orders
      item={
        pro_id:product.id,
        qty:qty,
        price:product.price,
        color:color,
        size:size,
        pro_name:product.name, // not saved in DB
        img:product.imgs[0]
      };

      order.items.push(item);
    }
    this.setOrderSummary(order);

    this.items_count = this.getItemsCount();

    localStorage.setItem("orders",JSON.stringify( this.orders))

  }

  setOrderSummary(order:IOrder){

    if (order.items.length>0){
      let items = order.items;

      let count = items.length;
      let qty = items.map((i)=>i.qty).reduce((a, b) => a+b);
      let sum = items.map((i)=>i.qty * i.price).reduce((a, b) => a+b);

      order.qty = qty;
      order.sum = sum;
      order.count = count;
    }
  }

  deleteItem(order:IOrder, item:IOrderItem){
    let item_index = order.items.indexOf(item)

    if (item_index>-1){
      order.items.splice(item_index,1);

      // check if order is empty
      if(order.items.length===0){
        // delete the order
        this.orders.splice(this.orders.indexOf(order),1)
      }

      this.setOrderSummary(order);
      this.items_count=this.getItemsCount();
      localStorage.setItem("orders",JSON.stringify( this.orders))
    }
  }

  getItemsCount(){
    console.log(this.orders.length);
    if (this.orders.length>0){
      return this.orders.map(o=>o.count).reduce((a,b)=>a+b)
    }else{
      return 0;
    }
    
  }

  deleteOrderFromCart(order:IOrder){
    this.orders.splice(this.orders.indexOf(order),1);
    this.items_count=this.getItemsCount();
    localStorage.setItem("orders",JSON.stringify( this.orders));
  }



}
