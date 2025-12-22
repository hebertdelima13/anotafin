import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthsComponent } from './months.component';

describe('MonthsComponent', () => {
  let component: MonthsComponent;
  let fixture: ComponentFixture<MonthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
