import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelausuariosComponent } from './telausuarios.component';

describe('TelausuariosComponent', () => {
  let component: TelausuariosComponent;
  let fixture: ComponentFixture<TelausuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelausuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TelausuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
