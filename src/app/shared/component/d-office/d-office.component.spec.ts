import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DOfficeComponent } from './d-office.component';

describe('DOfficeComponent', () => {
  let component: DOfficeComponent;
  let fixture: ComponentFixture<DOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DOfficeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
