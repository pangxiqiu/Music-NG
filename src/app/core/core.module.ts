import {NgModule, Optional, SkipSelf} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from '../app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ServicesModule} from '../services/services.module';
import {PagesModule} from '../pages/pages.module';
import {ShareModule} from '../share/share.module';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import {IndexStoreModule} from '../store/index.store.module';

registerLocaleData(zh);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServicesModule,
    PagesModule,
    ShareModule,
    IndexStoreModule,
    AppRoutingModule,
  ],
  exports: [
    ShareModule,
    AppRoutingModule
  ]
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('coreModule 只能被appModule引入');
    }
  }
}
