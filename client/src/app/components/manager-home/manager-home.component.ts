import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ManagerService} from "../../services/manager.service";
//d3
import {ElementRef, ViewChild, Input} from "@angular/core";
import * as D3 from "d3-3";
import {IData} from "../../data.interface";
//socket-io
import {Observable} from "rxjs/Observable";
import * as io from "socket.io-client";

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent implements OnInit {

  public tasks;
  mid: string;
  locations= [];

  //google-maps
  latitude: number;
  longitude: number;
  public zoom: number;

  //piechart
  @ViewChild("containerPieChart") element: ElementRef;
  private host: D3.Selection;
  private svg: D3.Selection;
  private width: number;
  private height: number;
  private radius: number;
  private htmlElement: HTMLElement;
  // private pieData: IData[];
  private pieData: any;

  //socket-io
  socket: SocketIOClient.Socket;

  constructor(private route:ActivatedRoute, private managerService: ManagerService,) {
    this.route.params.subscribe(params => {
      this.mid = params['mid'];
    });

  }

  ngOnInit() {
    console.log(this.mid);
    //this.managerService.addTaskToUser().subscribe();

    // this.managerService.getTasksOfManager({mid: this.mid}).subscribe(tasks=>{
    //   console.log(tasks);
    //   this.tasks = tasks;
    //
    //   var sumLat = 0;
    //   var sumLng = 0;
    //   for(var i =0;i<this.tasks.length;i++){
    //     sumLat += this.tasks[i].latitude;
    //     sumLng += this.tasks[i].longitude;
    //   }
    //   this.latitude = sumLat / this.tasks.length;
    //   this.longitude = sumLng / this.tasks.length;
    //
    //   console.log(this.longitude);
    //   console.log(this.latitude);
    // });

    //google-maps
    this.zoom = 10;

    this.latitude = 32.0301334;
    this.longitude = 34.9501432;

    //pie-chart
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);

    //socket-io(pieData)
    this.initSocketIoPieData().subscribe(data=>{
      this.pieData = data;
      this.setup();
      this.buildSVG();
      this.buildPie();
    });

    //socket-io(tasks-of-manager)
    this.initSocketIoTasksOfManager().subscribe(tasks=>{
      console.log(tasks);
      console.log("inside initTasksOfManager");
      this.tasks = tasks;
      //this.locations = [];
      var sumLat = 0;
      var sumLng = 0;
      for(var i =0;i<this.tasks.length;i++){
        this.locations.push({lat: this.tasks[i].latitude,
                             lng: this.tasks[i].longitude,
                             name: this.tasks[i].name,
                             uid: this.tasks[i].uid})
        sumLat += this.tasks[i].latitude;
        sumLng += this.tasks[i].longitude;
      }
      this.latitude = sumLat / this.tasks.length;
      this.longitude = sumLng / this.tasks.length;

      console.log(this.longitude);
      console.log(this.latitude);
    })

  }

  editUser(mid){
    console.log("after edit");
    this.managerService.updateTask().subscribe();
  }


  //pie-chart
  private setup(): void {
    this.width = 250;
    this.height = 250;
    this.radius = Math.min(this.width, this.height) / 2;
  }

  private buildSVG(): void {
    this.host.html("");
    this.svg = this.host.append("svg")
      .attr("viewBox", `0 0 ${this.width} ${this.height}`)
      .append("g")
      .attr("transform", `translate(${this.width / 2},${this.height / 2})`);
  }

  private buildPie(): void {
    let pie = D3.layout.pie();
    let values = this.pieData.map(data => data.value);
    let arcSelection = this.svg.selectAll(".arc")
      .data(pie(values))
      .enter()
      .append("g")
      .attr("class", "arc");

    this.populatePie(arcSelection);
  }

  private populatePie(arcSelection: D3.Selection<D3.layout.pie.Arc>): void {
    let innerRadius = this.radius - 50;
    let outerRadius = this.radius - 10;
    let pieColor = D3.scale.category20c();
    let arc = D3.svg.arc<D3.layout.pie.Arc>()
      .outerRadius(outerRadius);
    arcSelection.append("path")
      .attr("d", arc)
      .attr("fill", (datum, index) => {
        return pieColor(this.pieData[index].label);
      });

    arcSelection.append("text")
      .attr("transform", (datum: any) => {
        datum.innerRadius = 0;
        datum.outerRadius = outerRadius;
        return "translate(" + arc.centroid(datum) + ")";
      })
      .text((datum, index) => this.pieData[index].label)
      .style("text-anchor", "middle");
  }

  //socket-io(pieData)
  initSocketIoPieData(){
    let observable = new Observable(observer => {
      this.socket = io.connect('http://localhost:8080');

      this.socket.emit('getPieData',{mid: this.mid});
      this.socket.on('pieDataResult', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  initSocketIoTasksOfManager(){
    let observable = new Observable(observer => {
      this.socket = io.connect('http://localhost:8080');

      this.socket.emit('getTasksOfManager',{mid: this.mid});
      this.socket.on('TasksOfManagerResult', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }



}
