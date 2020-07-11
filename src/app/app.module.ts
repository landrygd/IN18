import { NgModule } from '@angular/core';
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
    BreadcrumbComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    NgxDropzoneModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
