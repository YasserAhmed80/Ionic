import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductDataPage } from './product-details.page';

describe('ProductDataPage', () => {
  let component: ProductDataPage;
  let fixture: ComponentFixture<ProductDataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
