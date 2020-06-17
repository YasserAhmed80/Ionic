import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IProduct } from 'src/app/model/product';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { MessagesService } from 'src/app/shared/services/messages.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  
  productList:IProduct[]=[];

  parentCat= [];
  mainCat = [];
  subCat=[];

  dataLoaded:Boolean=false;

  constructor(private productService:ProductService,
              public masterData: MasterDataService,
              private messagesService:MessagesService
    ) { }

  async ngOnInit() {

    let loader = this.messagesService.showLoading('جاري تحميل البيانات')
    this.dataLoaded = false;

    this.productList =await this.productService.getAllProduct();
    //console.log(this.productList);

    this.masterData.getMasterData().then(()=>{
      this.parentCat = this.masterData.selectParentCat();
      this.dataLoaded = true;
      loader.then((loading)=> loading.dismiss());
    });

   
  }

  

  

}
