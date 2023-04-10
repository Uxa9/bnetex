import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConditionModalComponent } from './add-condition-modal.component';

describe('AddConditionModalComponent', () => {
  let component: AddConditionModalComponent;
  let fixture: ComponentFixture<AddConditionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddConditionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConditionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
