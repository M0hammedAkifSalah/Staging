import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kt-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})
export class TestComponentComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit(): void {
	console.log('in test component',this.data)
  }

}
