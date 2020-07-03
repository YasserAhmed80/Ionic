import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { IOrderItemDetail, IOrderDetail } from 'src/app/model/order';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  orders:IOrderDetail[] = [];

  orderItems:IOrderItemDetail[]=[];

  constructor(public orderService:OrderService,
              private supplierService: SupplierService,
    ) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders(){
    this.orderService.getOrders$(1,this.supplierService.currentSupplier.id).subscribe(order=>{
      this.orders.push(order)
    })
  }



}
