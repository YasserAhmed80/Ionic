import { Injectable } from '@angular/core';
import { UserTypeRef } from 'src/app/model/user';
import { IOrderDetail, IOrderItemDetail } from 'src/app/model/order';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, flatMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orders:IOrderDetail[];

  constructor(public fireStore: AngularFirestore,
    ) { }

  getOrders$(sourceType:UserTypeRef, sourceId:string):Observable<IOrderDetail>{
    // sourceType: 1=supplier, 2=customer, 3=agent

    let results =  this.fireStore.collection<IOrderDetail>("order", ref=>{
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      if (sourceType === UserTypeRef.Supplier) {query = query.where('sup_id', '==', sourceId)};
      if (sourceType === UserTypeRef.Customer) {query = query.where('cus_id', '==', sourceId)};

      query = query.orderBy('cdate','desc') ;
      return query;
    });

    return results.valueChanges({idField:'id'}).pipe(
      flatMap(orders=>orders),
      // tap(x=> console.log(x)),
      map ((order)=>{
        order.sup_name='yasser - sup';
        order.cus_name='yasser-cus';
        return order;
      })
    )
  }

  getOrderItems$(ord_id:string):Observable<IOrderItemDetail>{
    let results =  this.fireStore.collection<IOrderItemDetail>("order/"+ord_id + '/items');
    return results.valueChanges().pipe(
      flatMap(items=>items),
      //tap(x=> console.log(x)),
      map ((item)=>{
        item.pro_name='yasser - sup  dcfsdsdsdsdsds';
        return item;
      })
    )
  }
}
