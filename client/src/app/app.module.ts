import { BrowserModule } from '@angular/platform-browser';
import { NgModule,ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common'
import { AppComponent } from './app.component';
import { TasksComponent } from './components/tasks/tasks.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { GoogleMapsComponent } from './components/google-maps/google-maps.component';
import {AppRoutingModule} from "./app-routing.module";
import { AgmCoreModule } from '@agm/core';
import { HomeComponent } from './components/home/home.component';
import { EditTaskComponent } from './components/edit-task/edit-task.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NvD3Module } from 'ng2-nvd3';
import  {Ng2SearchPipeModule} from "ng2-search-filter";
import {appRoutes} from "./app-routing.module";


import 'nvd3';
import { ChartsComponent } from './components/charts/charts.component';
import { AdminComponent } from './components/admin/admin.component';
import { DestinationsComponent} from "./components/destinations/destinations.component";
import {Router, RouterModule} from "@angular/router";
import { ManagerHomeComponent } from './components/manager-home/manager-home.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ClusteringComponent } from './components/clustering/clustering.component';

import { DualListBoxModule } from 'ng2-dual-list-box'

@NgModule({
  declarations: [AppComponent, TasksComponent, GoogleMapsComponent, HomeComponent, EditTaskComponent, NavbarComponent, ChartsComponent, AdminComponent, DestinationsComponent, ManagerHomeComponent, UserManagementComponent, ClusteringComponent],
  imports: [
    BrowserModule,
    DualListBoxModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    NvD3Module,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBVbJsTlpt0NwtdduIznlPoxB0onGBu7vk',
      language: 'en',
      libraries:['geometry', 'places']
    }),
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    RouterModule.forRoot(appRoutes,{useHash:true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
