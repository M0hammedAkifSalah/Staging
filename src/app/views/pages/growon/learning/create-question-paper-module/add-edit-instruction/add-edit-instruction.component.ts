import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kt-add-edit-instruction',
  templateUrl: './add-edit-instruction.component.html',
  styleUrls: ['./add-edit-instruction.component.scss']
})
export class AddEditInstructionComponent implements OnInit {

  @Input() queList

  constructor(private activeModal:NgbActiveModal) { }

  ngOnInit(): void {
  }
  addInstruction(){
    console.log(this.queList);
    this.activeModal.close(this.queList);
  }
}
