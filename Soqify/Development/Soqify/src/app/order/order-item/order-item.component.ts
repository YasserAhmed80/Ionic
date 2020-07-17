import { Component, OnInit, Input } from '@angular/core';
import { IOrderDetail, IOrderItemDetail } from 'src/app/model/order';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent implements OnInit {
  @Input ('order') order:IOrderDetail;
  items:IOrderItemDetail[]=[];
  isLoading:boolean =true;

  constructor(private orderService:OrderService) { }

  ngOnInit() {
    // this.getOrderItems();
  }

  getOrderItems(){
     console.log(this.order.id)
    //this.items=[];
    if (this.items.length=== 0 && this.isLoading){
      this.orderService.getOrderItems$ (this.order.id).subscribe(item=>{
        this.items.push(item);
      })
    }

    this.isLoading =false;
    
  }
}
