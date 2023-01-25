import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import { PairsService } from 'src/services/pairs.service';

@Component({
  selector: 'app-active-groups',
  templateUrl: './active-groups.component.html',
  styleUrls: ['./active-groups.component.scss']
})
export class ActiveGroupsComponent {

  public isLoading: BooleanInput = false;

  public activeGroups: any[] = [];

  constructor(private pairs: PairsService, private route:ActivatedRoute){
      this.getPatternsGroups();
  }

  public getPatternsGroups(){
    this.isLoading = true;
    this.pairs.getPatternsGroups(this.route.snapshot.params['AGID']).subscribe((e:any) => {
      console.log(e);
      this.activeGroups = e;
      this.isLoading = false;
    })
  }

  public openConditionModal(id: number){
    this.pairs.addConditioGroupnModal(id).then(e => {
      this.getPatternsGroups();
    })
  }

  public removeCondition(id:number){
    this.isLoading = true;
    this.pairs.removePairCondition(id, true).subscribe(_ => {
      this.isLoading = false;
      this.getPatternsGroups();
    })
  }

  public sortByIntervals(TRIGGERS: any[]){
    return [...TRIGGERS.sort((a,b) => b.intervals - a.intervals).filter(i => i.type == 'OPEN'), ...TRIGGERS.sort((a,b) => b.intervals - a.intervals).filter(i => i.type == 'CLOSE')];
  }

}
