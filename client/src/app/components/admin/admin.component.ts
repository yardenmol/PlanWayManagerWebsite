import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../services/admin.service";
//d3
import {ElementRef, ViewChild, Input} from "@angular/core";
import * as D3 from "d3-3";
import {IData} from "../../data.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public tasks;
  searchName1: string;
  searchName2: string;
  done: string;
  date: string;

  //piechart
  @ViewChild("containerPieChart") element: ElementRef;
  private host: D3.Selection;
  private svg: D3.Selection;
  private width: number;
  private height: number;
  private radius: number;
  private htmlElement: HTMLElement;
  private pieData: IData[];

  //google-maps
  latitude: number;
  longitude: number;
  public locations;
  public zoom: number;

  constructor(private AdminService:AdminService, private router: Router){
  }

  ngOnInit() {
  //google-maps
    this.zoom = 11;
    this.latitude = 32.0301334;
    this.longitude = 34.9501432;
    this.locations = [{lat: 31.9993516, lng: 34.945046, name: "Yarden"},
      {lat: 32.0729577, lng: 34.7895258999999, name: "Tomer"},
      {lat: 32.1024617, lng: 34.8767515, name: "Maayan"},
      {lat: 32.012808, lng: 34.780877, name: "Elad"}]


    this.getTasks();

    //pie-chart
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);
    this.getPieData();
  }

  getTasks(){
    console.log("getTasks");
    this.AdminService.getTasks().
    subscribe(tasks=>{
      this.tasks = tasks;
      console.log(tasks);
    });
  }

  updateStatus(user,task){
    task.isDone=!task.isDone;
    this.AdminService.updateStatus(user,task).subscribe(data =>{
      this.getPieData();
    });
  }

  search(event){

    var searchTasks=this.tasks;


    if (this.searchName2!=undefined){
      for(var i = 0; i < searchTasks.length;i++){
        for(var j = 0; j < searchTasks[i].tasks.length;j++) {
          if (searchTasks[i].tasks[j].name != this.searchName2) {
            searchTasks[i].tasks.splice(j, 1);
            j = j - 1;
          }
        }
      }
    }
    if (this.done=="1"){
      for(var i = 0; i < searchTasks.length;i++){
        for(var j = 0; j < searchTasks[i].tasks.length;j++) {
          if (searchTasks[i].tasks[j].isDone == false) {
            searchTasks[i].tasks.splice(j, 1);
            j = j - 1;
          }
        }
      }
    }
    if (this.done=="2"){
      for(var i = 0; i < searchTasks.length;i++){
        for(var j = 0; j < searchTasks[i].tasks.length;j++) {
          if (searchTasks[i].tasks[j].isDone == true) {
            searchTasks[i].tasks.splice(j, 1);
            j= j-1;
          }
        }
      }
    }

    if (this.date!=undefined){
      for(var i = 0; i < searchTasks.length;i++) {
        for (var j = 0; j < searchTasks[i].tasks.length; j++) {
          if (searchTasks[i].tasks[j].fromDate != this.date || searchTasks[i].tasks[j].fromDate == undefined) {
            searchTasks[i].tasks.splice(j, 1);
            j = j - 1;
          }
        }
      }
    }
    this.tasks=searchTasks;
  }

  refresh(){
    this.getTasks();
    this.searchName2=undefined;
    this.date=undefined;
    this.done=undefined;

  }

  //pie-chart
  getPieData(){
    this.AdminService.getPieData().
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

  editUser(uid){
    this.router.navigate(['/tasks',uid]);
  }
}
