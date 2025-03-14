import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentManagementComponent } from './payment-management.component';

describe('PaymentManagementComponent', () => {
  let component: PaymentManagementComponent;
  let fixture: ComponentFixture<PaymentManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
