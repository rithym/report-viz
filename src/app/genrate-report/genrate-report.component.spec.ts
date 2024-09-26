import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenrateReportComponent } from './genrate-report.component';

describe('GenrateReportComponent', () => {
  let component: GenrateReportComponent;
  let fixture: ComponentFixture<GenrateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenrateReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenrateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
