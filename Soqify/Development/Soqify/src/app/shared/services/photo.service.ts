import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory,  CameraPhoto, CameraSource } from '@capacitor/core';
import { Platform } from '@ionic/angular';

import { AngularFireStorage } from '@angular/fire/storage';

import {finalize, map, switchMap, take} from 'rxjs/operators'




const {Camera, Filesystem, Storage} = Plugins;

export interface IImage {
  key?:number,
  src?:string,
  blob?:any,
  selected?:boolean,
  deleted?:boolean
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  photos: IImage[]=[];
  currentPhoto: IImage;

  private PHOTO_STORAGE: string = "photos";

  constructor(private platform:Platform,
              private fireStorage: AngularFireStorage
              ) 
  { }

  public async addNewPhoto (){
    const newPhoto = await Camera.getPhoto({
      resultType:CameraResultType.Uri,
      //source:'PHOTOS',
      quality:90,
      //Extra
      allowEditing: true,
      height:300,
      width:300,
    })
    

    const p = await this.getBase64andBLOB (newPhoto);
    //this.photos.push({...p});

    this.currentPhoto = {
      src: p.base64,
      blob:p.blob,
    };

  }

   private async getBase64andBLOB(cameraPhoto: CameraPhoto) {
    // "hybrid" will detect Cordova or Capacitor
    let data = {base64: null, blob: null};

    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();
    
    data.blob = blob; 

    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });
  
      data.base64 =  file.data;
    }
    else {
      data.base64 =  await this.convertBlobToBase64(blob) as string;
    }

    return data;
  }

  
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  

  // Save photo to firebase DB
  async  uploadImage (pathType: string ,path: string, fileName: string, data: any){
    
    // pathType: product folder; path: product code, filename: image name
    let storagePath = `${pathType}/${path}/${fileName}`;
   
    var metadata = {
      contentType: 'image/jpeg',
    };

    const storageRef = this.fireStorage.ref(storagePath);
    const task = storageRef.put(data,metadata);

    let snapshot =  await task.snapshotChanges().toPromise();

    let url = await  storageRef.getDownloadURL().pipe(take(1)).toPromise();

    return {key: fileName, url:url};
  
  }

  downloadImage(pathType: string ,path: string, fileName: string){

    // pathType: product folder; path: product code, filename: image name
    let storagePath = `${pathType}/${path}/${fileName}.jpeg`;

    const storageRef = this.fireStorage.ref(storagePath);
    return storageRef.getDownloadURL().pipe(take(1)).toPromise();
 }

 async DeleteImage(url: string){

  await this.fireStorage.storage.refFromURL(url).delete()

}
}

