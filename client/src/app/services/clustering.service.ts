import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map'

@Injectable()
export class ClusteringService {
  // domain = "http://193.106.55.167:8889/directions/api/v1.0/cluster";
  domain = "http://localhost:8080";
  constructor(private http:HttpClient) {
  }

  sendCluster(cluster){
    // console.log(cluster);
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/clustering/send-cluster',cluster,{headers:headers}).
    map(res=>res);

  }

  sendTasks(tasks){
    console.log(tasks);
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/clustering/send-tasks',tasks,{headers:headers}).
    map(res=>res);

  }

}
