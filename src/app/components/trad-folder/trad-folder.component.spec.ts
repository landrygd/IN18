import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TradFolderComponent } from './trad-folder.component';

describe('TradFolderComponent', () => {
  let component: TradFolderComponent;
  let fixture: ComponentFixture<TradFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradFolderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TradFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
