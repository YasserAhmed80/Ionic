import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';

import { MessagesService } from 'src/app/shared/services/messages.service';
import { PhotoService, IImage } from 'src/app/shared/services/photo.service';

import { Plugins } from '@capacitor/core';
import { IProduct } from 'src/app/model/product';
import { FormGroup, FormControl,Validators ,FormBuilder } from '@angular/forms';

const { Filesystem} = Plugins;



@Component({
  selector: 'app-product-data',
  templateUrl: './product-data.page.html',
  styleUrls: ['./product-data.page.scss'],
})
export class ProductDataPage implements OnInit {
  
  parentCat= [];
  mainCat = [];
  subCat=[];
  colors=[];
  sizes=[];
  images: IImage [] = [];
  MAX_PHOTOS = 6;
  product:IProduct;

  currentImage:IImage = {src:"assets/images/camira-placeholder.png"}

  // selected category type
  selectedParentCat:number;
  selectedMainCat:number;
  selectedSubCat:number;
  selectedColors = [2,3,7];
  selectedSizes = [3,6,20]; 

  dataLoaded:boolean = false;

  cameraDisabled: boolean = false;
  photoDeleteDisable:boolean = false;

  customPopoverOptions: any = {
    header: 'اختار من القائمة',
  };

  productForm:any;



  constructor(private authUser: AuthService,
              private masterDataService:MasterDataService,
              private photoService:PhotoService,
              private messagesService:MessagesService,
              private formBuilder: FormBuilder)
  { 
    
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      desc: ['', [Validators.required, Validators.maxLength(200)]],
      code: ['', [Validators.maxLength(50)]],
      parent_cat: ['', [Validators.required]],
      main_cat: ['', [Validators.required]],
      sub_cat: ['', [Validators.required]],
      price: ['0', [Validators.required, Validators.min(1), Validators.max(1000000)]],
      discountPrice: ['0', [Validators.required, Validators.min(0), Validators.max(1000000)]],
      minAmount: ['1', [Validators.required, Validators.min(1), Validators.max(1000)]],
      maxAmount: ['999', [Validators.required, Validators.min(1), Validators.max(10000)]],
    });

  }

  ngOnInit() {
    let loader = this.messagesService.showLoading('جاري تحميل البيانات')
    this.masterDataService.getMasterData().then(()=>{
      this.getParentCat();
      this.setColors();
      this.setSizes();
      this.dataLoaded = true;

      if (this.images.length> 0) this.setCurrentImage(this.images[0]);
      
      this.setCameraAccess();
      this.setPhotoDeleteAccess();

      loader.then((loading)=> loading.dismiss());
    });
  }

  //get parent category
  getParentCat(){
    let businessType = this.authUser.user.bus_sec;
    console.log('bus type', businessType);

    this.parentCat= businessType.map(key =>{
        return {key:key, name: this.masterDataService.getCatName(key, 'parent')}
    });

    if (this.parentCat.length===1){
      //console.log(this.selectedParentCat)
      if (this.selectedParentCat === undefined){
        this.selectedParentCat = this.parentCat[0].key;
        this.getMainCat(this.selectedParentCat);
      }
    }

    console.log('parent cats', this.parentCat);

  }

  getMainCat(p_cde:number){
    this.selectedMainCat=undefined
    this.mainCat = this.masterDataService.selectMainCat(p_cde);
    
  }

  getSubCat(m_cde:number){
    this.selectedSubCat=undefined;
    this.subCat = this.masterDataService.selectSubCat(m_cde);
  }

  // this function to defined selected sizes in colors array as defined on product level
  setColors (){
    this.colors = this.masterDataService.getColors().map(color=>{
      return {...color, selected: this.checkSelectedColor(color.key)}
    })

  }

  // this function to set selected sizes in size array as defined on product level
  setSizes (){
    this.sizes = this.masterDataService.getSizes().map(size=>{
      return {...size, selected: this.checkSelectedSize(size.key)}
    })

  }

  // check if the color selected or not
  checkSelectedColor (color_key){
    let index = this.selectedColors.indexOf(color_key);
    return index>-1? true : false;
  }

  // check if the size selected or not
  checkSelectedSize (size_key){
    let index = this.selectedSizes.indexOf(size_key);
    return index>-1? true : false;
  }

  // called when user click color
  setSelectedColor(color){
    let index = this.colors.indexOf(color);
    if (index>-1){
      this.colors[index].selected =! this.colors[index].selected
    }
  }

  // called when user click szie
  setSelectedSize(size){
    let index = this.sizes.indexOf(size);
    if (index>-1){
      this.sizes[index].selected =! this.sizes[index].selected
    }``
  }

  getAllSelectedColors(){
    this.selectedColors = this.colors.filter((color)=> color.selected ===true).map((color)=> {return color.key});
    console.log('selected colors', this.selectedColors)
  }

  // Access Photos 
  getNewPhoto(){
    var currentImage: IImage;

    this.photoService.addNewPhoto().then((photo)=>{
        
      currentImage =this.photoService.currentPhoto;
      currentImage.selected = true;
      currentImage.key = this.images.length+1;

      this.images.push(currentImage);
     
      this.setCurrentImage (currentImage);
      this.setCameraAccess();
      this.photoDeleteDisable=false;
    })

   
  }

  setCurrentImage(selectedImage:IImage){
    this.currentImage = selectedImage;
    this.images.map((image)=>{
      if(image.key === selectedImage.key ){
        image.selected=true;
      }else{
        image.selected=false;
      }
    })
  }

  setCameraAccess(){
    this.cameraDisabled = this.images.length >= this.MAX_PHOTOS? true : false;
  }

  setPhotoDeleteAccess(){
    this.photoDeleteDisable = this.images.length===0?true: false;
    this.cameraDisabled=false;
  }

  deleteImage(){

    console.log('image', this.currentImage)
 

    let index = this.images.map(m=>{return m.key}).indexOf(this.currentImage.key);
    this.images.splice(index,1);


    if (this.images.length>0){
      // set current position of images
      if (index > this.images.length-1){ // this means the last item deleted
        index = this.images.length-1
      }else{
        index; // set the current index same as index of deleted item
      }
      this.setCurrentImage(this.images[index])
    }
    this.setPhotoDeleteAccess();
  }

  uploadImages(){

    this.images.forEach((image)=>{
      //console.log(image)
      this.photoService.uploadImage('product', 'product-1' ,image.key.toString(), image.blob)
        .then(url=> {
          console.log(url);
          image.src = url;
        })
    })
  } 

  getImages(){
    return this.images.sort((a,b)=> a.key-b.key)
  }

  setProductData(){
    // this.product = {
    //   sid:this.authUser.user_id, // supplier ID
    //   N: string, // name
    //   D?: string, //description
    //   P:number, //price
    //   dp?:number, // discount price
    //   Pc:number,// parent category
    //   Mc: number, // main category
    //   Sc: number, //sub category
    //   S:ProductSatusRef,//status (new, active,inactive)
    //   sa?:[number], // size attributes
    //   Ca?:[number], //color attribute
    //   Img?:[string], // product images
    //   min:number, // min quantity
    //   Max:number, //max quantity 
    // }
  }

  



}
