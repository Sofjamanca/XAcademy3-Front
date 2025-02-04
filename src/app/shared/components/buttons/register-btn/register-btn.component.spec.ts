import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBtnComponent } from './register-btn.component';

describe('RegisterBtnComponent', () => {
  let component: RegisterBtnComponent;
  let fixture: ComponentFixture<RegisterBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
