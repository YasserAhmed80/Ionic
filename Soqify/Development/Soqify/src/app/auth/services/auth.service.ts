import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { IUser, UserRole } from '../../model/types'


// Facebool blugin for auth for Android, iOS, Web
import { Plugins } from '@capacitor/core';
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';
import { Observable } from 'rxjs';
const { FacebookLogin } = Plugins;
const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
// End Facebook auth

@Injectable({
  providedIn: 'root'
})
export class authService {
 
  public user: IUser={};

  constructor(public fireAuth:AngularFireAuth, 
             public fireStore: AngularFirestore
             ) 
  { 
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


  // Register user into database
  registerUser(user:IUser, password) {
     return this.fireAuth.auth.createUserWithEmailAndPassword(user.email, password)
     .then((auth)=>{
          console.log ('Register successfully ', auth.user);
          // Save user data into database
          console.log('from register user',user);
          this.saveUserData(user, auth.user.uid,'email')

          localStorage.setItem('user', JSON.stringify(this.user));
          // send verification mail
          this.sendVerificationMail();
          return 'success';
    })
    .catch((err)=>{
      return err.code;
    })
    
  }

  // User login 
  signIn(email, password){
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password)
    .then ((auth)=>{
      if (!auth.user.emailVerified) {
       return 'verify';
      }else{
        // reterive user data after sign in
        this.getUserData();
        localStorage.setItem('identity', JSON.stringify(this.user));
        return 'success';
      }
     })
     .catch ((err)=>{
       return err.code;
     })
  }

  // User logout
  SignOut(){
    if (this.user.provider=="FB"){
      this.facebook_SignOut().then(()=>{
        // redirect to required page
      })
    }else{
      return this.fireAuth.auth.signOut().then(() => {
        localStorage.removeItem('identity');
        // redirect to required page
      })
    }

   
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('identity'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  get user_id (){
    return this.user.uid;
  }

  // Store user in localStorage
  saveUserData(user:IUser, uid, provider) {
    this.user = {
      auth_id: uid,
      email:user.email,
      name: user.name,
      role: user.role,
      tel:user.tel,
      provider:provider
    };

    this.fireStore.collection('identity', ref => ref.where ('auth_id','==', uid))
    .valueChanges({idField: 'uid'})
    .subscribe((user)=>{
      // if user not exsit add it
      console.log('user is ',user)
      if (user.length==0) {
        let newUSer = this.fireStore.collection('identity').add(this.user);
        newUSer
        .then((doc)=>{
          return true;
        })
        .catch((err)=>{
          
          return false;
        })
      }else{
        this.user =<IUser>user[0];
        console.log('user already added',this.user)
        return true;
      }
    })
  }

  // get user data from database
  getUserData(){
    let user$  = this.fireStore.collection('identity', (ref)=> ref.where ('auth_id', '==', this.user.auth_id)).valueChanges({idField: 'uid'});
    user$.subscribe((user)=>{
      console.log('user data: ',user);
      this.user =<IUser>user[0];
    })
   
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
  async facebook_SignIn(){
    FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })
      .then((result: FacebookLoginResponse)=>{
        console.log(`Facebook response`, result);

        this.getFB_userInfo ()
        .then ((FB_user)=>{
          this.firebase_FB_provider(result.accessToken.token)
          .then((user)=>{
            this.user = {
              auth_id: user.uid,
              email:'none',
              name: FB_user.name,
              role:UserRole.Admin,
              tel:'none',
              provider:'FB'
            };
            this.saveUserData(this.user, user.uid,'FB');
            localStorage.setItem('identity', JSON.stringify(this.user));
          })
         
        })
      })
      .catch ((err)=>{
        console.log(`Facebook response: user cancelled`);
      })
  }

  async facebook_SignOut (){
    FacebookLogin.logout( )
      .then(()=>{
        console.log(`Sign out successfully`);
        localStorage.removeItem('identity');
        return true;
      })
      .catch((err)=>{
        console.log(`Sign out error`);
        return false;
      })
  }
  getFB_userInfo(){
     return this.getCurrentAccessToken()
      .then((result)=>{
        let  {userId, token} = result.accessToken;
          return fetch(`https://graph.facebook.com/${userId}?fields=id,name,gender,link,picture&type=large&access_token=${token}`)
          .then((response)=>{
              return response.json()
              .then((FB_user)=>{
                console.log('get inof:', FB_user);
                return FB_user;
              });
          })
      })
  }

  getCurrentAccessToken(){
    return FacebookLogin.getCurrentAccessToken();
  }

  firebase_FB_provider(FB_Token){
  
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(FB_Token);
    return firebase.auth().signInWithCredential(facebookCredential)
    .then ((auth)=>{
      console.log('sign in with FB/firebase:', auth.user);
      return auth.user;
    })

  }
  // >> End of section: Sign in using Facebook---------------------------------


}
