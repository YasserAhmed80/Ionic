import { Component, OnInit, Input } from '@angular/core';
import { IOrderDetail, IOrderItemDetail } from 'src/app/model/order';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  @Input ('order') order:IOrderDetail;
  items:IOrderItemDetail[]=[];

  constructor(private orderService:OrderService) { }

  ngOnInit() {
    // this.getOrderItems();
  }

  getOrderItems(){
    // console.log(ord_id)
    if (this.items.length=== 0){
      this.orderService.getOrderItems$ (this.order.id).subscribe(item=>{
        this.items.push(item);
     
      })
    }
    
  }
}
