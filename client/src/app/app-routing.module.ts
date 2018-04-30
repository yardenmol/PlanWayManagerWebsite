import { RouterModule, Routes } from '@angular/router';
import {NgModule} from "@angular/core";
import {TasksComponent} from "./components/tasks/tasks.component";
import {HomeComponent} from "./components/home/home.component";
import {EditTaskComponent} from "./components/edit-task/edit-task.component";
import {AboutusComponent} from "./components/aboutus/aboutus.component";
import {AdminComponent} from "./components/admin/admin.component";

// Our Array of Angular 2 Routes
export const appRoutes: Routes = [
  {
    path: '',
    component:HomeComponent // The Default Route
  },
  {
    path: 'tasks/:id',
    component: TasksComponent// The tasks Router
  },
  {
    path: 'edittask',
    component: EditTaskComponent// The edittask Router
  },
  {
    path: 'aboutus',
    component: AboutusComponent// The edittask Router
  },
  {
    path: 'admin',
    component: AdminComponent// The edittask Router
  },
  {
    path: '**',
    component: HomeComponent // The "Catch-All" Route
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
