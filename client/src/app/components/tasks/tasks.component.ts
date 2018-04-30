import { Component, OnInit } from '@angular/core';
import { TaskService } from "../../services/task.service";
import { Task } from "../../../../Task";
import {ActivatedRoute, Router} from "@angular/router";
import * as io from "socket.io-client";
import {Observable} from "rxjs/Observable";

//d3
import {ElementRef, ViewChild, Input} from "@angular/core";
import * as D3 from "d3-3";
import {IData} from "../../data.interface";


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],

})
export class TasksComponent implements OnInit {

  public tasks;
  public maxtask;

  name: string;
  id: string;
  private sub: any;

  searchName1: string;
  searchName2: string;
  done: string;
  date: string;

  latitude: number;
  longitude: number;
  public locations;
  public zoom: number;
  socket: SocketIOClient.Socket;

  //piechart
  @ViewChild("containerPieChart") element: ElementRef;
  private host: D3.Selection;
  private svg: D3.Selection;
  private width: number;
  private height: number;
  private radius: number;
  private htmlElement: HTMLElement;
  private pieData: IData[];


  constructor(private taskService:TaskService,
              private route:ActivatedRoute,
              private router: Router) {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      });
    }

  ngOnInit() {
    this.zoom = 10;
    this.latitude = 32.0301334;
    this.longitude = 34.9501432;

    //socket-io
    this.initSocketIo().subscribe(data=>{
      if(data["result"].n==1){
        for(var i = 0; i < this.tasks.length;i++){
          if(this.tasks[i]._id== data["tid"])
            this.tasks.splice(i,1);
        }
      }
    });

    this.getTasksOfUser(this.id);
    this.setCurrentPosition();
    this.getLocationsOfTasks(this.id);
    this.getmax();

    //pie-chart
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);
    this.getPieDataOfUser(this.id);

    }

  initSocketIo(){
    let observable = new Observable(observer => {
      this.socket = io.connect('http://localhost:8080');
      this.socket.on('deleteTaskResult', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  deleteTask(idTask){
    var data = { uid: this.id, tid:idTask};
    this.socket.emit('deleteTask',data);
    this.getLocationsOfTasks(this.id);
    this.getPieDataOfUser(this.id);
  }

  getLocationsOfTasks(id){
    this.taskService.getLocationsOfTasks(id).
    subscribe(locations=>{
      this.locations=locations;
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }

  getTasksOfUser(id){
    this.taskService.getTasksOfUser(id).
      subscribe(tasks=>{
       this.tasks = tasks;
    });
  }

  editTask(tid){
    this.router.navigate(['/edittask'],{ queryParams: { uid: this.id, tid: tid } });
  }

  addTask(event){
    event.preventDefault();
    var newTask = {
      name: this.name,
      isDone: false
    }
    this.taskService.addTask(newTask,this.id).
    subscribe((task:Task)=>{
      if(!this.tasks)
        this.tasks=[];
      this.tasks.push(task);
      this.name = '';
      this.getPieDataOfUser(this.id);
    });
  }

  updateStatus(task){
    task.isDone=!task.isDone;
    this.taskService.updateStatus(this.id,task).subscribe(data =>{
      this.getPieDataOfUser(this.id);
    });
  }

  search(event){
    var searchTasks=this.tasks;

    if (this.searchName2!=undefined){
      for(var i = 0; i < searchTasks.length;i++){
        if(searchTasks[i].name!= this.searchName2){
          this.tasks.splice(i,1);
          i=i-1;
        }
      }
    }

    if (this.done=="1"){
      for(var i = 0; i < searchTasks.length;i++){
        if(searchTasks[i].isDone==false){
          this.tasks.splice(i,1);
          i=i-1;
        }
      }
    }
    if (this.done=="2"){
      for(var i = 0; i < searchTasks.length;i++){
        if(searchTasks[i].isDone==true){
          this.tasks.splice(i,1);
          i=i-1;
        }
      }
    }

    if (this.date!=undefined){
      for(var i = 0; i < searchTasks.length;i++){
        if(searchTasks[i].fromDate!=this.date) {
          this.tasks.splice(i, 1);
          i = i - 1;
        }
      }
    }
    this.tasks=searchTasks;
  }

  refresh(){
    this.getTasksOfUser(this.id);
  }

  getmax(){
    this.taskService.maxTask(this.id).subscribe(data =>{
      if (data["empty"])
        this.maxtask="";
      else
        this.maxtask=data["name"];
    });
  }

  addmax(){
    if(this.maxtask!="") {
      var newTask = {
        name: this.maxtask,
        isDone: false
      }
      this.taskService.addTask(newTask, this.id).subscribe((task: Task) => {
        if (!this.tasks)
          this.tasks = [];
        this.tasks.push(task);
        this.name = '';
        this.getPieDataOfUser(this.id);
      });
    }
  }

  //pie-chart
  getPieDataOfUser(id){
    this.taskService.getPieDataOfUser(this.id).
    subscribe((data:any)=>{
      this.pieData = data;
      this.setup();
      this.buildSVG();
      this.buildPie();
    })
  }

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



}
