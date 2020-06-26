import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/app/model/product';

@Component({
  selector: 'app-item-detail-wide',
  templateUrl: './item-detail-wide.component.html',
  styleUrls: ['./item-detail-wide.component.scss'],
})
export class ItemDetailWideComponent implements OnInit {
  @Input('product') product: IProduct;

  constructor() { }

  ngOnInit() {}

}
