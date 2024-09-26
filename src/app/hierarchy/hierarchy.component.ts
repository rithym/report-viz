import { Component, OnInit, Input } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { ReportService } from '../reportService/report.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
export interface TreeNode {
  KeyField: number;
  ParentField: number;
  DisplayValue: string;
  level: number;
  hirarchypath: string;
  children?: TreeNode[];

}
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  item: any;
  level: number;
}
@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent implements OnInit {
  setHierarchyForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  @Input() done: any[] = [];
  hierarchyColumns: any[] = [];
  tableData: any[] = [];
  hierarchyTable: any[] = [
    {value: 1, text:'My Own'},
    {value: 2, text:'Level 2'},
    {value: 3, text:'Level 3'},
    {value: 4, text:'Level 4'},
    {value: 5, text:'Level 5'},
    {value: 6, text:'Level 6'},
    {value: 7, text:'Level 7'},
    {value: 8, text:'Level 8'},
    {value: 9, text:'Level 9'},
    {value: 10, text:'Level 10'},
    {value: 11, text:'Level 10 or more'}
  ];
  hierarchyParent: any[] = [];
  tableColumns: any[] = [];
  tableKeyField: any[] = [];
  treeData: any[]=[];
  isTreeView: boolean = false;

  constructor(private reportService: ReportService,private fb: FormBuilder) { }

  ngOnInit(): void {
    //this.getColumnHierarchy();
    this.createForm();
    this.SelectedTable();

  }
  createForm() {
    this.setHierarchyForm = this.fb.group({
      selectedDisplayName: ['',[Validators.required]],
      selectedViewType: ['',[Validators.required]]
    });


  }
  getColumnHierarchy() {
    console.log('I am in this *****');
    this.reportService.getTableList().subscribe((res: any) => {
        this.tableData= res;
        console.log('table Data',this.tableData);
        for(let t of this.tableData){
           for(let c of t.columnslist){
            if(c.columnName === 'ParentId'){
              this.hierarchyTable.push(t.tablename);
            }
           }
        }
      });
  }
  SelectedTable(){this.reportService.getTableList().subscribe((res: any) => {
    this.tableData= res;
    let val:string = "employeemaster";
    console.log(' Table Datais',this.tableData);
 let selectedTableData = this.tableData.find((column: any)=>(column.tablename === val)).columnslist;
console.log('selected Table Datais',selectedTableData);
      for (let c of selectedTableData){
        if(c.columnType === 'primary_key' ){
           this.tableKeyField.push(c.columnName)
        }
        else if(c.columnName !== 'ParentId') {
            this.hierarchyColumns.push(c.columnName)
        }
        else if(c.columnName === 'ParentId'){
          this.hierarchyParent.push(c.columnName);
        }
      }
    });
}
  saveHierarchy(value:any){
    console.log('in save function');
    if (!this.setHierarchyForm.valid) {
      console.log('invalidform')
      return;
    }
    
    let data = {
      "KeyField": "id",
      "DisplayField": this.setHierarchyForm.controls['selectedDisplayName'].value,
      "ParentField": "ParentId",
      "TableName": "employeemaster",
      "IsFullHirarchy": true,
      "HirarchyFor": 7,
      "isLevel": 0
    }
    this.reportService.saveHierarchy(data).subscribe((res: any)=> {
      this.treeData = this.buildTree(res,  data.HirarchyFor);
    })
  }
  buildTree(data: TreeNode[], parentField: any): TreeNode[] {
   this.isTreeView  = true;
       const tree: TreeNode[] = [];

    for (let item of data) {

      if (item.KeyField == parentField) {
        item.children = [];
        tree.push(item);
        console.log('item in tree',tree)
      }
     else if(item.ParentField == parentField){
      tree.forEach((column:any)=>{
        column.children.push(item);
        this.buildTree(data, item.KeyField);
      });
    }


  }
  this.dataSource.data = tree;
  this.treeControl.expandAll();
  return tree;
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.setHierarchyForm.controls[controlName].hasError(errorName);
  };
    /***Transform Function for Checking Level of Hirarcy and is expandable or not */
    private _transformer = (node: TreeNode, level: number) => {
      return {
        expandable: !!node.children && node.children.length > 0,
        level: level,
        name: node.DisplayValue,
        item: node
      };
    };

    /******Mat Tree Controler For Exisiting Hirarchy Data Source*****/
  treeControl = new FlatTreeControl<ExampleFlatNode>(
  node => node.level,
  node => node.expandable,
  );
  /**********Tree Flatneer Method ******** */
  treeFlattener = new MatTreeFlattener(
  this._transformer,
  node => node.level,
  node => node.expandable,
  node => node.children,

  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
