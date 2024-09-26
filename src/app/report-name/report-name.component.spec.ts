import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportNameComponent } from './report-name.component';

describe('ReportNameComponent', () => {
  let component: ReportNameComponent;
  let fixture: ComponentFixture<ReportNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
