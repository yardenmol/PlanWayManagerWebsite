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
          console.log(this.deiverList);
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
          console.log(this.addrList);

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
      planAddress.push(this.addrList[this.selected[i]].data.address);
    }
    console.log(planAddress);
    let cluster = {};
    cluster['locations'] = planAddress;
    cluster['driversAmount'] = this. selectedDriver.length;
    console.log(cluster);

    this.clusteringService.sendCluster(cluster).subscribe(data => {

      console.log(JSON.stringify(data["data"]));
      if (data["success"]) {
        this.showResult= false;
        let tempDriver =[];

        for(let i in this.selectedDriver){
          tempDriver.push(this.deiverList[this.selectedDriver[parseInt(i)]])
        }
        this.tracks = [];
        // console.log(data.data.driversAmount);
        for(let i=0; i< parseInt(data['data'].driversAmount); i++){
          this.tracks.push({driver:tempDriver[i],destinations: data['data'].tracks[i]})
        }

        console.log(this.tracks);

        console.log("getDestinations success");
      }
      else {
        this.showResult= true;
        console.log("getDestinations failed");
        // this.destinations = {}
      }
    });


  }

}

