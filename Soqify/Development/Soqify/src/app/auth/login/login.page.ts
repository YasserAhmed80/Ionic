import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IUser, UserRoleRef} from '../../model/user'



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  email : string = 'ysrahmed@gmail.com';
  password: string = '123456';


  constructor(public authService:AuthService) {
    
   }

  ngOnInit() {
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
    this.authService.facebook_SignIn().then((user)=> console.log('facebook signed user', user))
  }

  facebook_SignOut(){
    this.authService.facebook_SignOut();
  }

}
