import { Component, OnInit, Input } from '@angular/core';
import { IOrderDetail, IOrderItemDetail } from 'src/app/model/order';
import { OrderService } from '../services/order.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss'],
})
export class OrderItemComponent implements OnInit {
  @Input ('order') order:IOrderDetail;
  items:IOrderItemDetail[]=[];
  isLoading:boolean =true;

  constructor(private orderService:OrderService,
              private router:Router,
              private route: ActivatedRoute,
    ) 
    { }

  ngOnInit() {

  }

  openOrder(){
    this.orderService.setCurrentOrder(this.order);
    this.router.navigate(['order-detail'],{ relativeTo: this.route })
  }
}
