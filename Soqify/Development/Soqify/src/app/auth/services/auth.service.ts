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
import { MyStorageService } from 'src/app/shared/services/mystorage.service';


const { FacebookLogin } = Plugins;
const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
// End Facebook auth

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  public currentUser: IUser=null;

  constructor(public fireAuth:AngularFireAuth, 
             public fireStore: AngularFirestore,
             private utilityService:UtilityService,
             private myStorgae:MyStorageService,
             ) 
  { 
    
    
  }

  async getCurrentUser(){
    if (this.currentUser=== null){
      this.currentUser = await this.myStorgae.getItem('user')
    }
    return this.currentUser; 
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
        let auth = await this.fireAuth.auth.createUserWithEmailAndPassword(user.email, password)

        user.auth_id =  auth.user.uid;
        user.createdAt =  this.utilityService.serverTimeStamp;
        user.provider = 'email';
        user.active_ind =1;
  
         
        let newUser:IUser = await this.addUserData(user);
        newUser.createdAt =new Date (newUser.createdAt.seconds *1000);
        this.myStorgae.setItem('user', newUser);
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
    if (this.currentUser.provider=="FB"){
      this.facebook_SignOut().then(()=>{
        // redirect to required page
      })
    }else{
      return this.fireAuth.auth.signOut().then(() => {
        // redirect to required page
      })
    }
    this.myStorgae.removeItem('user');

  }

  // Returns true when user is looged in
  async  isLoggedIn() {
     let user = await   this.myStorgae.getItem('user');

     return (user !== null && user.emailVerified !== false) ? true : false;
  }
  hjh

  get user_id (){
    return this.currentUser.id;
  }

  // Store user in DB
  async addUserData(userData:IUser) {

      let newUSer = await this.fireStore.collection('user').add(userData);
      let userAdded =  (await ( newUSer).get()).data();
      userAdded.id = newUSer.id;
      return userAdded;

  }

  // Store user in localStorage
  async updateUserData(userData:IUser) {
    try {
      let updatedUSer = await this.fireStore.collection("user").doc(userData.id).set(userData, { merge: true })
      this.myStorgae.setItem('user', userData);
      return userData
    } catch (err) {
      console.log('update user error:', err)
      return err;
    }
  
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
    
  }


  async firebase_FB_provider(FB_Token){
    try {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(FB_Token);
      let auth = await  firebase.auth().signInWithCredential(facebookCredential);
      return auth.user;
    } catch (error) {
      console.log ('firebase FB auth error', error)
    }


  }


}
