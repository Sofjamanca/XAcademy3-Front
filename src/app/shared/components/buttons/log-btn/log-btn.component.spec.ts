import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogBtnComponent } from './log-btn.component';

describe('LogBtnComponent', () => {
  let component: LogBtnComponent;
  let fixture: ComponentFixture<LogBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
