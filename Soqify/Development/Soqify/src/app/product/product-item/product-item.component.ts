import { Component, OnInit, Input } from '@angular/core';
import { IProduct, ProductSatusRef } from 'src/app/model/product';


@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {

  @Input ('product') product: IProduct;

  currentProduct : IProduct= {
    sup_id:'1234',
    name: 'item1',
    desc:'new prodyct yyh dkkkkd djkdkkdk',
    price:100,
    m_cat:1,
    p_cat:1,
    s_cat:1,
    min_qty:1,
    status:ProductSatusRef.New
  }
  constructor() { }

  ngOnInit() {}

}
