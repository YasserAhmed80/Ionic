import { Component, OnInit } from '@angular/core';
import { authService } from '../services/auth.service';
import { IUser, UserRole} from '../../model/types'



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  email : string = 'ysrahmed@gmail.com';
  password: string = '123456';


  constructor(private authService:authService) {
    
   }

  ngOnInit() {
  }

  registerUser(){
    var user:IUser;

    user = {
      email: this.email,
      name:'yasser',
      tel:'01028787773',
      role: UserRole.Admin
    }
    this.authService.registerUser(user,this.password)
    .then((x)=>{
      if (x ==='sucess') {
        console.log('x',x)
      }else{
        console.log('x',x)
      }
      
    })
  }

  
  loginUser (){
    this.authService.signIn(this.email, this.password).then((res)=>{
      console.log('sign in:', res)
    })
  }

  verifyMail (){
    this.authService.sendVerificationMail();
  }

  signOut(){
    this.authService.SignOut();
  }

  resetPassword(){
    this.authService.resetPassword(this.authService.user.email)
  }

  facebook_SignIn(){
    this.authService.facebook_SignIn();
  }

  facebook_SignOut(){
    this.authService.facebook_SignOut();
  }

}
