// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';

@Injectable()
export class MenuAsideService {
  // Public properties
  menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  /**
   * Service constructor
   *
   * @param menuConfigService: MenuConfigService
   */
  constructor(private menuConfigService: MenuConfigService) {
    this.loadMenu();
  }

  /**
   * Load menu list
   */
   loadMenu() {

    // get menu list
    const menuItems: any[] = objectPath.get(this.menuConfigService.getMenus(), 'aside.items');
    //Creating New Array with Features that are Enabled
   const finalMenu : any[] = []
    for (let i=0;i<menuItems.length;i++){
      if(menuItems[i].isEnabled){
        let item = menuItems[i]
        finalMenu.push(item)
           for(let j=0;j<menuItems.length;j++){
              for(let k=0;k<menuItems[j].submenu.length;k++){
                 let submenuItems = menuItems[j].submenu[k];
                
                 if(!submenuItems.isEnabled){
                   
                 menuItems[j].submenu.splice(k,1)

           }
          }
          
        }
       }
      }

     
      this.menuList$.next(finalMenu);
     

    
  }
}
