import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from './menu';
import { SuperAdminMenuItem } from './superAdminMenu';
import { TmiAdminMenuItem } from './tmiAdminMenu';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  panelOpenState = false;
  MenuItems?: MenuItem = new MenuItem();
  userType: string = '';
  menuList: any = [];
  masterMenu: any;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.getMenuList();
  }

  navigateToModule(link: any,screen:any, moduleName: any) {
   console.log('link: ', link,screen, moduleName);
   this.router.navigate([link, moduleName, screen]);
  }

  getMenuList() {
    this.menuList = ['a','b']
    console.log('this.menuList: ', this.menuList);
  }
}
