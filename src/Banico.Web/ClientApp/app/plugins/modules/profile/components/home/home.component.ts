﻿import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Profile } from "../../entities/profile";
import { ProfileService } from "../../services/profile.service";
import { AuthService } from "../../../../../shared/services/auth.service";

@Component({
  selector: "app-plugins-profile-home",
  templateUrl: "./home.component.html"
})
export class ProfileHomeComponent implements OnInit {
  public profile: Profile;
  private sub: any;
  public canEdit: boolean;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.profile = new Profile(null);
    this.sub = this.route.params.subscribe(params => {
      var alias = params["alias"];
      if (!alias) {
        alias = this.authService.getUserName();
      }
      if (this.authService.isAdmin() || this.authService.getUserName == alias) {
        this.canEdit = true;
      }
      this.profileService
        .getByAlias(alias)
        .subscribe(profile => (this.profile = profile));
    });
  }
}
