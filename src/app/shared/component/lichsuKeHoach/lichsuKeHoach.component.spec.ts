import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LichsuKeHoachComponent } from './lichsuKeHoach.component';

describe('LichsuKeHoachComponent', () => {
  let component: LichsuKeHoachComponent;
  let fixture: ComponentFixture<LichsuKeHoachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LichsuKeHoachComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LichsuKeHoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
