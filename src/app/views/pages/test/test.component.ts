import { Component, OnInit } from '@angular/core';
import * as Papa from '../../../../../node_modules/papaparse/';
@Component({
  selector: 'kt-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  import(files: File[]){
    if(files[0]){
      Papa.parse(files[0], {
  			header: true,
  			skipEmptyLines: true,
  			complete: (result,file) => {
          console.log(`csv data to send`);
          console.log(result.data);
  			}
  		});
    }
  }
}
