import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabsBarComponent } from './tabs-bar.component';

describe('TabsBarComponent', () => {
  let component: TabsBarComponent;
  let fixture: ComponentFixture<TabsBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsBarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
