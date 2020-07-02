import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IProduct } from 'src/app/model/product';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  
  productList:IProduct[]=[];
  productFilter:any[]=[];

  parentCat= [];
  mainCat = [];
  subCat=[];
  images=[];

  dataLoaded:Boolean=false;

  constructor(public productService:ProductService,
              public masterData: MasterDataService,
              private messagesService:MessagesService,
              public menuController : MenuController,
              private authUSer: AuthService,
              private supplierService:SupplierService,
    ) { }

  async ngOnInit() {

    let loader = this.messagesService.showLoading('جاري تحميل البيانات')
    this.dataLoaded = false;


    this.masterData.getMasterData().then(()=>{
      this.parentCat = this.masterData.selectParentCat();

      this.productService.runQuery(false);

      this.productService.supplierFilter$.next(this.supplierService.currentSupplier.id);
      if (this.productService.savedProductFilter){
        console.log('saved search in local s', this.productService.savedProductFilter)
        this.productService.setProductFilter(this.productService.savedProductFilter)
      } 

      this.productService.runQuery(true);

     
      this.productService.productSearchReasult$.subscribe((results)=>{
         this.productList = results[0];
         this.productList.sort((a,b)=>b.createdAt-a.createdAt)
         
         this.productFilter = results[1]
         this.dataLoaded = true;
      })


     
      loader.then((loading)=> loading.dismiss());
    });

   
   
  }

  removeFilter(filter){
    this.productService.removeProductFilter(filter)
  }
  
  menuClick(){
    this.menuController.close();
  }


}
