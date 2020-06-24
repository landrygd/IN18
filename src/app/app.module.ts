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
import { PopoverPage } from './components/top-menu/template-popover.component';


@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    TradFieldComponent,
    TradsGroupComponent,
    PopoverPage
  ],
  entryComponents: [
    
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    CommonModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
