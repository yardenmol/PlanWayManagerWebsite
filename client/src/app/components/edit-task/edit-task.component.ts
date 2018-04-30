import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {
  id:string;
  uid: string;
  tid: string;
  name: string;
  fromDate:Date;
  toDate:Date;
  lat: number;
  lng: number;
  address: string;

  private sub: any;

  constructor(private taskService:TaskService,
              private route:ActivatedRoute,
              private router: Router) {
  }
  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      this.uid = params['uid'];
      this.tid = params['tid'];
      this.id = this.uid;
    });

    this.taskService.getSingleTask(this.uid,this.tid).subscribe(data=>{
        console.log(data);
        this.name = data["name"];
        this.fromDate = data["fromDate"];
        this.toDate = data["toDate"];
        if(data["lat"])
          this.lat = +data["lat"];
        if(data["lng"])
          this.lng =  +data["lng"];
        this.address = data["address"];
    });

  }

  editTask(){
    console.log(this.name);
    console.log(this.fromDate);
    console.log(this.toDate);


    var data = {
      uid: this.uid,
      tid: this.tid,
      name: this.name,
      fromDate: this.fromDate,
      toDate: this.toDate,
      address: this.address,
      lat: this.lat,
      lng: this.lng
    }
    this.taskService.editTask(data).subscribe(data=>{
      this.router.navigate(['/tasks',this.uid]);
    });
  }

  onNotify(location){
    // console.log("blabla");
    console.log("in edit: "+location.lat);
    console.log("in edit: "+location.lng);
    console.log("in edit: "+location.address);

    this.lat = location.lat;
    this.lng = location.lng;
    this.address = location.address;

  }
}
