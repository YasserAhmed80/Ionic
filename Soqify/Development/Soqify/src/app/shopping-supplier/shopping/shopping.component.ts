import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/shared/services/messages.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { ProductService } from 'src/app/product/services/product.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { IProduct } from 'src/app/model/product';

@Component({
  selector: 'app-shopping',
  templateUrl: './shopping.component.html',
  styleUrls: ['./shopping.component.scss'],
})
export class ShoppingComponent implements OnInit {
  dataLoaded: boolean = false;
  productList: IProduct []= [];
  display_icon: string = "list-outline";
  displayType: string = "grid" 

  constructor( private messagesService:MessagesService,
               private masterData: MasterDataService,
               private productService: ProductService,
               private authUser: AuthService,


  ) { }

  ngOnInit() {

    let loader = this.messagesService.showLoading('جاري تحميل البيانات')
    this.dataLoaded = false;


    this.masterData.getMasterData().then(()=>{

      this.productService.runQuery(false);

      this.productService.supplierFilter$.next(this.authUser.user.id);
      if (this.productService.savedProductFilter){
        this.productService.setProductFilter(this.productService.savedProductFilter)
      } 

      this.productService.runQuery(true);

     
      this.productService.productSearchReasult$.subscribe((results)=>{
         this.productList = results[0];
         this.productList.sort((a,b)=>b.createdAt-a.createdAt)
         this.dataLoaded = true;
      })


     
      loader.then((loading)=> loading.dismiss());
    });

  }

  changeDisplay(){
    if (this.displayType ==="grid"){
      this.display_icon =  "grid-outline";
      this.displayType="list";
    }else{
      this.display_icon =  "list-outline";
      this.displayType="grid"
    }
    
  }

}
