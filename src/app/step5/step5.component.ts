import { Component, OnInit } from '@angular/core';
import {NavbarService} from "../services/navbar.service";
import {RemoteService} from "../services/remote.service";
import {AlertService} from "../services/alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.scss']
})
export class Step5Component implements OnInit {
  ordersLeft: String = "...";
  orderReady: boolean = false;

  constructor(
    private NavbarService: NavbarService, 
    private remoteService: RemoteService, 
    private router: Router,
    private alertService: AlertService,
    
  ) {}

  ngOnInit() {
    this.NavbarService.setStep(5);

    let source = new EventSource('http://localhost/AGBooks_NEU/api/?queue');
    source.addEventListener('update', (message) => {
      //console.log(message);
      //@ts-ignore
      let data = JSON.parse(message.data);   
      
      this.ordersLeft = data.ordersLeft;
      this.orderReady = data.orderReady;
    });    
 }
 previous() {
   this.router.navigate(["step", "4"]);
 }
 

}
