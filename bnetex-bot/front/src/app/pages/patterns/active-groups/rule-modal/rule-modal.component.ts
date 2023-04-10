import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { Subject } from 'rxjs';
import { PairsService } from 'src/services/pairs.service';

@Component({
  selector: 'app-rule-modal',
  templateUrl: './rule-modal.component.html',
  styleUrls: ['./rule-modal.component.scss']
})
export class RuleModalComponent {

  public addForm: FormGroup;

  public isConfirmLoading: BooleanInput = false;

  public onComplete$ = new Subject();

  @Input() groupid: Number = 0;

  constructor(private pairs: PairsService){
    this.addForm = new FormGroup({
      // name: new FormControl(null, Validators.required),
      positionIndex: new FormControl(null, Validators.required),
      priceDifferencePercent: new FormControl(0, Validators.required),
      depositPercent: new FormControl(null, Validators.required)
    });
    
  }

  public submit() {
    if (!this.addForm.valid) return;
    this.isConfirmLoading = true;

    this.pairs.addRule({...this.addForm.value, ACTIVEGROUPId:this.groupid}).subscribe(_ => {
      this.isConfirmLoading = false;
      this.onComplete$.next(true)
    })

  }

  ngOnInit(){
    console.log(this.groupid)
  }

}
