import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';

import { MessagesService } from 'src/app/shared/services/messages.service';
import { PhotoService, IImage } from 'src/app/shared/services/photo.service';


import { IProduct, ProductSatusRef } from 'src/app/model/product';
import { FormGroup, FormControl,Validators ,FormBuilder, Form } from '@angular/forms';
import { ProductService } from '../services/product.service';


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
  currentProduct:IProduct;

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


  productForm =  this.formBuilder.group({
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



  constructor(private authUser: AuthService,
              private masterDataService:MasterDataService,
              private photoService:PhotoService,
              private productService: ProductService,
              private messagesService:MessagesService,
              private formBuilder: FormBuilder)
  { 
    
   

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

  /*-----------------------------------------------------------------------------*/
  //  Get parent categories based on user business type and save to array
  /*-----------------------------------------------------------------------------*/
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


  }
  /*-----------------------------------------------------------------------------*/
  //  Get main categories based on parent category
  /*-----------------------------------------------------------------------------*/
  getMainCat(p_cde:number){
    this.selectedMainCat=undefined
    this.mainCat = this.masterDataService.selectMainCat(p_cde);
    
  }
  /*-----------------------------------------------------------------------------*/
  //  Get sub categories based on main category
  /*-----------------------------------------------------------------------------*/
  getSubCat(m_cde:number){
    this.selectedSubCat=undefined;
    this.subCat = this.masterDataService.selectSubCat(m_cde);
  }

  /*-----------------------------------------------------------------------------*/
  //  Get all avalilabe colors and mark it as seleted or not based on product colors
  /*-----------------------------------------------------------------------------*/ 
  setColors (){
    this.colors = this.masterDataService.getColors().map(color=>{
      return {...color, selected: this.checkSelectedColor(color.key)}
    })

  }
  /*-----------------------------------------------------------------------------*/
  //  Get all avalilabe sizes and mark it as seleted or not based on product sizes
  /*-----------------------------------------------------------------------------*/
  setSizes (){
    this.sizes = this.masterDataService.getSizes().map(size=>{
      return {...size, selected: this.checkSelectedSize(size.key)}
    })

  }
  /*-----------------------------------------------------------------------------*/
  //  Check if the color selected or not
  /*-----------------------------------------------------------------------------*/
  checkSelectedColor (color_key){
    let index = this.selectedColors.indexOf(color_key);
    return index>-1? true : false;
  }
  /*-----------------------------------------------------------------------------*/
  //  Check if the size selected or not
  /*-----------------------------------------------------------------------------*/
  checkSelectedSize (size_key){
    let index = this.selectedSizes.indexOf(size_key);
    return index>-1? true : false;
  }

  /*-----------------------------------------------------------------------------*/
  // Toggale selected color
  /*-----------------------------------------------------------------------------*/
  setSelectedColor(color){
    let index = this.colors.indexOf(color);
    if (index>-1){
      this.colors[index].selected =! this.colors[index].selected
    }
  }

  /*-----------------------------------------------------------------------------*/
  //  Toggale selected size
  /*-----------------------------------------------------------------------------*/
  setSelectedSize(size){
    let index = this.sizes.indexOf(size);
    if (index>-1){
      this.sizes[index].selected =! this.sizes[index].selected
    }``
  }

  /*-----------------------------------------------------------------------------*/
  //  Get all selected colors from color array
  /*-----------------------------------------------------------------------------*/
  getAllSelectedColors(){
    this.selectedColors = this.colors.filter((color)=> color.selected ===true).map((color)=> {return color.key});
    return this.selectedColors;
  }
  /*-----------------------------------------------------------------------------*/
  //  Get all selected sizes from size array
  /*-----------------------------------------------------------------------------*/
  getAllSelectedSizes(){
    this.selectedSizes = this.sizes.filter((size)=> size.selected ===true).map((size)=> {return size.key});
    return  this.selectedSizes;
  }


  /*-----------------------------------------------------------------------------*/
  //  Get new photo using camera and save it as base64 for display and blob for saving
  /*-----------------------------------------------------------------------------*/
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

  /*-----------------------------------------------------------------------------*/
  //  Set current image based on thumbnile images selections
  /*-----------------------------------------------------------------------------*/
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

  /*-----------------------------------------------------------------------------*/
  //  Enable/disable camera based on max number of allowed product photo
  /*-----------------------------------------------------------------------------*/
  setCameraAccess(){
    let notDeleted = this.images.filter(img=> img.deleted === false);

    this.cameraDisabled = notDeleted.length >= this.MAX_PHOTOS? true : false;
  }

  /*-----------------------------------------------------------------------------*/
  //  Enable/disable delete photo button based on images array
  /*-----------------------------------------------------------------------------*/
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
  /*-----------------------------------------------------------------------------*/
  //  Set images src from returned firestorage urls
  /*-----------------------------------------------------------------------------*/
  setImageURL(key:number, url:string){
      
      this.images.forEach((img)=>{
        if (img.key == key) {
          img.src = url; 
          img.blob=null;
        }
      })
    }

  /*-----------------------------------------------------------------------------*/
  //  Deleted product images from fire storage
  /*-----------------------------------------------------------------------------*/
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

  /*-----------------------------------------------------------------------------*/
  //  Save new files to firestorage
  /*-----------------------------------------------------------------------------*/
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
  /*-----------------------------------------------------------------------------*/
  //  get not deleted images from images array
  /*-----------------------------------------------------------------------------*/
  getImages(){
    return this.images.filter(img=> img.deleted === false).sort((a,b)=> a.key-b.key)
  }


  /*-----------------------------------------------------------------------------*/
  //  Get product images URL from storage
  /*-----------------------------------------------------------------------------*/
  getProductImagesFromStorage(prod:IProduct){
    this.images = [];

    return prod.imgs.map((key)=>{
      this.photoService.downloadImage('products',prod.id,key.toString())
      .then((url)=>{
        this.images.push({key:key, src:url})
      })
    })


  }
  /*-----------------------------------------------------------------------------*/
  //  Clear product form for new entery
  /*-----------------------------------------------------------------------------*/
  productFormClear(){
    this.productForm.reset();
    this.productForm.patchValue({
      desc : '',
      code : '',
      parent_cat : '',
      main_cat : '',
      sub_cat : '',
      price : 0,
      discountPrice : 0,
      minAmount : 1,
      maxAmount : 999,
    });

    this.setColors();
    this.setSizes();
    this.images=[];

  }
  /*-----------------------------------------------------------------------------*/
  //  Validate product data
  /*-----------------------------------------------------------------------------*/
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
  /*-----------------------------------------------------------------------------*/
  //  Save product data to database
  /*-----------------------------------------------------------------------------*/
  async saveProductData(){

    //console.log(this.productForm.value);
    try {
      let messages = this.validateProductData();

      if (messages.length === 0){
        this.currentProduct = {
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
        let savedProd = await  this.productService.addProduct(this.currentProduct);

        // save product photos
        this.currentProduct.id = savedProd.id;
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
  /*-----------------------------------------------------------------------------*/
  //  Papulate product form with product data
  /*-----------------------------------------------------------------------------*/
  productFormShow(p:IProduct){
    this.productForm.value.name = p.n;
    this.productForm.value.desc = p.d;
    this.productForm.value.code = p.cde;
    this.productForm.value.parent_cat = p.pc;
    this.productForm.value.main_cat = p.mc;
    this.productForm.value.sub_cat = p.sc;
    this.productForm.value.price = p.p;
    this.productForm.value.discountPrice = p.dp;
    this.productForm.value.minAmount = p.min;
    this.productForm.value.maxAmount = p.max;

    this.selectedColors=p.ca;
    this.selectedSizes=p.sa;
    
    // get images url from storage
    this.getProductImagesFromStorage(p);

  }
}
