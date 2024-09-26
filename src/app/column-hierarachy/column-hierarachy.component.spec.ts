import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnHierarachyComponent } from './column-hierarachy.component';

describe('ColumnHierarachyComponent', () => {
  let component: ColumnHierarachyComponent;
  let fixture: ComponentFixture<ColumnHierarachyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnHierarachyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnHierarachyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
