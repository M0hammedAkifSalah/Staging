import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kt-import-confirmation',
  templateUrl: './import-confirmation.component.html',
  styleUrls: ['./import-confirmation.component.scss']
})
export class ImportConfirmationComponent implements OnInit {
  @Input() questionCount;
  totalQuestion:number=0;
  constructor(private activeModal:NgbActiveModal) { }

  ngOnInit(): void {
    this.questionCount.forEach(element => {
      this.totalQuestion+=element.selectCount;
    });
  }

  backToSelectQuestion(){
    this.activeModal.close("back")
  }
  confirmToImport(){
    this.activeModal.close("confirm")
  }
}
