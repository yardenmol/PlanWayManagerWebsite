import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map'

@Injectable()
export class ManagerService {

  domain = "http://localhost:8080";
  constructor(private http:HttpClient) {
  }

  managerRegister(newManager){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/fauthentication/manager-register',newManager,{headers:headers}).
    map(res=>res);
  }

  managerLogin(manager){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/fauthentication/manager-login',manager,{headers:headers}).
    map(res=>res);
  }

}
