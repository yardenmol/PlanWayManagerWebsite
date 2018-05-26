import { Component, OnInit } from '@angular/core';
import {DestinationService} from "../../services/destination.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-clustering',
  templateUrl: './clustering.component.html',
  styleUrls: ['./clustering.component.css']
})
export class ClusteringComponent implements OnInit {

  mid: string;
  public addrList :any;
  public selected = [];

  constructor(private destinationService:DestinationService,private route:ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.mid = params['mid'];


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
    });
  }

  ngOnInit() {

  }

  print(){
    // console.log(this.selected);
  }
  public sendAddress(){
    let planAddress = [];
    for (let i in this.selected){
      planAddress.push(this.addrList[this.selected[i]].data);
    }
    console.log(planAddress);
}

}

