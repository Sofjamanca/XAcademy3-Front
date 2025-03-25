import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceStudentComponent } from './attendance-student.component';

describe('AttendanceStudentComponent', () => {
  let component: AttendanceStudentComponent;
  let fixture: ComponentFixture<AttendanceStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
