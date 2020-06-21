import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { IProduct } from 'src/app/model/product';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
  
  productList:IProduct[]=[];
  productFilter:any[]=[];

  parentCat= [];
  mainCat = [];
  subCat=[];

  dataLoaded:Boolean=false;

  constructor(public productService:ProductService,
              public masterData: MasterDataService,
              private messagesService:MessagesService,
              public menuController : MenuController,
              private authUSer: AuthService
    ) { }

  async ngOnInit() {

    let loader = this.messagesService.showLoading('جاري تحميل البيانات')
    this.dataLoaded = false;


    this.masterData.getMasterData().then(()=>{
      this.parentCat = this.masterData.selectParentCat();

      this.productService.runQuery(false);

      this.productService.supplierFilter$.next(this.authUSer.user.id);
      if (this.productService.savedProductFilter){
        console.log('saved search in local s', this.productService.savedProductFilter)
        this.productService.setProductFilter(this.productService.savedProductFilter)
      } 

      this.productService.runQuery(true);

     
      this.productService.productSearchReasult$.subscribe((results)=>{
         this.productList = results[0];
         this.productList.sort((a,b)=>b.createdAt-a.createdAt)
         //console.log(results)
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
