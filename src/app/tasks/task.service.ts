import { Task } from './task';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }
  mockServerEnpointUrl = 'http://localhost:3000/0';

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.mockServerEnpointUrl)
      .pipe(
        // timeout(3000),
        catchError(e => {
          //try again after 3 seconds
          return this.callAgain(3000);
        })
      )
  }

  // try to call again after 3 seconds
  callAgain(seconds: number): Observable<Task[]> {

    const start = Date.now();
    while ((Date.now() - start) < seconds) {
      window.console.log('wait ' + seconds + " miliseconds");
    }

    return this.http.get<Task[]>(this.mockServerEnpointUrl)
      .pipe(
        catchError(e => {
          return this.getDefaultListIfMockServerNotRespond();
        })
      )
  }

  getDefaultListIfMockServerNotRespond(): Observable<Task[]> {

    //try to read from old session, if exist
    const sessionInfo = localStorage.getItem('task');
    if (sessionInfo) {
      const existingTaskList = JSON.parse(sessionInfo);
      if (existingTaskList) {
        return of(<Task[]>JSON.parse(JSON.stringify(existingTaskList)));
      }
    }

    const tasks: Task[] = [
      { id: 1, title: "post a job ad", description: "publish a job ad with a job description", status: "Done" },
      { id: 2, title: "select eligible candidates", description: "select only suitable candidates who match job description", status: "In Progress" },
      { id: 3, title: "load candidates list", description: "all candidates cv must be send on email to manager", status: "To Do" },
      { id: 4, title: "choose the candidate", description: "choose the proper candidates for the role", status: "To Do" }
    ];

    return of(tasks);
  }
}