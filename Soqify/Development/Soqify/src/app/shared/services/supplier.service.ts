import { Injectable } from '@angular/core';
import { ISupplier } from 'src/app/model/user';
import { UtilityService } from './utility.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  currentSupplier:ISupplier;

  constructor(private utilityService:UtilityService,
              private fireStore:AngularFirestore

  ) { 
    let supplier = localStorage.getItem('supplier');
    if ( supplier !== 'undefined' && supplier ){
      this.currentSupplier = JSON.parse(supplier);
      console.log('localstorage supplier', this.currentSupplier)
    } else{
      // this.currentSupplier = this.getSupplier(authUser.user_id)
    }

  }

  async saveSupplier (supplier:ISupplier){
    var savedSupplier;
    if (supplier.id){
      // update supplier
      savedSupplier = await this.updateSupplier(supplier)
      console.log('supplier updated', this.currentSupplier)
    }else{
      //add new product
      savedSupplier = await this.addSupplier(supplier)
      console.log('supplier new', this.currentSupplier)
    }

    console.log ('local storage prod', savedSupplier);
    localStorage.setItem('supplier', JSON.stringify(savedSupplier));


    return savedSupplier;
  }


  async addSupplier(supplier:ISupplier) {
    // console.log  ('timestamp',  firebase.database.ServerValue.TIMESTAMP)
     supplier.createdAt = this.utilityService .serverTimeStamp
     let newSupplier = this.fireStore.collection('supplier').add(supplier);
     
     return await newSupplier
       .then((doc) => {
         //console.log ('added product', doc)
         this.currentSupplier = supplier;
         this.currentSupplier.id = doc.id
         return this.currentSupplier;
       })
       .catch((err) => {
         console.log ('added supplier err', err)
         return err;
       });
   }
 
   async updateSupplier(supplier:ISupplier) {
      return await this.fireStore
       .collection("supplier")
       .doc(supplier.id)
       .set(supplier, { merge: true })
       .then((updatedsupplier) => {
         this.currentSupplier = supplier;
         return this.currentSupplier;
       })
       .catch((err)=>{
         console.log('update supplier error:', err)
         return err;
       })
   }


  async  getSupplier(userId) {
    
    
    let data =  await this.fireStore.collection('supplier', (ref)=> ref.where ('user_id', '==',userId))
    .valueChanges({idField: 'id'}).pipe(take(1)).toPromise();
    console.log ('get supplier ', data[0])
    this.currentSupplier = data[0];
    localStorage.setItem('supplier', JSON.stringify(this.currentSupplier));
    return <ISupplier>data[0];
}
}
