import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NavbarService } from '../services/navbar.service';

@Injectable({
  providedIn: 'root'
})
export class StepResolvedCheckGuard implements CanActivate {
  constructor(private navbarService: NavbarService, private router: Router) { }
  allowedMoves = [
    { where: 0, allowed: [1] },
    { where: 1, allowed: [2] },
    { where: 2, allowed: [1, 3] },
    { where: 3, allowed: [2, 4] },
    { where: 4, allowed: [3, 5] },
    { where: 5, allowed: [6] },
    { where: 6, allowed: [7] },
    { where: 7, allowed: [] },
  ]
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (next.url[0].path == "takeover" || next.url[0].path == "handover") { // ich will zu handover / takeover
      return true;
    } else if (next.url[0].path == "step") { // ich will zu einem Schritt

      if (this.allowedMoves.filter(move => this.navbarService.currentStep == move.where)[0].allowed.includes(parseInt(next.url[1].path)) || this.navbarService.highestStep == parseInt(next.url[1].path)) {
        return true;
      } else {
        console.log("highest Step: ", this.navbarService.highestStep);
        this.router.navigate(["step", this.navbarService.highestStep]);
        return false;
      }
    }
    return true;



  }

}
