// Angular
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// RxJS
import { Observable, Subscription } from 'rxjs';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import { LayoutConfigService, MenuConfigService, PageConfigService } from '../../../core/_base/layout';
import { HtmlClassService } from '../html-class.service';
import { LayoutConfig } from '../../../core/_config/layout.config';
import { MenuConfig } from '../../../core/_config/menu.config';
import { PageConfig } from '../../../core/_config/page.config';
// User permissions
import { NgxPermissionsService } from 'ngx-permissions';
import { currentUserPermissions, Permission } from '../../../core/auth';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../core/reducers';
import { CreateservicesService } from '../../pages/growon/create/services/createservices.service';

@Component({
  selector: 'kt-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit, OnDestroy {
  //Update Check
  newUpdate: boolean = false;

  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: true;
  contentClasses = '';
  contentContainerClasses = '';
  subheaderDisplay = false;
  contentExtended: false;

  // Private properties
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private currentUserPermissions$: Observable<Permission[]>;


  /**
   * Component constructor
   *
   * param layoutConfigService: LayoutConfigService
   * param menuConfigService: MenuConfigService
   * param pageConfigService: PageConfigService
   * param htmlClassService: HtmlClassService
   * param store
   * param permissionsService
   */
  constructor(
    private layoutConfigService: LayoutConfigService,
    private menuConfigService: MenuConfigService,
    private pageConfigService: PageConfigService,
    private htmlClassService: HtmlClassService,
    private store: Store<AppState>,
    private permissionsService: NgxPermissionsService,
    private apiService: CreateservicesService

  ) {
    const isAdmin = localStorage.getItem('schoolId') ? false : true;

    this.loadRolesWithPermissions();
    // Edit
    let config = new MenuConfig().configs;
    let previlageObj = JSON.parse(localStorage.getItem('info')).user_info[0].profile_type.privilege;
    let previlageArray = Object.keys(previlageObj).map(key => ({ type: key, value: previlageObj[key] }));
    let actualPrevilage = [];
    previlageArray.forEach(array => {
      if (!array.value) {
        actualPrevilage.push(array.type)
      }
    });
    // for (let index = 0; index < config.aside.items.length; index++) {
    //   for (let i = config.aside.items[index].submenu.length - 1; i >= 0; i--) {
    //     if (actualPrevilage.includes(config.aside.items[index].submenu[i].role)) {
    //       config.aside.items[index].submenu.splice(i, 1);
    //       console.log(config.aside.items[index].submenu)
    //     }
    //   }
    // }
    console.log('config => ', config);
    console.log('config before', config);
    // for(let i = 0; config.aside.items.length; i++){
    //   if(!config.aside.items[i].forAdmin){
    //     config.aside.items.splice(i, 1);
    //   }
    // } 
    // console.log('config after',config);
    let adminMenu = [];
    let userMenu = [];
    config.aside.items.forEach((el) => {
      if (el.forAdmin) {
        adminMenu.push(el);
      }
      if (el.forUser) {
        userMenu.push(el);
      }
    });

    if(isAdmin){
      config.aside.items = adminMenu;
    }else{
      config.aside.items = userMenu;
    }
    /* console.log('adminMenus after loop',adminMenus);
    //  role: 'view_question'
    for (let index = 0; index < config.aside.items.length; index++) {
      for (let i = 0; i < config.aside.items[index].submenu.length; i++) {
        console.log(config.aside.items[index].submenu[i].role)
        if (config.aside.items[index].submenu[i].role == 'view_question') {
          config.aside.items[index].submenu.splice(i, 1);
        }
      }
    }
    console.log() */
    // register configs by demos
    // setTimeout(() => {

    this.layoutConfigService.loadConfigs(new LayoutConfig().configs);
    // this.menuConfigService.loadConfigs(config);
    // Edit ends
    // register configs by demos
    this.layoutConfigService.loadConfigs(new LayoutConfig().configs);
    this.menuConfigService.loadConfigs(config);
    this.pageConfigService.loadConfigs(new PageConfig().configs);

    // setup element classes
    this.htmlClassService.setConfig(this.layoutConfigService.getConfig());

    const subscription = this.layoutConfigService.onConfigUpdated$.subscribe(layoutConfig => {
      // reset body class based on global and page level layout config, refer to html-class.service.ts
      document.body.className = '';
      this.htmlClassService.setConfig(layoutConfig);
    });
    this.unsubscribe.push(subscription);
    let userType = localStorage.getItem('designation');
    // this.menuConfigService.menuConfig.aside.items = userType && userType == 'Admin' ? adminMenu : userMenu;
    // if (userType && userType == 'Admin') {
    //   this.menuConfigService.menuConfig.aside.items = adminMenu;
    // } else {
    //   this.menuConfigService.menuConfig.aside.items = userMenu;
    // }
    this.getNewUpdate();
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * On init
   */
  ngOnInit(): void {
    const config = this.layoutConfigService.getConfig();
    // Load UI from Layout settings
    this.selfLayout = objectPath.get(config, 'self.layout');
    this.asideSelfDisplay = objectPath.get(config, 'aside.self.display');
    this.subheaderDisplay = objectPath.get(config, 'subheader.display');
    this.contentClasses = this.htmlClassService.getClasses('content', true).toString();
    this.contentContainerClasses = this.htmlClassService.getClasses('content_container', true).toString();
    this.contentExtended = objectPath.get(config, 'content.extended');
    // Edit
    // let config = new MenuConfig().configs;
    // console.log('config => ',config);
    // Edit ends
    // let the layout type change
    const subscription = this.layoutConfigService.onConfigUpdated$.subscribe(cfg => {
      setTimeout(() => {
        this.selfLayout = objectPath.get(cfg, 'self.layout');
      });
    });
    this.unsubscribe.push(subscription);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.unsubscribe.forEach(sb => sb.unsubscribe());
    // https://www.npmjs.com/package/ngx-permissions
    this.permissionsService.flushPermissions();
  }

  /**
   * NGX Permissions, init roles
   */
  loadRolesWithPermissions() {
    this.currentUserPermissions$ = this.store.pipe(select(currentUserPermissions));
    const subscription = this.currentUserPermissions$.subscribe(res => {
      if (!res || res.length === 0) {
        return;
      }

      this.permissionsService.flushPermissions();
      res.forEach((pm: Permission) => this.permissionsService.addPermission(pm.name));
    });
    this.unsubscribe.push(subscription);
  }
  // To Update the newUpdate to False
  refreshPage() {

    let data = {
      newUpdate: false
    }
    this.apiService.updateSchool(data, localStorage.getItem('schoolId')).subscribe((res: any) => {
      console.log(res);
    })

    setTimeout(() => {
      window.location.reload();
    }, 2000)
  }
  // Get newUpdate Property
  getNewUpdate() {
    this.apiService.getSchool(localStorage.getItem('schoolId')).subscribe((res: any) => {
      this.newUpdate = res.body.data[0].newUpdate;
      console.log('School Data', res.body.data[0])
    })
  }

}
