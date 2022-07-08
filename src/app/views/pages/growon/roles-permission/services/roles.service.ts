import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  reqHeaders: any = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'token': localStorage.getItem('userToken')
  });
 
 
  roles: any[] = [];

  constructor(private http: HttpClient) { 
    
  }

  getAllRoles(): any {
    const apiUrl = `${environment.apiUrl}api/v1/role`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' }).toPromise();
  }
  saveAllRoles(): any {
    return this.getAllRoles().then(response => {
      this.roles = Object.assign(response.body.data);
    })

  }
  getdashboardRole(data) {
    const apiUrl = `${environment.apiUrl}api/v1/role/get`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }


  // get all roles
  getRoles() {
    return new Promise((resolve, reject) => {
      if (this.roles.length > 0) {
        return resolve(this.roles.filter(role => role.type == 'custom'))
      } else {
        this.saveAllRoles().then(data => {
          return resolve(this.roles.filter(role => role.type == 'custom'))
        })
      }
    })
  }
  getId() {
    let userInfo = localStorage.getItem('info');

    let user = JSON.parse(userInfo);
    let id: any;
    if (user.user_info[0].school_id) {
      return user.user_info[0].school_id;
    } else {
      return user.user_info[0].id;
    }

  }
  // get subjects
  getSubjects() {
    const apiUrl = `${environment.apiUrl}api/v1/subject?repository.id=${this.getId()}`;
    return this.http.get(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  // Add role
  addRole(data: object) {
    console.log(data)
    const apiUrl = `${environment.apiUrl}api/v1/role`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  // deleteRole
  deleteRole(data) {
    const apiUrl = `${environment.apiUrl}api/v1/role/deleteRole/`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  // Update role
  updateRole(data: any) {
    console.log(data)
    const apiUrl = `${environment.apiUrl}api/v1/role/${data._id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  // GetAllUsers
  getAllUsers(data) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/user?_id=${data}`;
    return this.http.post(apiUrl, { headers: this.reqHeaders, observe: 'response' });
  }
  getAllDashboardUsers(data) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/get`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
  // Register User
  addUser(data: object) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  updateUser(data: any) {
    console.log(data)
    console.log(data._id)
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/${data._id}`;
    return this.http.put(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }

  checkDuplicateDisplayName(data){
    const apiUrl =`${environment.apiUrl}api/v1/role/exist`;
    return this.http.post(apiUrl,data,{ headers: this.reqHeaders, observe: 'response' });
  }

  deleteUser(data) {
    const apiUrl = `${environment.apiUrl}api/v1/SignUp/deleteUser`;
    return this.http.post(apiUrl, data, { headers: this.reqHeaders, observe: 'response' });
  }
}
