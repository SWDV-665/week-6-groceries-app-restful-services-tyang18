import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Injectable()
export class GroceriesServiceProvider {

  items: any = [];

  dataChanged$ : Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;


  baseURL = "http://localhost:8080"; 

  constructor(public http: HttpClient) {
    console.log('Hello GroceriesServiceProvider Provider');
    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

  getItems(): Observable<object[]> {
    return this.http.get(this.baseURL + '/api/groceries').pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  private extractData(res: Response){
    let body = res;
    return body || {};
  }

  private handleError(error: Response | any){
    let errMsg : string;
    if(error instanceof Response){
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }else{
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }


  //Delete grocery items
  removeItem(item){
    console.log('item ' + item._id + ' has been removed.');
    this.http.delete(this.baseURL+'/api/groceries/'+item._id).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

  //Add item
  addItem(item){
    this.http.post(this.baseURL+'/api/groceries/', item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

  //edit item
  editItem(item, index){
    let id = item._id;
    this.http.put(this.baseURL+'/api/groceries/'+id, item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    });
  }

}

