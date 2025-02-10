import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesCardsComponent } from './courses-cards.component';

describe('CoursesCardsComponent', () => {
  let component: CoursesCardsComponent;
  let fixture: ComponentFixture<CoursesCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoursesCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
