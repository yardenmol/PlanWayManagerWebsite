import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../services/admin.service";
//d3
import {ElementRef, ViewChild, Input} from "@angular/core";
import * as D3 from "d3-3";
import {IData} from "../../data.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
