import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeComponent } from './we.component';

describe('WeComponent', () => {
  let component: WeComponent;
  let fixture: ComponentFixture<WeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
