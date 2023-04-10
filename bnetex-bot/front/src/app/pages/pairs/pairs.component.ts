import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PairsService } from 'src/services/pairs.service';
import { RestService } from 'src/services/rest.service';

@Component({
  selector: 'app-pairs',
  templateUrl: './pairs.component.html',
  styleUrls: ['./pairs.component.scss']
})
export class PairsComponent {

  public dataSet: any[] = [];

  constructor(private rest: RestService, private pairService: PairsService){}


  public getTradingPairs(){
    this.rest.get('/getTradingPairs').subscribe((_:any) => {
      this.dataSet = _;
    })
  }

  public addNewModal(){
    this.pairService.modalApp().then(e => {
      this.getTradingPairs();
    })
  }

  ngOnInit(){
    this.getTradingPairs();
  }

  public statusUpdate(Status: any, id: any){
    this.rest.post('/updateTradingPair', {Status, id}).subscribe((_:any) => {
      console.log(_)
    })
  }

}
