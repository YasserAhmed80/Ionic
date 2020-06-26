import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/app/model/product';

@Component({
  selector: 'app-item-detail-list',
  templateUrl: './item-detail-list.component.html',
  styleUrls: ['./item-detail-list.component.scss'],
})
export class ItemDetailListComponent implements OnInit {
  @Input('product') product: IProduct;

  constructor() { }

  ngOnInit() {}

}
