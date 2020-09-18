import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MlResultComponent } from './ml-result.component';

describe('MlResultComponent', () => {
  let component: MlResultComponent;
  let fixture: ComponentFixture<MlResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MlResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MlResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
