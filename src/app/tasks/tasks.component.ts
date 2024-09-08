import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Task } from './task';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TaskService } from './task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatTableModule],
  standalone: true
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  tableDataSource = new MatTableDataSource(this.tasks);
  displayedColumns: string[] = ['id', 'title', 'description', 'status'];

  selectedTask: any;
  isEditAvailable = false;
  isAscendingOrder = true;

  constructor(public router: Router, public activatedRoute: ActivatedRoute, private taskService: TaskService) {
    this.tasks = [];
    this.selectedTask = { id: 0, title: "", description: "", status: "" };
  }

  ngOnInit() {

    let param: any;
    const urlParam = this.activatedRoute.snapshot.paramMap.get("task");
    if (urlParam) {
      param = JSON.parse(urlParam);
    }

    if (!urlParam) {
      // is just loading the page
      this.taskService.getTasks().subscribe(response => {
        this.tasks = response;
        this.init(param);
      });
    } else {
      // is edit or create
      this.taskService.getDefaultListIfMockServerNotRespond().subscribe(response => {
        this.tasks = response;
        this.init(param);
      });
    }
  }

  init(param: any) {
    if (param) {
      if (param.id) {
        //is edit
        this.tasks.forEach(element => {
          if (element && element.id == param.id) {
            element.title = param.title
            element.description = param.description
            element.status = param.status
          }
        });
      } else {
        //is create
        param.id = this.getId();
        this.tasks[this.tasks.length] = param;
      }
    }

    this.saveOnLocal();
    this.tableDataSource = new MatTableDataSource(this.tasks);
  }

  goToEdit() {
    this.router.navigate(['/edit/' + JSON.stringify(this.selectedTask)]);
  }

  goToCreate() {
    this.router.navigate(['/create']);
  }

  setSelectedTask(task: Task) {
    this.selectedTask = task;
    this.isEditAvailable = true;
  }

  getColor(task: Task) {
    if (this.selectedTask == task) {
      return "#80ff00";
    } else {
      return "";
    }
  }

  delete() {
    if (this.selectedTask) {
      this.tasks = this.tasks.filter(obj => { return obj !== this.selectedTask });
      this.isEditAvailable = false;
      this.selectedTask = null;
      this.saveOnLocal();
      this.tableDataSource = new MatTableDataSource(this.tasks);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  saveOnLocal() {
    localStorage.removeItem('task');
    localStorage.setItem('task', JSON.stringify(this.tasks));
  }

  getId() {
    let max = 0;
    this.tasks.forEach(element => {
      if (element && max < element.id) {
        max = element.id;
      }
    });
    return max + 1;
  }

  setOrder(column: any) {
    const order = !this.isAscendingOrder;
    this.isAscendingOrder = order;
    switch (column) {
      case ('Id'): {
        this.tasks = this.tasks.sort((t1, t2) => this.compare(t1.id, t2.id, order));
        break;
      }
      case ('Title'): {
        this.tasks = this.tasks.sort((t1, t2) => this.compare(t1.title, t2.title, order));
        break;
      }
      case ('Description'): {
        this.tasks = this.tasks.sort((t1, t2) => this.compare(t1.description, t2.description, order));
        break;
      }
      case ('Status'): {
        this.tasks = this.tasks.sort((t1, t2) => this.compare(t1.status, t2.status, order));
        break;
      }
    }

    this.saveOnLocal();
    this.tableDataSource = new MatTableDataSource(this.tasks);
  }

  compare(a: number | string | Date, b: number | string | Date, order: boolean) {
    return (a < b ? -1 : 1) * (order ? 1 : -1);
  }
}