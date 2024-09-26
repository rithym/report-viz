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
export interface Node{
    name: String,
    cssClass: String,
    image: String,
    title: String,
    childs?: Node[]
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
  selector: 'app-column-hierarachy',
  templateUrl: './column-hierarachy.component.html',
  styleUrls: ['./column-hierarachy.component.scss']
})

export class ColumnHierarachyComponent implements OnInit {
  setHierarchyForm!: FormGroup;
  matcher = new MyErrorStateMatcher();
  @Input() done: any[] = [];
  hierarchyColumns: any[] = [];
  tableData: any[] = [];
  selectLevel: any;
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
    {value: 0, text:'Level 10 or more'}
  ];
  hierarchyParent: any[] = [];
  tableColumns: any[] = [];
  tableKeyField: any[] = [];
  treeData: any[]=[];
  isTreeView: boolean = false;
  selectedDisplayName: any[] = [];
  nodes: any=[];
  constructor(private reportService: ReportService,private fb: FormBuilder) { }

  ngOnInit(): void {
    //this.getColumnHierarchy();
    this.createForm();
    this.SelectedTable();
    this.saveHierarchy();

  }
  createForm() {
    this.setHierarchyForm = this.fb.group({
      selectedDisplayValue: [1,[Validators.required]],
      //selectedKeyField: ['',[Validators.required]],
      selectedDisplayName: [['EmployeeName','Designation'],[Validators.required]],
      selectedViewType: ['Left To Right',[Validators.required]]
      //selectedParentId: ['',[Validators.required]],
      //selectedHierarchyFor: ['',[Validators.required]],
      //selectedHierarchyType: ['',[Validators.required]]
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
  saveHierarchy(){
    console.log('in save function');
    if (!this.setHierarchyForm.valid) {
      console.log('invalidform')
      return;
    }
    // let isFull: boolean = false;
    // if(this.setHierarchyForm.controls['selectedHierarchyType'].value === 'Entire'){
    //   isFull = true;
    // }
    // {
    //   "KeyField": "string",
    //   "DisplayField": "string",
    //   "ParentField": "string",
    //   "TableName": "string",
    //   "IsFullHirarchy": true,
    //   "HirarchyFor": 0,
    //   "isLevel": 0
    // }
    console.log('added level is',this.setHierarchyForm.controls['selectedDisplayValue'].value);
    if(this.setHierarchyForm.controls['selectedDisplayValue'].value == 0){

      alert('Add value for Level');
      //this.setHierarchyForm.controls['selectedDisplayValue'].value = this.selectLevel;
    }
    let data = {
      "KeyField": "id",
      "DisplayField": this.setHierarchyForm.controls['selectedDisplayName'].value.toString(),
      "ParentField": "ParentId",
      "TableName": "employeemaster",
      "IsFullHirarchy": true,
      "HirarchyFor": 7,
      "isLevel": this.setHierarchyForm.controls['selectedDisplayValue'].value
    }
    this.reportService.saveHierarchy(data).subscribe((res: any)=> {
      //this.buildTreeltr(res,data.HirarchyFor);
      console.log('data with parent',res);
      this.treeData = this.buildTree(res, data.HirarchyFor);
      this.nodes = this.buildOrgChart(res);
      console.log('chartHirarchy data', this.nodes);
    })
  }
  onSelectionChange(event: any) {
    let val:any = event.source.value;
    if (event.isUserInput && !event.source._selected && this.selectedDisplayName.includes(val)) {
      this.uncheckDisplayName(event.source.value);
    }
  }
  uncheckDisplayName(uncheckedDisplayValue: any) {
    let check:any = uncheckedDisplayValue;
    if (this.selectedDisplayName.includes(check)) {
      this.selectedDisplayName.splice(this.selectedDisplayName.indexOf(check), 1);
          }
          this.selectedDisplayName.push(uncheckedDisplayValue);
          this.setHierarchyForm.controls['selectedDisplayName'].setValue(this.selectedDisplayName);
    }
    buildTreeltr(data: TreeNode[],parentField: any){
    
    let objc: Node={
      name: '',
      cssClass: 'ngx-org-ceo',
      image: '',
      title: '',
      childs: []
    }
      for (let item of data) {
        if (item.KeyField == parentField) {
          objc.name = item.DisplayValue;
          objc.childs = [];
          this.nodes.push(objc);
        }
       else if(item.ParentField == parentField) {
        let obj :Node={
          name : item.DisplayValue,
          cssClass : 'ngx-org-ceo',
          image : '',
          title :'',
          childs : []
        }
        this.nodes.forEach((column:any)=>{
          obj.name = item.DisplayValue;
          obj.childs = [];
          column.childs.push(obj);
          return;
      });
      this.buildTreeltr(data, item.KeyField);
       console.log('nodes array',this.nodes);
    }
  }
  
}

    buildOrgChart(data: any[]) {
      let orgChart: any[] = [];
      function buildNode(item: any): any {
        let node : any = {
          name: `<b>"${item.DisplayValue}"</b></br>`,
          cssClass: 'ngx-org-ceo',
          image: 'assets/pp.jpg',
          title: '',
          childs: []
        }; 
        const childNodes = data.filter(child => child.ParentField === item.KeyField);
        if (childNodes.length > 0) {
          node.childs = childNodes.map(buildNode);
        }
        return node;
      }
      const rootNodes = data.filter(item => item.level === 1);
      for (const rootNode of rootNodes) {
        orgChart.push(buildNode(rootNode));
      }
      return orgChart;
    }
  
  buildTree(data: TreeNode[], parentField: any): TreeNode[] {
   this.isTreeView  = true;
       const tree: TreeNode[] = [];

    for (let item of data) {

      if (item.KeyField == parentField) {
        item.children = [];
        tree.push(item);
      }
     else if(item.ParentField == parentField){
      tree.forEach((column:any)=>{
        column.children.push(item);
        this.buildTree(data, item.KeyField);
      });
      console.log('tree',tree);
    }
  }
  this.dataSource.data = tree;
  console.log('this is datasource',this.dataSource)
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
