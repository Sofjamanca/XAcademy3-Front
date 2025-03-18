import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatesDowComponent } from './certificates-dow.component';

describe('CertificatesDowComponent', () => {
  let component: CertificatesDowComponent;
  let fixture: ComponentFixture<CertificatesDowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificatesDowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificatesDowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
