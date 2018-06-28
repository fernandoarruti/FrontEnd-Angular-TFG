import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablestatsComponent } from './tablestats.component';

describe('TablestatsComponent', () => {
  let component: TablestatsComponent;
  let fixture: ComponentFixture<TablestatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablestatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablestatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
