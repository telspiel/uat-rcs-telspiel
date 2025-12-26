import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringsectionComponent } from './monitoringsection.component';

describe('MonitoringsectionComponent', () => {
  let component: MonitoringsectionComponent;
  let fixture: ComponentFixture<MonitoringsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringsectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
