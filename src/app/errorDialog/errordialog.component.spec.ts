import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodatadialogComponent } from './nodatadialog.component';

describe('NodatadialogComponent', () => {
  let component: NodatadialogComponent;
  let fixture: ComponentFixture<NodatadialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodatadialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodatadialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
