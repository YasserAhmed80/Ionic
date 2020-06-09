import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';

import { MessagesService } from 'src/app/shared/services/messages.service';
import { PhotoService, IImage } from 'src/app/shared/services/photo.service';

import { Plugins } from '@capacitor/core';
import { IProduct, ProductSatusRef } from 'src/app/model/product';
import { FormGroup, FormControl,Validators ,FormBuilder } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { promise } from 'protractor';
import { promises } from 'dns';

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
  noImage:IImage = {src:"assets/images/camira-placeholder.png"}

  // selected category type
  selectedParentCat:number;
  selectedMainCat:number;
  selectedSubCat:number;
  selectedColors = [];
  selectedSizes = []; 

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
              private productService: ProductService,
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
      price: [0, [Validators.required, Validators.min(1), Validators.max(1000000)]],
      discountPrice: [0, [Validators.required, Validators.min(0), Validators.max(1000000)]],
      minAmount: [1, [Validators.required, Validators.min(1), Validators.max(1000)]],
      maxAmount: [999, [Validators.required, Validators.min(1), Validators.max(10000)]],
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
    return this.selectedColors;
  }

  getAllSelectedSizes(){
    this.selectedSizes = this.sizes.filter((size)=> size.selected ===true).map((size)=> {return size.key});
    return  this.selectedSizes;
  }


  

  // Access Photos 
  getNewPhoto(){
    var currentImage: IImage;

    this.photoService.addNewPhoto().then((photo)=>{
        
      currentImage =this.photoService.currentPhoto;
      currentImage.selected = true;
      currentImage.deleted=false;
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
    let notDeleted = this.images.filter(img=> img.deleted === false);

    this.cameraDisabled = notDeleted.length >= this.MAX_PHOTOS? true : false;
  }

  setPhotoDeleteAccess(){
    let notDeleted = this.images.filter(img=> img.deleted === false);

    this.photoDeleteDisable = notDeleted.length===0?true: false;
    this.cameraDisabled=false;
  }

  /*-----------------------------------------------------------------------------*/
  //  delete image from a list on screen.
  /*-----------------------------------------------------------------------------*/
  deleteImage(){

    console.log('image', this.currentImage)

    let index = this.images.map(m=>{return m.key}).indexOf(this.currentImage.key);
    this.images[index].deleted = true;

    let notDeleted = this.images.filter(img=> img.deleted === false);


    if (notDeleted.length>0){
      // set current position of images
      if (index > notDeleted.length-1){ // this means the last item deleted
        index = notDeleted.length-1
      }else{
        index; // set the current index same as index of deleted item
      }
      this.setCurrentImage(notDeleted[index])
    }
    else {
      this.currentImage= this.noImage;
    }  
    
    this.setPhotoDeleteAccess();
  }

  /*-----------------------------------------------------------------------------*/
  //  upload product images to fire storage
  /*-----------------------------------------------------------------------------*/
  async uploadProductImages(prodID:string){
    let promises=[];

    let newImages = this.images.filter(img=>img.deleted===false && img.blob)

    console.log('new images', newImages)

    if (newImages.length >0 ){
      for (let image of newImages){
        const img =  this.photoService.uploadImage('products', prodID ,image.key.toString(), image.blob);
        promises.push(img);
      }
  
      // wait for all images to be uploaded in pararell
      let images_url = await Promise.all(promises);

      images_url.forEach((url)=>{
        // set images url instead of blob data
        var key :number;
        key = url.key;
        this. setImageURL (key, url.url);
        console.log(url)
      })
  
      return 'success';
    }
  } 

    // Set images src from returned firestorage urls
    setImageURL(key:number, url:string){
      
      this.images.forEach((img)=>{
        if (img.key == key) {
          img.src = url; 
          img.blob=null;
        }
      })
    }

  // deleted unneed product images from fire storage
  async deleteProductImages(){
    let promises=[];

    let deletedImages = this.images.filter(img=>   !img.blob && img.deleted===true)

    console.log('deleted images', deletedImages)

    if (deletedImages.length >0 ){
      for (let image of deletedImages){
        const img =  this.photoService.DeleteImage(image.src);
        promises.push(img);
      }
  
      // wait for all images to be uploaded in pararell
      let images_url = await Promise.all(promises);
  
      return 'success';
    }
  } 

  // Save new files tp firestorage
  async savedProductImages (prodID:string){
    await this.uploadProductImages(prodID); 
    await this.deleteProductImages();

    // remove deleted images from images array.
    this.images = this.images.filter(img=> img.deleted===false);

    console.log('imgaes after save', this.images);
    if (this.images.length>0) {
      this.setCurrentImage (this.images[0]);
      console.log('selected image', this.images[0]);
    }  
    
  }



  getImages(){
    return this.images.filter(img=> img.deleted === false).sort((a,b)=> a.key-b.key)
  }


  // Access Produc form -------------------------------------------
  getProductImagesFromStorage(prod:IProduct){
    // db_images include images key saved in DB
    this.images = [];

    return prod.imgs.map((key)=>{
      this.photoService.downloadImage('products',prod.uid,key.toString())
      .then((url)=>{
        this.images.push({key:key, src:url})
      })
    })


  }

  productFormClear(){
    this.productForm.name = '';
    this.productForm.desc = '';
    this.productForm.code = '';
    this.productForm.parent_cat = '';
    this.productForm.main_cat = '';
    this.productForm.sub_cat = '';
    this.productForm.price = 0;
    this.productForm.discountPrice = 0;
    this.productForm.minAmount = 1;
    this.productForm.maxAmount = 999;

    this.selectedColors=[];
    this.selectedSizes=[];
    this.images=[];

  }

  validateProductData(){
    let messages =[];

    for (var i in this.productForm.controls) {
      this.productForm.controls[i].markAsTouched();
    }

    this.getAllSelectedColors();
    //console.log('colors', this.selectedColors)
    this.getAllSelectedSizes();
    //console.log('sizes', this.selectedSizes)


    if (!this.productForm.valid){
      messages.push('من فضلك ادخل بيانات الصنف كاملة')
    }

    if (this.selectedColors.length===0){
      messages.push('يجب ادخال علي الاقل لون!')
    }

    if (this.selectedSizes.length===0){
      messages.push('يجب ادخال علي الاقل مقاس')
    }

    if (this.images.length===0){
      messages.push('يجب ادخال علي الاقل صورة')
    }

    return messages;
  }

  async saveProductData(){

    //console.log(this.productForm.value);
    try {
      let messages = this.validateProductData();

      if (messages.length === 0){
        this.product = {
          sid:this.authUser.user_id, // supplier ID
          n: this.productForm.value.name,
          d: this.productForm.value.desc, //description
          p:this.productForm.value.price, //price
          dp:this.productForm.value.discountPrice, // discount price
          pc:this.productForm.value.parent_cat,// parent category
          mc: this.productForm.value.main_cat, // main category
          sc: this.productForm.value.sub_cat, //sub category
          s: ProductSatusRef.New,//status (new, active,inactive)
          sa:this.selectedColors, // size attributes
          ca:this.selectedSizes, //color attribute
          imgs: this.images.map(m=> {return m.key}), // product images
          min:this.productForm.value.minAmount, // min quantity
          max:this.productForm.value.maxAmount, //max quantity 
        };
    
        //console.log(this.product);
        let loader = this.messagesService.showLoading('جاري حفظ بيانات الصنف')

        // save the product 1st
        let savedProd = await  this.productService.addProduct(this.product);

        // save product photos
        await this.savedProductImages (savedProd.id);
        this.messagesService.showToast('حفظ الصنف', 'تم حفظ الصنف بنجاح', 'success')
        loader.then((loading)=> loading.dismiss());

      } else{
        let msg='';

        messages.forEach((m)=> msg = msg + '</br>' + m)
        this.messagesService.showToast('لم نتمكن من حفظ الصنف', msg, 'danger')
      }  
    } catch (error) {
      
    }

    
   
  }

  productFormShow(p:IProduct){
    this.productForm.name = p.n;
    this.productForm.desc = p.d;
    this.productForm.code = p.cde;
    this.productForm.parent_cat = p.pc;
    this.productForm.main_cat = p.mc;
    this.productForm.sub_cat = p.sc;
    this.productForm.price = p.p;
    this.productForm.discountPrice = p.dp;
    this.productForm.minAmount = p.min;
    this.productForm.maxAmount = p.max;

    this.selectedColors=p.ca;
    this.selectedSizes=p.sa;
    
    // get images url from storage
    this.getProductImagesFromStorage(p);

  }
}
