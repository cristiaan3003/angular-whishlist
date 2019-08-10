import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropagadorComponent } from './propagador.component';

describe('PropagadorComponent', () => {
  let component: PropagadorComponent;
  let fixture: ComponentFixture<PropagadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropagadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropagadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
