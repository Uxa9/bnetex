import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternsComponent } from './patterns.component';

describe('PatternsComponent', () => {
  let component: PatternsComponent;
  let fixture: ComponentFixture<PatternsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
