import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {take } from 'rxjs/operators'

import { main_cat, parent_cat,sub_cat, IParent_cat, IMain_cat, ISub_cat,IBusiness_type, business_type } from '../../data/master-data';


@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  productParentCat:IParent_cat[]=[];
  productMainCat:IMain_cat[]=[];
  productSubCat:ISub_cat[]=[];
  businessType:IBusiness_type[]=[];

  constructor(private fireStore:AngularFirestore ) { 
    
  }


  // get data of look up tabe
  private async  setData(collectionName, dataArray:Array<any>){
    for (let c of dataArray){
      let key = c.key;
      delete c.key; // avoid adding key to document
      await this.fireStore.doc(`${collectionName}/${key}`).set(c)
    }
    console.log('master data added for collection >>', collectionName);
  }
  async addMasterData(){
    await this.setData('ref_prod_parent_cat',parent_cat);
    await this.setData('ref_prod_main_cat',main_cat);
    await this.setData('ref_prod_sub_cat',sub_cat);
    await this.setData('ref_business_type',business_type);
    await console.log('All master data added successfully');
  }

  // get data of look up tabe
  private async  getData(collectionName) {
      let data =await   this.fireStore.collection(collectionName).valueChanges({idField:'key'}).pipe(take(1)).toPromise();
      // console.log('get data of collection >>', collectionName)
      return data;
  }

  async getMasterData(){

    if (this.productParentCat.length===0) {
      console.log('master data reload!')
      this.productParentCat =  await <any>this.getData('ref_prod_parent_cat');
      this.productParentCat.sort((a,b)=> a.seq-b.seq)
      
    }

    if (this.productMainCat.length==0) {

      this.productMainCat =  await <any>this.getData('ref_prod_main_cat');
      this.productMainCat.sort((a,b)=> a.seq-b.seq)
    }

    if (this.productSubCat.length==0) {
      this.productSubCat =  await <any>this.getData('ref_prod_sub_cat');
      this.productSubCat.sort((a,b)=> a.seq-b.seq)
    }

    if (this.businessType.length==0) {
      this.businessType =  await <any>this.getData('ref_business_type');
      this.businessType.sort((a,b)=> a.seq-b.seq)
    }
  }


  selectMainCat(key:number){
    return this.productMainCat.filter(c=>c.p_cde == key);
  }
  selectSubCat(key:number){
    return this.productSubCat.filter(c=> c.m_cde == key)
  }


}

