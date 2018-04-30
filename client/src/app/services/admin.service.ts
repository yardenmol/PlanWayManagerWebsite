import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map'


@Injectable()
export class AdminService{

  domain = "http://localhost:8080";
  constructor(private http:HttpClient) {
  }

  getTasks(){
    return this.http.get(this.domain + '/admin/alltasks').
    map(res=>res);
  }

  updateStatus(user,task){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.put(this.domain+'/admin/update/'+user ,task,{headers:headers}).
    map(res=>res);
  }

  getPieData(){
    return this.http.get(this.domain + '/api/userspiedata').
    map(res=>res);

  }


}
