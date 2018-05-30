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

  addTaskToUser(){
    return this.http.get(this.domain + '/tasks/add-task').
    map(res=>res);
  }

  updateTask(){
    return this.http.get(this.domain + '/tasks/update-user').
    map(res=>res);
  }

  getTasksOfManager(mid){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/tasks/tasks-of-manager',mid,{headers:headers}).
    map(res=>res);
  }

  getPieData(mid){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/tasks/manager-pie-data',mid,{headers:headers}).
    map(res=>res);
  }

  getUsersLocations(users){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/tasks/locations-of-users',users,{headers:headers}).
    map(res=>res);
  }
}
