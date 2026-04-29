import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { SharedModule } from "./shared/shared.module";
import { InterceptorService } from "./core/services/interceptor.service";

@NgModule({
  declarations: [AppComponent, MainLayoutComponent],
  imports: [BrowserModule, HttpClientModule, SharedModule, AppRoutingModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
})
export class AppModule {}
