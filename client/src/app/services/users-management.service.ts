import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map'

@Injectable()
export class UsersManagementService {

  domain = "http://localhost:8080";
  constructor(private http:HttpClient) {
  }

  getAllUsers(mid){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/fauthentication/get-users',mid,{headers:headers}).
    map(res=>res);
  }

  userRegister(newUser){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/fauthentication/user-register',newUser,{headers:headers}).
    map(res=>res);
  }


}
