import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kt-print-confirmation',
  templateUrl: './print-confirmation.component.html',
  styleUrls: ['./print-confirmation.component.scss']
})
export class PrintConfirmationComponent implements OnInit {
  @Input() totalQuestion
  constructor(private activeModal:NgbActiveModal) { }

  ngOnInit(): void {
  }

  printQuestion(value){
    this.activeModal.close(value)
  }

}
