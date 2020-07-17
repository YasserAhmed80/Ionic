import { Component, OnInit, Input } from '@angular/core';
import { IOrderDetail, IOrderItemDetail } from 'src/app/model/order';
import { OrderService } from '../services/order.service';
import { SupplierCustomerService } from 'src/app/shared/services/supplier-customer.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  order:IOrderDetail;
  items:IOrderItemDetail[]=[];
  isLoading:boolean =true;

  constructor(private orderService:OrderService,
              private supplierService:SupplierCustomerService,
    ) { }

  ngOnInit() {
    this.order = this.orderService.currentOrder;
    this.getOrderItems();
    this.supplierService.getSupplierById$(this.order.sup_id).subscribe(d=>console.log('supplier',d))

  }

  getOrderItems(){
     console.log(this.order.id)
    //this.items=[];
    if (this.items.length=== 0 && this.isLoading){
      this.orderService.getOrderItems$ (this.order.id).subscribe(item=>{
        this.items.push(item);
      })
    }
    this.order.items = this.items;

    this.isLoading =false;
    
  }
}
