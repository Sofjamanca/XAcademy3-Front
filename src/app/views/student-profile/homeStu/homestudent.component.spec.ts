import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStudentComponent } from './homestudent.component';

describe('HomeComponent', () => {
  let component: HomeStudentComponent;
  let fixture: ComponentFixture<HomeStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});