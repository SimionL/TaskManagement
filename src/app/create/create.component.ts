import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../tasks/task';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  imports: [ReactiveFormsModule],
  standalone: true
})
export class CreateComponent {

  form = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl('')
  });

  constructor(public router: Router, public activatedrouter: ActivatedRoute) {}

  goToTasks(){
    this.router.navigate(['/tasks']);
  }

  save(form: any) {
    this.router.navigate(['/tasks/' + JSON.stringify(form)]);
  }
}