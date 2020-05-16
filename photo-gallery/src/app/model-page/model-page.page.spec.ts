import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModelPagePage } from './model-page.page';

describe('ModelPagePage', () => {
  let component: ModelPagePage;
  let fixture: ComponentFixture<ModelPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModelPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
