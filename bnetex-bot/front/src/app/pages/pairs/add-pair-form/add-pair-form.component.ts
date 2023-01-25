import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { PairsService } from 'src/services/pairs.service';

@Component({
  selector: 'app-add-pair-form',
  templateUrl: './add-pair-form.component.html',
  styleUrls: ['./add-pair-form.component.scss']
})
export class AddPairFormComponent {

    public onComplete$ = new Subject();

    public onError$ = new Subject();

    public addForm: FormGroup;

    public isConfirmLoading: BooleanInput = false;

    constructor(private pairService: PairsService, private notify: NzNotificationService){
        this.addForm = new FormGroup({
          name: new FormControl(null, Validators.required)
        })
    }

    ngOnInit(){
      
    }

    public submit(){
      if(!this.addForm.valid) return;

      this.isConfirmLoading = true;

      this.pairService.addPair(this.addForm.value).subscribe((_: any) => {
        this.onComplete$.next(true);
        this.isConfirmLoading = false;
      }, err => {
        this.isConfirmLoading = false;
        this.onError$.next(err);
        this.notify.error('Ошибка', err.error.message)        
      })


    }

}
