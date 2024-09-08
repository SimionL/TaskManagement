import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TasksComponent } from './tasks/tasks.component'; //tasks list
import { CreateComponent } from './create/create.component'; // create new task
import { EditComponent } from './edit/edit.component'; // edit a task

export const routes: Routes = [
  { path: 'create', component: CreateComponent },
  { path: 'edit/:task', component: EditComponent},
  { path: 'tasks/:task', component: TasksComponent},
  { path: 'tasks', component: TasksComponent},
  { path: '**', redirectTo: '/tasks' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutes{}
