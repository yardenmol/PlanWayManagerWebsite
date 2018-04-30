import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map'

@Injectable()
export class UserService {
  domain = "http://localhost:8080";
  constructor(private http:HttpClient) {
  }

  addUser(newUser){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/authentication/register',newUser,{headers:headers}).
    map(res=>res);
  }

  login(newUser){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/authentication/login',newUser,{headers:headers}).
    map(res=>res);
  }

  admin(newAdmin){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/authentication/admin',newAdmin,{headers:headers}).
    map(res=>res);
  }
}
