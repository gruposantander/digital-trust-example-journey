import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificatonsComponent } from './notificatons.component';

describe('NotificatonsComponent', () => {
  let component: NotificatonsComponent;
  let fixture: ComponentFixture<NotificatonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificatonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificatonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
