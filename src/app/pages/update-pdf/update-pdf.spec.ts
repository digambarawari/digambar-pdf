import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePdf } from './update-pdf';

describe('UpdatePdf', () => {
  let component: UpdatePdf;
  let fixture: ComponentFixture<UpdatePdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePdf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePdf);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
