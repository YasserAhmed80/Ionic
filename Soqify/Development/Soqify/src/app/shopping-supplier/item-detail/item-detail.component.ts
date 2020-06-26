import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/app/model/product';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/product/services/product.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  currentProduct:IProduct;
  minAmount:number=1;
  maxAmount:number = 4;
  amount:number = 1;

  dataLoaded:boolean=false;

  constructor(private messagesService:MessagesService,
              private productService:ProductService,
              private activatedRoute: ActivatedRoute,

  ) { }

  async ngOnInit() {
    let loader = this.messagesService.showLoading('جاري تحميل البيانات')
    this.dataLoaded = false;

    const productId = this.activatedRoute.snapshot.params['productId'];

    if (productId){
      if (productId !=-1) {
        //  check if the product in current selected product in productService.
        let prod = this.productService.getSelectedProduct(productId);
        if (prod){
          // product for selectedProducts List
          console.log('product from memory')
          this.currentProduct = prod;
        }else{
          // get product from DB
          console.log('product from data base')
          this.currentProduct =  await  this.productService.getProduct(productId);
        }
      }
    }
    else {
      this.currentProduct = this.productService.currentProduct;
    }   

    loader.then((loading)=> loading.dismiss());
  }

  updatedAmount(change:number){
    this.amount = this.amount+change;
    if (this.amount<this.minAmount) {this.amount=this.minAmount};

    if (this.amount>this.maxAmount) {this.amount=this.maxAmount}
  }

}
