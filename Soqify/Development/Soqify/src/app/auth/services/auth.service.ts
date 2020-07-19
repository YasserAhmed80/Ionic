import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { UtilityService } from '../../shared/services/utility.service';

import { IUser, ISupplier, UserTypeRef } from '../../model/user'
import { take } from 'rxjs/operators'


// Facebool blugin for auth for Android, iOS, Web
import { Plugins } from '@capacitor/core';
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';
import { SupplierCustomerService } from 'src/app/shared/services/supplier-customer.service';
import { MyStorageService } from 'src/app/shared/services/mystorage.service';


const { FacebookLogin } = Plugins;
const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
// End Facebook auth

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  public user: IUser=null;

  constructor(public fireAuth:AngularFireAuth, 
             public fireStore: AngularFirestore,
             private utilityService:UtilityService,
             private supplierService:SupplierCustomerService,
             private storage:MyStorageService,
             ) 
  { 
    this.storage.getItem('user').then((user)=>{
        this.user = user;
    });
    
  }

  // >> Sign in using mail and password <<-------------------------------------

  //  Send verification mail to confirm new registeration 
  sendVerificationMail() {
    return this.fireAuth.auth.currentUser.sendEmailVerification()
    .then(()=>{
      return 'success'
    })
    .catch ((err)=>{
      return err.code;
    })
  }


  // Register user into database by mail and password
  async registerUserByMail(user:IUser, password) {
      try {
        let auth = await this.fireAuth.auth.createUserWithEmailAndPassword(user.email, password);

        user.auth_id =  auth.user.uid;
        user.createdAt =  this.utilityService.serverTimeStamp;
        user.provider = 'email';
        user.active_ind =1;
  
         
        let newUser = await this.addUserData(user);
        this.sendVerificationMail();
        return {user:newUser, err:null};
      } catch (err) {
        return {user:null, err:err.code};
      }
  }

  // User login  by mail  
  async logInByMail(email, password){
    try {
      let auth = await this.fireAuth.auth.signInWithEmailAndPassword(email, password);

      // TODO: check for mail verifications
      // if (!auth.user.emailVerified) {
      //   return {user:null,err:'verify'};
      //  }else{
     
      // get identiy data
      let user =  await this.getUserData(auth.user.uid)
      return {user:user,err:null};
    
    } catch (err) {
      return {user:null,err:err.code};
    }
    
  }

  // User logout
  SignOut(){
    if (this.user.provider=="FB"){
      this.facebook_SignOut().then(()=>{
        // redirect to required page
      })
    }else{
      return this.fireAuth.auth.signOut().then(() => {
        // redirect to required page
      })
    }
    this.storage.removeItem('user');

  }

  // Returns true when user is looged in
  async  isLoggedIn() {
     let user = await   this.storage.getItem('user');

     return (user !== null && user.emailVerified !== false) ? true : false;
  }

  get user_id (){
    return this.user.id;
  }

  // Store user in DB
  async addUserData(userData:IUser) {

      let newUSer = this.fireStore.collection('user').add(userData);
      
      let userAdded =  await  newUSer;
      userData.id = userAdded.id;

      // // for any new user we add new customer row in DB for order processing
      // let newCustomer=  await this.supplierService.addNewCustomer (userAdded.id);
      // console.log('new customer added')

      // if (userData.type = UserTypeRef.Supplier){      
      //   let s=  await this.supplierService.addNewSupplier (userAdded.id);
      //   console.log('new supplier added')
      // }else if ( (userData.type = UserTypeRef.Agent)){
      //   // agent data
      // }

      return userData;

  }

  // Store user in localStorage
  async updateUserData(userData:IUser) {
    await this.fireStore
      .collection("user")
      .doc(userData.id)
      .set(userData, { merge: true })
      .then((user) => {
        localStorage.setItem('user', JSON.stringify(userData));
        return user;
      })
      .catch((err)=>{
        console.log('update user error:', err)
        return err;
      })
  }

  // get user data from database bu auth_id
  async getUserData(auth_id:string){
    console.log('get user data:', auth_id)
    let users =  await this.fireStore.collection('user', (ref)=> ref.where ('auth_id', '==',auth_id))
                 .valueChanges({idField: 'id'}).pipe(take(1)).toPromise()
                 
    return users[0];
  }

  // Recover password
  resetPassword(passwordResetEmail) {
    return this.fireAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email has been sent, please check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  // >> End section of sign in using mail and password ------------------------

  // >> Sign in using Facebook <<----------------------------------------------
  async facebook_auth(){
    try {
      let facebookResponse: FacebookLoginResponse = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
      let FB_user = await this.getFB_userInfo();
      let user =  await this.firebase_FB_provider(facebookResponse.accessToken.token);

      return user;

    } catch (error) {
      console.log(`Facebook response: user cancelled`, error);
    }
    // return await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })
    //   .then((result: FacebookLoginResponse) => {
    //     console.log(`Facebook response`, result);
    //     return this.getFB_userInfo().then((FB_user) => {
    //       return this.firebase_FB_provider(result.accessToken.token).then(
    //         (user) => {
    //           console.log("facebook auth user:", user);
    //           return user;
    //         }
    //       );
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(`Facebook response: user cancelled`);
    //   });
  }

  async facebook_SignIn(){
    try {
      let FB_user = await this.facebook_auth();
      console.log('FB USer: ', FB_user);
      let userData = await this.getUserData(FB_user.uid);

      if (userData){
        return userData
      }else{
        // add new user
        
        let newUser: IUser ={
          auth_id: FB_user.uid,
          name: FB_user.displayName,
          provider:'FB',
          active_ind:1,
          createdAt: this.utilityService.serverTimeStamp
        };

        let addedUSer = await  this.addUserData(newUser);
        return addedUSer;
      } 
    }  
    catch (error) {
      console.log('facebook_SignIn',error)
    }
    
    // return await this.facebook_auth().then((user)=>{
    //   if (user) {
    //     // get identiy data
    //     return this.getUserData(user.uid)
    //     .then((userData)=>{
    //       if (userData){
    //         this.user = userData;
    //         localStorage.setItem('user', JSON.stringify(this.user));
    //         // this.supplierService.getSupplier(userData.id)
    //         return userData
    //       }else{
    //         console.log('user not added to DB', user);
    //         let newUser: IUser ={
    //           auth_id: user.uid,
    //           name: user.displayName,
    //           active_ind:1,
    //           createdAt: this.utilityService.serverTimeStamp
    //         };

    //         console.log('user to be added to DB', newUser);
    //         return this.addUserData(newUser).then((addedUser)=>{
    //           console.log('user added to DB', addedUser);
    //           localStorage.setItem('user', JSON.stringify(addedUser));
    //           return newUser;
    //         })
    //         .catch((err)=>{
    //           console.log('FB sign in add user err:', err)
    //         })
            
    //       }
    //     })
    //     .catch((err)=>{
    //       return err
    //     })
    //   }else{
    //     console.log ('facebook auth provider user', user);
    //   }
      
    // })
    // .catch((err)=>{
    //   console.log ('facebook auth provider', err);
    // })
  }

  async facebook_SignOut (){
    FacebookLogin.logout( )
      .then(()=>{
        console.log(`Sign out successfully`);
        localStorage.removeItem('user');
        return true;
      })
      .catch((err)=>{
        console.log(`Sign out error`);
        return false;
      })
  }
  async getFB_userInfo(){
    try {
      let accessToken = await FacebookLogin.getCurrentAccessToken(); 
      let  {userId, token} = accessToken.accessToken;

      let FB_user = await  fetch(`https://graph.facebook.com/${userId}?fields=id,name,gender,link,picture&type=large&access_token=${token}`);

      return  FB_user.json();
    } catch (error) {
      console.log(`getFB_userInfo`, error);
    }
    

    //  return this.getCurrentAccessToken()
    //   .then((result)=>{
    //     let  {userId, token} = result.accessToken;
    //       return fetch(`https://graph.facebook.com/${userId}?fields=id,name,gender,link,picture&type=large&access_token=${token}`)
    //       .then((response)=>{
    //           return response.json()
    //           .then((FB_user)=>{
    //             console.log('get inof:', FB_user);
    //             return FB_user;
    //           });
    //       })
    //   })
  }


  async firebase_FB_provider(FB_Token){
    try {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(FB_Token);
      let auth = await  firebase.auth().signInWithCredential(facebookCredential);
      return auth.user;
    } catch (error) {
      console.log ('firebase FB auth error', error)
    }

    // .then ((auth)=>{
    //   console.log('sign in with FB/firebase:', auth.user);
    //   return auth.user;
    // })
    // .catch((err)=>{
    //   console.log ('firebase FB auth error', err)
    // })

  }


}
