import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { IOrderItemDetail, IOrderDetail } from 'src/app/model/order';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SupplierCustomerService } from 'src/app/shared/services/supplier-customer.service';
import { OrderStatus, IOrderStatus } from 'src/app/data/master-data';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  orders:IOrderDetail[] = [];
  orderStatus:IOrderStatus[];
  selectedStatus:number =1; // status = new

  orderItems:IOrderItemDetail[]=[];

  constructor(public orderService:OrderService,
              private supplierService: SupplierCustomerService,

    ) { }

  ngOnInit() {
    this.getOrders();
    this.orderStatus=OrderStatus;
  }

  getOrders(){
    this.orderService.getOrders$(1,this.supplierService.currentSupplier.id).subscribe(order=>{
      this.orders.push(order)
    })
  }

  setSelectedStatus(s){
    this.selectedStatus=s;
  }

}
