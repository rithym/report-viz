import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, copyArrayItem, transferArrayItem } from '@angular/cdk/drag-drop';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  public done: any[] = [];
  public selectedTableName: any;
  public editData: any;
  constructor( private http: HttpClient,private authSer: AuthenticationService) {
   }
  public drop(event: CdkDragDrop<any>) {
    console.log('dropped item', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
    copyArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    }
    // this.done.forEach((element) => {
    //   if (!this.selectedTables.includes(element.tableName)) {
    //     this.selectedTables.push(element.tableName);
    //   }
   // });
  }
 // baseUrl:any = "http://localhost:8000"
    baseUrl: any =environment.apiUrl
  // baseUrl: any = "https://be-reportvisualization.dev.elixirhr.com"

  getTableList() {

   // ${this.baseUrl}+"/Reportdb/GetListOfTablesandColumns
    //return this.http.get(`${this.baseUrl}+"/Reportdb/GetListOfTables`).pipe(
    return this.http.get(`${this.baseUrl}/Reportdb/GetListOfTablesandColumns`).pipe(
      map((res: any) => {
        console.log('response is',res);
        return res;
      })
    );
  }
//Get Selected Table Columns
getTableColumn(tableName:string) {

  return this.http.get(`${this.baseUrl}/Reportdb/GetColumnDetails${tableName}`).pipe(
    map((res: any) => {
      console.log('response is',res);
      return res;
    })
  );
}
//Get All Operators
getAllOperators() {

  return this.http.get(`${this.baseUrl}/Reportdb/GetListOfOperators`).pipe(
    map((res: any) => {
      console.log('response is',res);
      return res;
    })
  );
}

//Get All Saved Reports
getAllSavedReports() {

  return this.http.get(`${this.baseUrl}/Reportdb/GetListOfReports`).pipe(
    map((res: any) => {
      console.log('response is',res);
      return res;
    })
  );
}

//Genrate Report with added rules
addReport(data:any) {

  return this.http.post(`${this.baseUrl}/Reportdb/SaveReport`,data).pipe(
    map((res: any) => {
      console.log('response is',res);
      return res;
    })
  );
}

//Genrate Table with added report
genrateTable(data:any) {

  return this.http.post(`${this.baseUrl}/Reportdb/SearchDataByFilters`,data).pipe(
    map((res: any) => {
      console.log('response is',res);
      return res;
    })
  );
}

//Get Set of Rules with selected report name
getSelectedReport(reportId:number) {

  return this.http.get(`${this.baseUrl}/Reportdb/GetreportData${reportId}`).pipe(
    map((res: any) => {
      console.log('response is',res);
      return res;
    })
  );
}

//Get List of Hierarchy
getListOfHierarchy(){

  return this.http.get(`${this.baseUrl}/Reportdb/GetListOfHirarchyColumns`).pipe(
    map((res: any) => {
      return res;
    })
  );
}
//Save Hierarchy
saveHierarchy(data: any){

  return this.http.post(`${this.baseUrl}/Reportdb/saveHirarchy`,data).pipe(
    map((res: any) => {
      console.log('response is',res);
      return res;
    })
  );
}

//sending the Json to get the chart res
getChartData(data:any) {

  return this.http.post(`${this.baseUrl}/Reportdb/getChartResult`,data).pipe(
    map((res: any) => {
      console.log('response is',res);
      return res;
    })
  );
}

//sending the Json to get the chart res
saveChartData(data:any) {

  return this.http.post(`${this.baseUrl}/Reportdb/saveChart`,data).pipe(
    map((res: any) => {
      console.log('response is',res);
      return res;
    })
  );
}

}

