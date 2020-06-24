import { Injectable } from '@angular/core';
import { IProduct} from '../../model/product'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { take, switchMap,tap, distinctUntilChanged } from 'rxjs/operators'
import { BehaviorSubject, Observable, combineLatest,  EMPTY, of } from 'rxjs';
import { MasterDataService } from 'src/app/shared/services/master-data.service';
import { UtilityService } from '../../shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  currentProduct: IProduct ;
  savedProductFilter: Array<any>;
  selectedProducts: IProduct[]=[];

  // set filter observables 
  /**
   * we need to filter by: business sec, parent cat, main cat, sub cat, supllier
   */
  runSearchQuery$: BehaviorSubject<boolean>; // it used to triger search query. False = pause search, true = run search
  businessSecFilter$ : BehaviorSubject<number|null>;
  parentCatFilter$ : BehaviorSubject<number|null>;
  mainCatFilter$ : BehaviorSubject<number|null>;
  subCatFilter$ : BehaviorSubject<number|null>;
  supplierFilter$ : BehaviorSubject<string|null>;

  productSearchReasult$: Observable<any>;






  constructor(public fireStore: AngularFirestore,
             private masterData:MasterDataService,
             private utilityService:UtilityService
             ) 
  {
    
    let product = localStorage.getItem('currentProduct');
    if ( product !== 'undefined'){
      this.currentProduct = JSON.parse(product);
    }

    let savedProdFilter = localStorage.getItem('productSearchFilter');
    if ( savedProdFilter !== 'undefined' && savedProdFilter !== null){
      console.log(savedProdFilter)
      this.savedProductFilter = JSON.parse(savedProdFilter);
    }



    this.defineProductSearchObs();
  }


  async saveProduct (product:IProduct){
    var savedProduct;
    if (product.id){
      // update product
      savedProduct = await this.updateProduct(product)
      console.log('prod updated', this.currentProduct)
    }else{
      //add new product
      savedProduct = await this.addProduct(product)
      console.log('prod new', this.currentProduct)
    }

    console.log ('local storage prod', savedProduct);
    localStorage.setItem('currentProduct', JSON.stringify(savedProduct));

    this.updateSelectedProducts(savedProduct);
    return savedProduct;
  }
  // add new product
  async addProduct(product:IProduct) {
   // console.log  ('timestamp',  firebase.database.ServerValue.TIMESTAMP)
    product.createdAt = this.utilityService.timestamp
    let newProduct = this.fireStore.collection('product').add(product);
    
    return await newProduct
      .then((doc) => {
        //console.log ('added product', doc)
        this.currentProduct = product;
        this.currentProduct.id = doc.id
        return this.currentProduct;
      })
      .catch((err) => {
        console.log ('added product err', err)
        return err;
      });
  }

  // Store user in localStorage
  async updateProduct(product:IProduct) {
     return await this.fireStore
      .collection("product")
      .doc(product.id)
      .set(product, { merge: true })
      .then((updatedProduct) => {
        this.currentProduct = product;
        return this.currentProduct;
      })
      .catch((err)=>{
        console.log('update product error:', err)
        return err;
      })
  }

  // get data of look up tabe
  async  getProduct(productID) {
    
      let data =  await this.fireStore.collection('product', (ref)=> ref.where ('id', '==',productID))
      .valueChanges({idField: 'id'}).pipe(take(1)).toPromise();
      //console.log ('get product ', data[0])
      return <IProduct>data[0];
  }

  // get data of look up tabe
  async  getAllProduct() {

    var productCollection:AngularFirestoreCollection<IProduct> = this.fireStore.collection("product")
    
    const query = productCollection.ref;

    return await  query.get().then((results)=>{
       results.forEach((doc)=>{
        this.selectedProducts.push(<any> doc.data())
       })

       return this.selectedProducts;

    })
  }

  updateSelectedProducts (prod:IProduct){
    let index = this.selectedProducts.map(prod=> prod.id).indexOf(prod.id);

    if (index > -1) {
      this.selectedProducts[index] = prod; 
    }
   
  }

  getSelectedProduct(prodId){
    let index = this.selectedProducts.map(prod=> prod.id).indexOf(prodId);

    if (index > -1) {
      return this.selectedProducts[index] ;

    }else{
      return null;
    }
  }

  // Product filters Started here ....c  // search observale preparation
  defineProductSearchObs(){
    this.businessSecFilter$ = new BehaviorSubject(null);
    this.parentCatFilter$ = new BehaviorSubject(null);
    this.mainCatFilter$ = new BehaviorSubject(null);
    this.subCatFilter$ = new BehaviorSubject(null);
    this.supplierFilter$ = new BehaviorSubject(null);

    this.runSearchQuery$ = new BehaviorSubject(false);

    this.productSearchReasult$ =<any> combineLatest(
      this.runSearchQuery$,
      this.parentCatFilter$,
      this.mainCatFilter$,
      this.subCatFilter$,
      this.supplierFilter$
    ).pipe(
      // distinctUntilChanged((p,c)=> { console.log('p and c',p,c); return true }),
      // tap (value => console.log(value)),
      switchMap(([runFlag, parent_cat, main_cat, sub_cat, sup_id])=>{
        

        if (runFlag){
          // console.log('filter run', runFlag, parent_cat, main_cat, sub_cat, sup_id)

          let results =  <any>this.fireStore.collection("product", ref=>{
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            if (sup_id) {query = query.where('sup_id', '==', sup_id)};
            if (parent_cat) {query = query.where('p_cat', '==', parent_cat)};
            if (main_cat) {query = query.where('m_cat', '==', main_cat)};
            if (sub_cat) {query = query.where('s_cat', '==', sub_cat)};

            //query = query.orderBy('createdAt','desc') ;
            return query;
          });

          return combineLatest( results.valueChanges(), this.getProductFilter());

        }else{
          return EMPTY;
        }
      })
    ) 
  }

  filterByParentCat(key:number){
    this.runQuery(false);
    this.mainCatFilter$.next(null);
    this.subCatFilter$.next(null);
    this.parentCatFilter$.next(key);
    this.runQuery(true);
    
  }
  filterByMainCat(main_key:number, parent_key: number){
    this.runQuery(false);
    this.subCatFilter$.next(null);
    this.mainCatFilter$.next(main_key);
    this.parentCatFilter$.next(parent_key);
    this.runQuery(true);
    
  }
  filterBySubCat(sub_key:number, main_key:number, parent_key: number){ 
    this.runQuery(false);
    this.subCatFilter$.next(sub_key);
    this.mainCatFilter$.next(main_key);
    this.parentCatFilter$.next(parent_key);
    this.runQuery(true);
  }

  runQuery(flag: boolean){
    this.runSearchQuery$.next(flag);
  }


  getProductFilter():Observable<any> {
    let filters = [];
    let filter = {}

    let parent_cat = this.parentCatFilter$.getValue();
    let main_cat = this.mainCatFilter$.getValue();
    let sub_cat = this.subCatFilter$.getValue();

    if (parent_cat){
      filter = {type:'parent', key: parent_cat, name:this.masterData.getCatName(parent_cat, 'parent') };
      filters.push(filter);
    }

    if (main_cat){
      filter = {type:'main', key: main_cat, name:this.masterData.getCatName(main_cat, 'main') };
      filters.push(filter);
    }

    if (sub_cat){
      filter = {type:'sub', key: sub_cat, name:this.masterData.getCatName(sub_cat, 'sub') };
      filters.push(filter);
    }

    // console.log('saved search fileter', filters)
    this.SaveProductSearchFilter(filters);

    return of( filters);

  }

  SaveProductSearchFilter(filters){
    localStorage.removeItem('productSearchFilter');

    if (filters.length>0){
      localStorage.setItem('productSearchFilter',JSON.stringify(filters));
    }
    
  }

  removeProductFilter(filter){
    this.runQuery(false);

    switch (filter.type){
      case 'parent': {
        this.parentCatFilter$.next(null); 
        this.mainCatFilter$.next(null);
        this.subCatFilter$.next(null);
      } 
      case 'main': {
        this.mainCatFilter$.next(null);
        this.subCatFilter$.next(null);
      }
      case 'sub': this.subCatFilter$.next(null);
    }

    this.runQuery(true);
  }

  clearProductFilter(){
    this.mainCatFilter$.next(null);
    this.subCatFilter$.next(null);
    this.parentCatFilter$.next(null);
  }

  setProductFilter(filters:Array<any>){

    this.clearProductFilter();

    filters.forEach(filter=>{
      console.log('filter', filter)
      switch (filter.type){
        case 'parent': {
          this.parentCatFilter$.next(filter.key); 
          break;
        } 
        case 'main': {
          this.mainCatFilter$.next(filter.key);
          break;
        }
        case 'sub':{
          // console.log('sub-------', filter)
          this.subCatFilter$.next(4);
        }
      }
    })

  }

  
  
}
