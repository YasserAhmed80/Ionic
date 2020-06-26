import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { take } from 'rxjs/operators'


import { main_cat, parent_cat,sub_cat, IParent_cat, IMain_cat, ISub_cat,IBusiness_type, 
        business_type, IGovernate, ICity, governates,cities,Colors, Sizes, IColor, ISize } from '../../data/master-data';
import { AuthService } from 'src/app/auth/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  productParentCat:IParent_cat[]=[];
  productMainCat:IMain_cat[]=[];
  productSubCat:ISub_cat[]=[];
  businessType:IBusiness_type[]=[];
  governates: IGovernate[]=[];
  cities: ICity[]=[];
  colors:IColor[]=[];
  sizes:ISize[]=[];

  constructor(private fireStore:AngularFirestore,
              private authUser: AuthService
             ) { 
    
    
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
    await this.setData('ref_governates',governates);
    await this.setData('ref_cities',cities);
    await console.log('All master data added successfully');
  }

  // get data of look up tabe
  private async  getData(collectionName) {
      let data =await   this.fireStore.collection(collectionName).valueChanges({idField:'key'}).pipe(take(1)).toPromise();
      // console.log('get data of collection >>', collectionName)
      
      return data;
  }

  async getMasterData(){

    // get first from local strotage
    this.productParentCat = this.getFromLocalStorage('productParentCat');
    this.productMainCat = this.getFromLocalStorage('productMainCat');
    this.productSubCat = this.getFromLocalStorage('productSubCat');
    this.businessType = this.getFromLocalStorage('businessType');
    this.governates = this.getFromLocalStorage('governates');
    this.cities = this.getFromLocalStorage('cities');
    this.colors = this.getColors();
    this.sizes = this.getSizes();

    if (this.productParentCat.length===0) {
      console.log('master data reload!')
      this.productParentCat =  await <any>this.getData('ref_prod_parent_cat');
      this.productParentCat.sort((a,b)=> a.seq-b.seq)
      this.saveToLocalStorage('productParentCat', this.productParentCat);
    }

    if (this.productMainCat.length==0) {
      this.productMainCat =  await <any>this.getData('ref_prod_main_cat');
      this.productMainCat.sort((a,b)=> a.seq-b.seq)
      this.saveToLocalStorage('productMainCat', this.productMainCat);
    }

    if (this.productSubCat.length==0) {
      this.productSubCat =  await <any>this.getData('ref_prod_sub_cat');
      this.productSubCat.sort((a,b)=> a.seq-b.seq)
      this.saveToLocalStorage('productSubCat', this.productSubCat);
    }

    if (this.businessType.length==0) {
      this.businessType =  await <any>this.getData('ref_business_type');
      this.businessType.sort((a,b)=> a.seq-b.seq)
      this.saveToLocalStorage('businessType', this.businessType);
    }

    if (this.governates.length==0) {
      this.governates =  await <any>this.getData('ref_governates');
      this.governates.sort((a,b)=> a.seq-b.seq)
      this.saveToLocalStorage('governates', this.governates);
    }

    if (this.cities.length==0) {
      this.cities =  await <any>this.getData('ref_cities');
      this.cities.sort((a,b)=> a.seq-b.seq)
      this.saveToLocalStorage('cities', this.cities);
    }
  }

  selectParentCat(){
    // if business type not defined set it to 1 [clothes]
    var businessSections;

    if (this.authUser.user){
      businessSections = this.authUser.user.bus_sec
    }else{
      businessSections = [1] 
    }

    console.log (businessSections)

    return  businessSections.map(key =>{
        return {key:key.toString(), name: this.getCatName(key, 'parent')}
    });
  }

  selectMainCat(key:number){
    return this.productMainCat.filter(c=>c.p_cde == key);
  }
  selectSubCat(key:number){
    return this.productSubCat.filter(c=> c.m_cde == key)
  }

  selectCity(key:number){
    return this.cities.filter(c=> c.gov_cde == key)
  }

  saveToLocalStorage(key, value){
    localStorage.setItem(key,JSON.stringify(value))
  }

  getFromLocalStorage(key){
    let x=localStorage.getItem(key);
    if (x!=='undefined' && x!==null){
      return JSON.parse(x);
    }else{
      return [];
    }
  }

  getCatName(key:number, catType:string){
    switch(catType) { 
      case 'parent': { 
        let item =this.productParentCat.find(item => item.key == key)
         return item.name;
      } 
      case 'main': { 
        let item =this.productMainCat.find(item => item.key == key)
         return item.name;
      } 

      case 'sub': { 
        let item =this.productSubCat.find(item => item.key == key)
         return item.name;
      } 
     
   } 

  }

  getColors (){
    return Colors.sort ((a,b)=> a.seq-b.seq);
  }

  getSizes (){
    return Sizes.sort ((a,b)=> a.seq-b.seq);
  }


}

