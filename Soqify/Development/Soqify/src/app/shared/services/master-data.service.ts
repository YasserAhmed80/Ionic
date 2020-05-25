import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { main_cat, parent_cat,sub_cat, IParent_cat, IMain_cat, ISub_cat } from '../../data/product_master'

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  parentCategories:IParent_cat[];
  mainCategories:IMain_cat[];
  subCategories:ISub_cat[];

  constructor(private fireStore:AngularFirestore ) { }

  private addParentCat(){
    for (let c of parent_cat){
      let key = c.p_key;
      delete c.p_key; // avoid adding key to document
      this.fireStore.doc(`p_cat/${key}`).set(c)
    }
  
  }

  private addMainCat(){
    for (let c of main_cat){
      let key = c.m_key;
      delete c.m_key; // avoid adding key to document
      this.fireStore.doc(`m_cat/${key}`).set(c)
    }
  }

  private addSubCat(){
    for (let c of sub_cat){
      let key = c.s_key;
      delete c.s_key; // avoid adding key to document
      this.fireStore.doc(`s_cat/${key}`).set(c)
    }
  }

  addProductCats(){
    this.addParentCat();
    this.addMainCat();
    this.addSubCat();
  }

  // get product categories
  private getParentCat(){
    if ( this.parentCategories.length=0) {
      this.fireStore.collection('p_cat').valueChanges({idField:'p_key'})
      .subscribe((data)=>{
        this.parentCategories=<any>data;
      })
    }
  }

  private getMainCat(){
    if (this.mainCategories.length=0){
      this.fireStore.collection('m_cat').valueChanges({idField:'m_key'})
      .subscribe((data)=>{
        this.mainCategories=<any>data;
      })
    }
  }

  private getSubCat(){
    if (this.subCategories.length=0){
      this.fireStore.collection('s_cat').valueChanges({idField:'s_key'})
      .subscribe((data)=>{
        this.subCategories=<any>data;
      })
    }
  }

  getProductCat(){
    this.getParentCat();
    this.getMainCat();
    this.getSubCat();
  }

  selectMainCat(p_key:number){
    return this.mainCategories.filter(c=>c.p_cde == p_key);
  }
  selectSubCat(m_key:number){
    return this.subCategories.filter(c=> c.m_cde == m_key)
  }


}

