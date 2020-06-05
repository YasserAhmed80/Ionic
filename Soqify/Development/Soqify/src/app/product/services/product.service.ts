import { Injectable } from '@angular/core';
import { IProduct} from '../../model/product'
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(public fireStore: AngularFirestore) { }

  // add new product
  async addProduct(product:IProduct) {
    let newProduct = this.fireStore.collection('product').add(product);
    
    await newProduct
      .then((doc) => {
        console.log ('added product', doc)
        return doc;
      })
      .catch((err) => {
        console.log ('added product err', err)
        return false;
      });
  }

    // get data of look up tabe
    async  getProduct(productID) {
      let data =await   this.fireStore.collection('product').valueChanges({idField:'uid'}).pipe(take(1)).toPromise();
      console.log ('get product ', data)
      return data;
  }
}
