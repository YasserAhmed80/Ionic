import { Injectable } from '@angular/core';
import { IProduct} from '../../model/product'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  currentProduct: IProduct ;
  selectedProducts: IProduct[]=[];

  constructor(public fireStore: AngularFirestore) {
    
    let product = localStorage.getItem('currentProduct');
    if ( product !== 'undefined'){
      this.currentProduct = JSON.parse(product);
    }
    //console.log('current prod', this.currentProduct)
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



  
}
