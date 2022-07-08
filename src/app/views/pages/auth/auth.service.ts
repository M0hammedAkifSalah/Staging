import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private cookieService:CookieService) { }
  reqHeaders:any = new HttpHeaders({
    'Content-Type' : 'application/json',
    'Access-Control-Allow-Origin' : '*',
  });
  // Login user
  login(data){
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/login`;
    return this.http.post(apiUrl,data,{headers:this.reqHeaders,observe: 'response'});
  }

  isLoggedIn(){
    if(localStorage.getItem('userToken')){
      return true;
    }else{
      return false;
    }
  }

  getProfileData(){
    const apiUrl=`${environment.apiUrl}api/v1/role/dashboard`;
    return this.http.get(apiUrl,{headers:this.reqHeaders,observe: 'response'});
  }
  getAllSchoolList(){
    const apiUrl=`${environment.apiUrl}api/v1/school`;
    return this.http.get(apiUrl,{headers:this.reqHeaders,observe: 'response'});
  }

  getOrValidateOTP(body){
    /**
     * to get otp
     * {
     * "mobile": 9999999999,
     * "username": "9999999999",
     * "profile_type": "teacher",
     * "type": "send"
     * }
     *
     * to validate otp
     * {
     * "mobile": 9999999999,
     * "type": "verify",
     * "otp":1234
     * }
     * */
    const apiUrl=`${environment.apiUrl}api/v1/otp`;
    return this.http.post(apiUrl,body,{headers:this.reqHeaders,observe: 'response'});
  }

  resetPassword(data){
    const apiUrl=`${environment.apiUrl}api/v1/SignUp/updateUserPassword`;
    return this.http.post(apiUrl,data,{headers:this.reqHeaders,observe: 'response'});
  }
}
