import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute) { }
  total = {};

  ngOnInit() {
    // This will gather the things from calculation function
    this.total = JSON.parse(localStorage.getItem('calculation'));
  }

}
