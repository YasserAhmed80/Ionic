import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MasterDataService } from 'src/app/shared/services/master-data.service';

import { MessagesService } from 'src/app/shared/services/messages.service';
import { PhotoService } from 'src/app/shared/services/photo.service';



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
  images = [];
  MAX_PHOTOS = 6;

  currentImage = "assets/images/camira-placeholder.png"

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


  constructor(private authUser: AuthService,
              private masterDataService:MasterDataService,
              private photoService:PhotoService,
              private messagesService:MessagesService)
  { }

  ngOnInit() {
    let loader = this.messagesService.showLoading('جاري تحميل البيانات')
    this.masterDataService.getMasterData().then(()=>{
      this.getParentCat();
      this.setColors();
      this.setSizes();
      this.dataLoaded = true;

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
    var currentImage;

    this.photoService.addNewPhoto().then(()=>{
      this.images = this.photoService.photos.map((photo)=>{
        let img= photo.base64? photo.base64: photo.webviewPath;
        currentImage={key:1,  img: img, selected:true};
        return currentImage;
      });

      this.setCurrentImage (currentImage);
      this.setCameraAccess();
      this.photoDeleteDisable=false;
    })

   
  }

  setCurrentImage(selectedImage){
    this.currentImage = selectedImage.img;
    this.images.map((image)=>{
      if(image.img === selectedImage.img ){
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
    console.log('images', this.images)

    let index = this.images.map(m=>{return m.img}).indexOf(this.currentImage);
    this.images.splice(index,1);

    console.log('index', index)

    if (this.images.length>-1){
      // set current position of images
      if (index > this.images.length-1){ // this means the last item deleted
        index = this.images.length-1
      }else{
        index++;
      }
      this.setCurrentImage(this.images[index])
    }
    this.setPhotoDeleteAccess();
  }

  



}
