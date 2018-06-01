import { Component, OnInit } from '@angular/core';
import {DestinationService} from "../../services/destination.service";
import {ActivatedRoute} from "@angular/router";
import  {ClusteringService} from "../../services/clustering.service"
import {UsersManagementService} from "../../services/users-management.service";
@Component({
  selector: 'app-clustering',
  templateUrl: './clustering.component.html',
  styleUrls: ['./clustering.component.css']
})
export class ClusteringComponent implements OnInit {
  showResult : boolean;
  mid: string;
  public addrList :any;
  public deiverList :any;
  public selected = [];
  public selectedDriver = [];
  public tracks:any;
  public tracksToShow = [];
  constructor(private clusteringService: ClusteringService,private destinationService:DestinationService,private usersManagementService:UsersManagementService,private route:ActivatedRoute) {
    this.showResult = true;
    this.route.params.subscribe(params => {
      this.mid = params['mid'];

      this.usersManagementService.getAllUsers({mid:this.mid}).subscribe(data => {
        console.log(data);
        if (data) {
          console.log("getUsers success");

          // console.log(data);
          this.deiverList = [];
          for (let id in data){

            this.deiverList.push({id:parseInt(id), name:data[id].name, data:data[id]});

          }
          // console.log(this.deiverList);
        }
        else{
          console.log("getUsers failed");
          // this.destinations = {}
        }
      });
    });

      this.destinationService.getDestinations(this.mid).subscribe(data => {
        if (data) {
          console.log("getDestinations success");

          // console.log(data);
          this.addrList = [];
          for (let id in data){

              this.addrList.push({id:parseInt(id), name:data[id].name, data:data[id]});

          }
          // console.log(this.addrList);

        }
        else{
          console.log("getDestinations failed");
          // this.destinations = {}
        }
      });
    }



  ngOnInit() {

  }

  print(){
    // console.log(this.selected);
  }
  public sendAddress() {
    this.showResult= true;
    let planAddress = [];
    for (let i in this.selected) {
      // console.log(this.addrList[this.selected[i]].data);
      planAddress.push(this.addrList[this.selected[i]].data.latitude.toString() +" "+this.addrList[this.selected[i]].data.longitude.toString());

    }

    // console.log(planAddress);
    let cluster = {};
    cluster['locations'] = planAddress;
    cluster['driversAmount'] = this. selectedDriver.length;
    // console.log(cluster);

    this.clusteringService.sendCluster(cluster).subscribe(data => {
      this.tracksToShow = [];
      // console.log(JSON.stringify(data["data"]));
      if (data["success"]) {
        this.showResult= false;
        let tempDriver =[];

        for(let i in this.selectedDriver){
          tempDriver.push(this.deiverList[this.selectedDriver[parseInt(i)]])
        }
        this.tracks = [];


        //getDriver
        for(let i=0; i< parseInt(data['data'].driversAmount); i++){
          let task = {
            date:"",
            destinations:[],
            mid:"",
            uid:""
          };
          let showTask={
            driver:"",
            destinations:[]
          };

          //build task
          let d = new Date();
          task.date = d.getFullYear()+ "-"+ (d.getMonth()+1) +"-" +d.getDate();

          task.uid = tempDriver[i].data.uid;
          task.mid = this.mid;


          //build task to show
          showTask.driver =tempDriver[i].data;

          let temp = data['data'].tracks[i];//array of tasks per user lat long
          // console.log(temp);
          for (let pos in temp){
            let r = temp[pos].split(" ");
            task.destinations.push({did:this.getAddressByLocations(r[0],r[1]).did, isDone:false});
            showTask.destinations.push(this.getAddressByLocations(r[0],r[1]));
          }
          // console.log(task);
          this.tracks.push(task);
          this.tracksToShow.push(showTask);
        }

        //  console.log(this.tracks);
        // console.log(this.tracksToShow);
        console.log("getDestinations success");
      }
      else {
        this.showResult= true;
        console.log("getDestinations failed");
        // this.destinations = {}
      }
    });


  }

  sendTheTasks(){
    console.log("send");
    this.clusteringService.sendTasks({mid:this.mid, tasks:this.tracks}).subscribe(data=>{
      if (data["success"]) {
        console.log("Tasks success");
      }
      else{
        console.log("Tasks failed "+data["message"]);
      }
    });

  }

  private getAddressByLocations(lat, long){
    for (let addr in this.addrList){
      if(this.addrList[addr]["data"].latitude==lat && this.addrList[addr]["data"].longitude==long) {
        return this.addrList[addr]["data"];
      }
    }

  }
}

