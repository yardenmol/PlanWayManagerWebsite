import { RouterModule, Routes } from '@angular/router';
import {NgModule} from "@angular/core";
import {TasksComponent} from "./components/tasks/tasks.component";
import {HomeComponent} from "./components/home/home.component";
import {EditTaskComponent} from "./components/edit-task/edit-task.component";
import {AdminComponent} from "./components/admin/admin.component";
import {ManagerHomeComponent} from "./components/manager-home/manager-home.component";
import {UserManagementComponent} from "./components/user-management/user-management.component";

// Our Array of Angular 2 Routes
export const appRoutes: Routes = [
  {
    path: '',
    component:HomeComponent
  },
  {
    path: 'home/:mid',
    component:ManagerHomeComponent
  },
  {
    path: 'usermanagement/:mid',
    component:UserManagementComponent
  },
  {
    path: 'tasks/:id',
    component: TasksComponent
  },
  {
    path: 'edittask',
    component: EditTaskComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule {}
