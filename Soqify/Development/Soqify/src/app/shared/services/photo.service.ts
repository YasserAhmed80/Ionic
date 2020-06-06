import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory,  CameraPhoto, CameraSource } from '@capacitor/core';
import { Platform } from '@ionic/angular';

import { AngularFireStorage } from '@angular/fire/storage';

import {finalize} from 'rxjs/operators'



const {Camera, Filesystem, Storage} = Plugins;

interface Photo {
  filepath:string,
  webviewPath:string,
  base64?:string,
  blob?:any
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  photos: Photo[]=[];
  currentPhoto: Photo;

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
      filepath:'',
      webviewPath:'',
      base64: p.base64,
      blob:p.blob
    };

    console.log(this.currentPhoto)
  }

  public async addNewPhoto_old (){
    const newPhoto = await Camera.getPhoto({
      resultType:CameraResultType.Uri,
      //source:'PHOTOS',
      quality:90,
      //Extra
      allowEditing: true,
      height:300,
      width:300,
    })
    

    const p = await this.savePicture (newPhoto);
    //this.photos.push({...p});
    this.currentPhoto =  {...p};
    //this.saveToLocalStroge();

  }

  private saveToLocalStroge(){
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: this.platform.is('hybrid')
              ? JSON.stringify(this.photos)
              : JSON.stringify(this.photos.map(p => {
                const photoCopy = { ...p };
                delete photoCopy.base64;
                return photoCopy;
                }))
    })
  }

  public async loadSavedPhotos() {
    // Retrieve cached photo array data
    const photos = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photos.value) || [];

    // Easiest way to detect when running on the web:
    // “when the platform is NOT hybrid, do this”
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: FilesystemDirectory.Data
        });

        // Web platform only: Save the photo into the base64 field
        photo.base64 = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
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
  private async savePicture(cameraPhoto: CameraPhoto) {
     // Convert photo to base64 format, required by Filesystem API to save
     const base64Data = await this.readAsBase64(cameraPhoto);

     // Write the file to the data directory
     const fileName = new Date().getTime() + '.jpeg';
     const savedFile = await Filesystem.writeFile({
       path: fileName,
       data: base64Data,
       directory: FilesystemDirectory.Data
     });
 
     if (this.platform.is('hybrid')) {
       // Display the new image by rewriting the 'file://' path to HTTP
       // Details: https://ionicframework.com/docs/building/webview#file-protocol
       return {
         filepath: savedFile.uri,
         webviewPath: Capacitor.convertFileSrc(savedFile.uri),
       };
     }
     else {
       // Use webPath to display the new image instead of base64 since it's
       // already loaded into memory
       return {
         filepath: fileName,
         webviewPath: cameraPhoto.webPath
       };
     }
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });
  
      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
    }
  }
  
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async deletePicture(photo: Photo, position: number) {
    // Remove this photo from the Photos reference data array

    console.log(photo);
    this.photos.splice(position, 1);
  
    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  
    // delete photo file from filesystem
    const filename = photo.filepath
                        .substr(photo.filepath.lastIndexOf('/') + 1);
  
    await Filesystem.deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data
    });
  }

  // Save phto to firebase DB
  uploadPhoto (path:string, fileName: Blob){
    const file = fileName;
    const filePath = path;
    const fileRef = this.fireStorage.ref(filePath);
    const task = this.fireStorage.upload(filePath, file);

    // observe percentage changes
    //this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    return task.snapshotChanges().pipe(
        finalize(() => {return fileRef.getDownloadURL()} )
     )
  }
}

