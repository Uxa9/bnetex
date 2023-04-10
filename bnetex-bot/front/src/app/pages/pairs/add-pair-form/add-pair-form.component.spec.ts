import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPairFormComponent } from './add-pair-form.component';

describe('AddPairFormComponent', () => {
  let component: AddPairFormComponent;
  let fixture: ComponentFixture<AddPairFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPairFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPairFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
