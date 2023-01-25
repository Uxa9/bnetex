import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RestService } from 'src/services/rest.service';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { ru_RU } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { PairsComponent } from './pages/pairs/pairs.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AddPairFormComponent } from './pages/pairs/add-pair-form/add-pair-form.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { PatternsComponent } from './pages/patterns/patterns.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AddConditionModalComponent } from './pages/patterns/add-condition-modal/add-condition-modal.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ActiveGroupsComponent } from './pages/patterns/active-groups/active-groups.component';



registerLocaleData(ru);

@NgModule({
  declarations: [
    AppComponent,
    PairsComponent,
    AddPairFormComponent,
    PatternsComponent,
    AddConditionModalComponent,
    ActiveGroupsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzTableModule,
    NzDividerModule,
    NzSwitchModule,
    NzButtonModule,
    NzPageHeaderModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormModule,
    NzNotificationModule,
    NzGridModule, 
    NzCardModule,
    NzListModule,
    NzIconModule,
    NzSelectModule,
    NzPopconfirmModule,
    NzSpinModule,
    NzTagModule
  ],
  providers: [RestService, { provide: NZ_I18N, useValue: ru_RU }],
  bootstrap: [AppComponent]
})
export class AppModule { }
