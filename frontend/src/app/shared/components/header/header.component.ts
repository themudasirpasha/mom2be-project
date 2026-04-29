import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  showUserActions = false;
  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateHeaderState(this.router.url);
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateHeaderState(event.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  getProfileName(): string {
    return localStorage.getItem("mother_name") || "Profile";
  }

  getProfileInitial(): string {
    return this.getProfileName().trim().charAt(0).toUpperCase() || "M";
  }

  private updateHeaderState(url: string): void {
    const normalizedUrl = (url || "").split("?")[0];
    const hideOnRoutes = new Set(["", "/", "/register"]);
    const hasSession = !!localStorage.getItem("session_id");
    const hasMotherName = !!localStorage.getItem("mother_name");

    this.showUserActions = !hideOnRoutes.has(normalizedUrl) && hasSession && hasMotherName;
  }
}
