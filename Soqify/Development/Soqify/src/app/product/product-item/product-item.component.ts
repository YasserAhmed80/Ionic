import { Component, OnInit, Input } from '@angular/core';
import { IProduct, ProductSatusRef } from 'src/app/model/product';


@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {

  @Input ('product') product: IProduct;

  imageLoaded: boolean=false;

  constructor() { }

  ngOnInit() {}


}
