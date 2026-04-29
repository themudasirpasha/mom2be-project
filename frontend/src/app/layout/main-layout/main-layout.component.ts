import { Component, OnInit } from "@angular/core";
import { LocalizationService } from "../../core/services/localization.service";

@Component({ selector: "app-main-layout", templateUrl: "./main-layout.component.html", styleUrls: ["./main-layout.component.css"] })
export class MainLayoutComponent implements OnInit {
  constructor(private localization: LocalizationService) {}

  ngOnInit(): void {
    this.localization.applyLanguage();
  }
}
