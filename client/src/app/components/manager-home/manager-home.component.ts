import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ManagerService} from "../../services/manager.service";

//d3
import {ElementRef, ViewChild, Input} from "@angular/core";
import * as D3 from "d3-3";
import {IData} from "../../data.interface";

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent implements OnInit {

  public tasks;
  mid: string;

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
  private pieData: IData[];

  constructor(private route:ActivatedRoute, private managerService: ManagerService,) {
    this.route.params.subscribe(params => {
      this.mid = params['mid'];
    });

  }

  ngOnInit() {
    console.log(this.mid);
    // this.managerService.addTaskToUser().subscribe();
    this.managerService.getTasksOfManager({mid: this.mid}).
    subscribe(tasks=>{
      console.log(tasks);
      this.tasks = tasks;
    });


    //google-maps
    this.zoom = 11;
    this.latitude = 32.0301334;
    this.longitude = 34.9501432;

    //pie-chart
    this.htmlElement = this.element.nativeElement;
    this.host = D3.select(this.htmlElement);
    this.getPieData();
  }


  //pie-chart
  getPieData(){
    this.managerService.getPieData(this.mid).
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
