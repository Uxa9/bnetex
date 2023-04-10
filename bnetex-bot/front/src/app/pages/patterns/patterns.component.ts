import { Component } from '@angular/core';
import { RestService } from 'src/services/rest.service';
import {ActivatedRoute} from '@angular/router';
import { PairsService } from 'src/services/pairs.service';
import { BooleanInput } from 'ng-zorro-antd/core/types';


@Component({
  selector: 'app-patterns',
  templateUrl: './patterns.component.html',
  styleUrls: ['./patterns.component.scss']
})
export class PatternsComponent {

  public tradingPatterns: any[] = []

  public pairValue: any;

  public isLoading: BooleanInput = false;

  constructor(private restService: RestService, private route:ActivatedRoute, private pair: PairsService){
    this.pairValue = this.route.snapshot.params['PAIR'];
  }

  ngOnInit(){
    

    this.getPatterns();
    
  }

  public getPatterns(){
    this.isLoading = true;
    this.restService.get(`/getTradingPatterns/${this.pairValue}`).subscribe((_:any) => {      
      this.tradingPatterns = _.reverse();
      this.isLoading = false;
    })

  }

  public openConditionModal(id: number){
    this.pair.addConditionModal(id).then(e => {
      this.getPatterns();
    })
  }

  public removeCondition(id: number){
    this.isLoading = true;
    this.pair.removePairCondition(id).subscribe(e => {
      this.getPatterns();      
    })

  }

  public sortByIntervals(TRIGGERS: any[]){
    return [...TRIGGERS.sort((a,b) => b.intervals - a.intervals).filter(i => i.type == 'ACTIVATION'), ...TRIGGERS.sort((a,b) => b.intervals - a.intervals).filter(i => i.type == 'DEACTIVATION')];
  }

}
