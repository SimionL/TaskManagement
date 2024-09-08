import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from '../tasks/task';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [ReactiveFormsModule],
  standalone: true
})
export class EditComponent implements OnInit {

  task: Task;
  form = new FormGroup({
    id: new FormControl(),
    title: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl('')
  });

  constructor(public router: Router, public activatedrouter: ActivatedRoute) {
    this.task = {id:0, title:"", description:"", status:""};
  }

  ngOnInit() {
    this.task = JSON.parse(this.activatedrouter.snapshot.paramMap.get("task") || "");

    if (this.task) {
      this.form.patchValue(this.task);
    }
  }

  goToTasks() {
    this.router.navigate(['/tasks']);
  }

  goToCreate() {
    this.router.navigate(['/create']);
  }

  save(form: any) {
    this.router.navigate(['/tasks/' + JSON.stringify(form)]);
  }
}