import { HttpClientModule } from '@angular/common/http';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './pages/home/home.component';
import { HomeModule } from './pages/home/home.module';
import { PagesModule } from './pages/pages.module';
import { ServicesModule } from './services/services.module';
import { ShareModule } from './share/share.module';
import { AppStoreModule } from './store';


// @Component({
//   selector: 'app-home',
//   template: ''
// })
// class HomeComponent {

// }

@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent {
}

fdescribe('AppComponent', () => {
  let app;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CoreModule,
        HomeModule
      ],
      declarations: [
        AppComponent,
        // RouterOutletStubComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents()
  }));

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    console.log(app.title)
    expect(app).toBeTruthy();
  });
});
