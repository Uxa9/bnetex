import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { PairsService } from 'src/services/pairs.service';

@Component({
  selector: 'app-add-condition-modal',
  templateUrl: './add-condition-modal.component.html',
  styleUrls: ['./add-condition-modal.component.scss'],
})
export class AddConditionModalComponent {
  public addForm: FormGroup;

  @Input() pair: Number = 0;

  @Input() group: Number = 0;

  @Input() isGroup: Boolean = false;

  public onComplete$ = new Subject();

  public isConfirmLoading: BooleanInput = false;

  public types:any[] = [
    {value: 'ACTIVATION'},
    {value: 'DEACTIVATION'}
  ]

  constructor(
    private pairService: PairsService,
    private notify: NzNotificationService
  ) {
    this.addForm = new FormGroup({
      // name: new FormControl(null, Validators.required),
      type: new FormControl(null, Validators.required),
      zone: new FormControl(null, Validators.required),
      prev: new FormControl(null, Validators.required),
      back: new FormControl(null, Validators.required),
      PATTERNId: new FormControl(this.pair),
      ACTIVEGROUPId: new FormControl(this.group),
      intervals: new FormControl(null, Validators.required),
      sigma: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
    this.addForm.get('PATTERNId')?.setValue(this.pair);
    this.addForm.get('ACTIVEGROUPId')?.setValue(this.group);

    if(this.isGroup){
      this.types = [
        {
          value: 'OPEN'
        },
        {
          value: 'CLOSE'
        }
      ]
    }
  }

  public submit() {
    if (!this.addForm.valid) return;

    this.isConfirmLoading = true;

    // Если добавление не в группу
    if (!this.isGroup) {
      this.pairService
        .addPairCondition({ ...this.addForm.value, ...this.pair })
        .subscribe(
          (_) => {
            this.onComplete$.next(true);
            this.isConfirmLoading = false;
          },
          (err) => {
            this.isConfirmLoading = false;
            this.notify.error('Ошика', err.error.message);
          }
        );
    }else{
      // Если добавление в группу
      this.pairService
        .addGroupCondition(this.addForm.value)
        .subscribe(
          (_) => {
            this.onComplete$.next(true);
            this.isConfirmLoading = false;
          },
          (err) => {
            this.isConfirmLoading = false;
            this.notify.error('Ошика', err.error.message);
          }
        );
    }
  }
}
