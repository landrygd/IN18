import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { TradFieldComponent } from './components/trad-field/trad-field.component';
import { TradsGroupComponent } from './components/trads-group/trads-group.component';
import { CommonModule } from '@angular/common';
import { PopoverPage } from './components/top-menu/menu-popover/template-popover.component';
import { LanguagesModalPage } from './components/top-menu/languages-modal/languages-modal.component';
import { TreeViewComponent } from './components/tree-view/tree-view.component';
import { UploadModalComponent } from './components/top-menu/upload-modal/upload-modal.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { HttpClientModule } from '@angular/common/http';
import { NewTradModalComponent } from './components/tree-view/new-trad-modal/new-trad-modal.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FolderTreeComponent } from './components/tree-view/folder-tree/folder-tree.component';
import { TradFolderComponent } from './components/trad-folder/trad-folder.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { SettingsModalComponent } from './components/top-menu/settings-modal/settings-modal.component';
import { TranslateModalComponent } from './components/top-menu/translate-modal/translate-modal.component';
import { AboutModalComponent } from './components/top-menu/about-modal/about-modal.component';
import { NgxElectronModule } from 'ngx-electron';

@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    TradFieldComponent,
    TradsGroupComponent,
    PopoverPage,
    LanguagesModalPage,
    TreeViewComponent,
    UploadModalComponent,
    NewTradModalComponent,
    FolderTreeComponent,
    TradFolderComponent,
    BreadcrumbComponent,
    ProgressBarComponent,
    SettingsModalComponent,
    TranslateModalComponent,
    AboutModalComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    NgxDropzoneModule,
    HttpClientModule,
    NgxElectronModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {}
