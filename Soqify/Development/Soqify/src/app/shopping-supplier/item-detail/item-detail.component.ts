import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/app/model/product';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  @Input('product') product: IProduct;

  constructor() { }

  ngOnInit() {}

}
