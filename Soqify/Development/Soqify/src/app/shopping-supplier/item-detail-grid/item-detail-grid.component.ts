import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/app/model/product';

@Component({
  selector: 'app-item-detail-grid',
  templateUrl: './item-detail-grid.component.html',
  styleUrls: ['./item-detail-grid.component.scss'],
})
export class ItemDetailGridComponent implements OnInit {
  @Input('product') product: IProduct;

  constructor() { }

  ngOnInit() {}

}
