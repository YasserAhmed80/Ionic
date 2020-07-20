import { Injectable } from '@angular/core';
import { ISupplier, ISupplierDetail, ICustomer } from 'src/app/model/user';
import { UtilityService } from './utility.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take, switchMap, switchMapTo, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupplierCustomerService {

  currentSupplier:ISupplier;
  currentCustomer:ICustomer;

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

    let customer = localStorage.getItem('customer');
    if ( customer !== 'undefined' && customer ){
      this.currentCustomer = JSON.parse(customer);
      console.log('localstorage customer', this.currentCustomer)
    } else{
      // this.currentSupplier = this.getSupplier(authUser.user_id)
    }

  }

  async saveSupplier(supplier:ISupplier){
    let data = await this.save (supplier,1);
    this.currentSupplier =supplier;
    this.currentSupplier.id=data.id;
    return this.currentSupplier;
  }

  async saveCustomer(customer:ICustomer){
    let data = await this.save (customer,2);
    this.currentCustomer =customer;
    this.currentCustomer.id=data.id;
    return this.currentCustomer;
  }

  async save (data:ISupplier | ICustomer, source: number){
    var savedData;
    if (data.id){
      // update supplier
      savedData = await this.update(data,source)
      console.log('data updated', this.currentSupplier)
    }else{
      //add new product
      savedData = await this.add(data,source)
      console.log('supplier new', this.currentSupplier)
    }

    return savedData;
  }

  async addNewSupplier(user_id: string){

    let supplier: ISupplier={
      user_id: user_id,
      createdAt : this.utilityService.serverTimeStamp,
      ord_cancel:{c:0,s:0},
      ord_del:{c:0,s:0},
      ord_pend:{c:0,s:0},
      ord_tot:{c:0,s:0},
    };
    
    return  await this.saveSupplier (supplier);
        
  }

  async addNewCustomer(user_id: string){

    let customer: ICustomer={
      user_id: user_id,
      createdAt : this.utilityService.serverTimeStamp,
      ord_cancel:{c:0,s:0},
      ord_del:{c:0,s:0},
      ord_pend:{c:0,s:0},
      ord_tot:{c:0,s:0},
    };     
    return  await this.saveCustomer (customer);
        
  }

  async add(data:ISupplier | ICustomer, source: number) {
    // console.log  ('timestamp',  firebase.database.ServerValue.TIMESTAMP)
     data.createdAt = this.utilityService .serverTimeStamp;
     var newData;
     if (source === 1 ){
      //  supplier
       newData = this.fireStore.collection('supplier').add(data);
     }else{
      //  customer
       newData = this.fireStore.collection('customer').add(data);
     }
     
     return await newData
       .then((doc) => {
         return doc;
       })
       .catch((err) => {
         console.log ('added  err', err)
         return err;
       });
   }
 
   async update(data:ISupplier | ICustomer, source: number) {
      var collection:string;

      if (source === 1 ){
        //  supplier
        collection = 'supplier' ;
      }else{
        collection = 'customer' ;
      }

      return await this.fireStore
       .collection(collection)
       .doc(data.id)
       .set(data, { merge: true })
       .then((updated) => {
         return updated;
       })
       .catch((err)=>{
         console.log('update  error:', err)
         return err;
       })
   }




  async  getSupplierByUser(userId) {
    
    let data =  await this.fireStore.collection('supplier', (ref)=> ref.where ('user_id', '==',userId))
    .valueChanges({idField: 'id'}).pipe(take(1)).toPromise();
    console.log ('get supplier ', data[0])
    this.currentSupplier = data[0];
    localStorage.setItem('supplier', JSON.stringify(this.currentSupplier));
    return <ISupplier>data[0];
  }

  getSupplierById$(sup_id:string){
    return  this.fireStore.collection('supplier').doc(sup_id)
    .valueChanges()
    .pipe(
      switchMap (data =>{
        var supplier: ISupplier;
        supplier=data;
        let user_id = supplier.user_id;
        return  this.fireStore.collection('user').doc(user_id).valueChanges()
                .pipe(
                  map(user=>{
                    var supplierDetail: ISupplierDetail;
                    supplierDetail = supplier;
                    supplierDetail.user_info = user;
                    return supplier;
                  })
                )  
      }),  
    );
  }
}
