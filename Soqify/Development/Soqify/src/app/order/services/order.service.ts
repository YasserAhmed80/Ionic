import { Injectable } from '@angular/core';
import { UserTypeRef } from 'src/app/model/user';
import { IOrderDetail, IOrderItemDetail, IOrderItem, IOrder, IOrderStatusLog } from 'src/app/model/order';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, flatMap, tap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  orders:IOrderDetail[];

  constructor(public fireStore: AngularFirestore,
              private utilityService:UtilityService,
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
        order.cdate = order.cdate.seconds * 1000;
        //order.age = 
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
        item.pro_name='صنف جديد ممتاز';
        return item;
      })
    )
  }

   // ٍSave to firestore database 
   async saveOrderToDB(order:IOrder){ 
    let ord = {...order};
    // remove unneed fields
    delete ord.items;

    ord.cdate = this.utilityService.serverTimeStamp
    let newOrder = this.fireStore.collection('order').add(ord);
    
    let doc =  await newOrder;
    
    
    ord.id = doc.id;

    console.log('doc id',  doc.id);

    // log status items
    let statusDoc = await this.LogStatus(doc.id, 1); // log new statys

    // add items
    let promises = [];

    order.items.forEach((item)=>{
      promises.push(this.addItemToDB(doc.id,item))
    });

    var newItems;

    if (promises.length> 0){
      newItems = await Promise.all(promises)
    }

    console.log('added items', newItems)
   
  }

  async addItemToDB(ord_id: string, item:IOrderItem){
    let i = {...item};
    delete i.pro_name;
    delete i.img;

    console.log('order id', ord_id);

    return await  this.fireStore.collection(`order/`+ord_id+`/items`).add(i)
  }

  async LogStatus(ord_id: string, status_cde: number){
    var status:IOrderStatusLog;
    status = {
      code:status_cde,
      date:this.utilityService.serverTimeStamp
    }
    return await  this.fireStore.collection(`order/`+ord_id+`/log`).add(status)
  }
}
