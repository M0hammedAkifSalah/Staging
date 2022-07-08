import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  classes = [
     { name : '1st',
      id : 1
    },
    { name : '2nd',
      id : 2
    },
    { name : '3rd',
    id : 3
    },
  ]

  section = [
    { name : 'A',
     id : 1
   },
   { name : 'B',
     id : 2
   },
   { name : 'C',
   id : 3
   },
 ]

  selectedclass:any;
  selectedsection:any;
  constructor() { }

  ngOnInit() {
  }

 
}
