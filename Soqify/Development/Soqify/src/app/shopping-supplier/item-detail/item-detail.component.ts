import { Component, OnInit, Input } from '@angular/core';
import { IProduct } from 'src/app/model/product';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/product/services/product.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { Sizes, IColor, ISize } from 'src/app/data/master-data';

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

  colors:IColor[] = [];
  sizes:ISize[] = [];
  selectedColor: number = -1;
  selectedSize: number = -1;

  dataLoaded:boolean=false;

  slideOpts = {
    slidesPerView: 1,
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    }
  }  

  constructor(private messagesService:MessagesService,
              private productService:ProductService,
              private activatedRoute: ActivatedRoute,
              private masterData:MasterDataService,

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
    
    this.masterData.getMasterData().then(()=>{

      this.colors = this.productService.getColors(this.currentProduct);
      this.sizes =this.productService.getsizes(this.currentProduct);
      loader.then((loading)=> loading.dismiss());
    });

  }

  updatedAmount(change:number){
    this.amount = this.amount+change;
    if (this.amount<this.minAmount) {this.amount=this.minAmount};

    if (this.amount>this.maxAmount) {this.amount=this.maxAmount}
  }

  setSelectedColor(key:number){
    this.selectedColor = key;
  }
  setSelectedSize(key:number){
    this.selectedSize = key;
  }

}
