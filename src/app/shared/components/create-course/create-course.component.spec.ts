import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCourseComponent } from './create-course.component';

describe('CreateCourseComponent', () => {
  let component: CreateCourseComponent;
  let fixture: ComponentFixture<CreateCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
