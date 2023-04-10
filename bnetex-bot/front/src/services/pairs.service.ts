import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AddPairFormComponent } from 'src/app/pages/pairs/add-pair-form/add-pair-form.component';
import { AddConditionModalComponent } from 'src/app/pages/patterns/add-condition-modal/add-condition-modal.component';
import { RuleModalComponent } from 'src/app/pages/patterns/active-groups/rule-modal/rule-modal.component';

@Injectable({
  providedIn: 'root'
})
export class PairsService {

  constructor(private rest: RestService, private modal: NzModalService) { }

  public modalApp(){
    return new Promise((res, rej) => {
      const modalRef = this.modal.create({
        nzTitle: 'Новая торговая пара',
        nzContent: AddPairFormComponent,            
        nzClosable: true,      
        //nzOnOk: () => console.log('Click ok')
        nzFooter: null
      });
  
      modalRef.getContentComponent().onComplete$.subscribe(_ => {
        res(_);
        modalRef.close();
      });
    })
    
  }

  public addConditionModal(pair: Number){
    return new Promise((res, rej) => {
      const modalRef = this.modal.create({
        nzTitle: 'New Pattern Condition',
        nzContent: AddConditionModalComponent,            
        nzClosable: true,              
        nzComponentParams: {
          pair
        },
        nzFooter: null
      });
  
      modalRef.getContentComponent().onComplete$.subscribe(_ => {
        res(_);
        modalRef.close();
      });
    })
  }


  public addRuleModal(groupid: Number){
    return new Promise((res, rej) => {
      const modalRef = this.modal.create({
        nzTitle: 'New Group Rule',
        nzContent: RuleModalComponent,            
        nzClosable: true,              
        nzComponentParams: {
          groupid
        },
        nzFooter: null
      });
  
      modalRef.getContentComponent().onComplete$.subscribe(_ => {
        res(_);
        modalRef.close();
      });
    })
  }


  public addConditioGroupnModal(group: Number){
    return new Promise((res, rej) => {
      const modalRef = this.modal.create({
        nzTitle: 'New Pattern Condition',
        nzContent: AddConditionModalComponent,            
        nzClosable: true,              
        nzComponentParams: {
          group,
          isGroup: true
        },
        nzFooter: null
      });
  
      modalRef.getContentComponent().onComplete$.subscribe(_ => {
        res(_);
        modalRef.close();
      });
    })
  }

  public addPair(params: any){
    return this.rest.post('/appTradingPair',params)
  }

  public addRule(params:any){
    return this.rest.post(`/addRule`, params)
  }

  public addPairCondition(params: any){
    return this.rest.post('/addPairCondition', params)
  }

  public addGroupCondition(params:any){
    return this.rest.post('/addGroupCondition', params)
  }

  public removePairCondition(id: any, isGroup: Boolean = false){
    if(!isGroup){
      return this.rest.post('/removePairCondition', {id})
    }else{
      return this.rest.post('/removeGroupCondition', {id})
    }
    
  }

  public getPatternsGroups(id: any){
    return this.rest.get(`/getPatterGroups/${id}`)
  }

  public removeRule(id: any){
    return this.rest.post('/removeRule', {id})
  }

}
