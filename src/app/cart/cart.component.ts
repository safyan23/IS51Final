import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface IBikes {
  id: number;
  image: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  bikes: Array<IBikes> = [];
  nameParams = '';
  params: string;
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    const bikes = JSON.parse(localStorage.getItem('bikes'));
    if (bikes && bikes.length > 0) {
      this.bikes = bikes;
    } else {
      this.bikes = await this.loadBikesFromJSON();
    }
  }

  async loadBikesFromJSON() {
    const bikes = await this.http.get('assets/inventory.json').toPromise();
    return bikes.json();
  }

  saveLater() {
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
    this.toastService.showToast('success', 3000, 'Success: Items Saved Successfully!');
  }

  removeItem(index: number) {
    this.bikes.splice(index, 1);
    localStorage.setItem('bikes', JSON.stringify(this.bikes));
  }

  addBike(bike: string) {
    switch (bike) {
      case 'model1':
        this.bikes.push({
          'id': 1,
          'image': '../../assets/bike1.jpeg',
          'description': 'Bike Model 1',
          'price': 5000,
          'quantity': 1
        });
        break;
      case 'model2':
        this.bikes.push({
          'id': 2,
          'image': '../../assets/bike2.jpeg',
          'description': 'Bike Model 2',
          'price': 4000,
          'quantity': 2
        });
        break;
      case 'model3':
        this.bikes.push({
          'id': 3,
          'image': '../../assets/bike3.jpeg',
          'description': 'Bike Model 3',
          'price': 3000,
          'quantity': 3
        });
        break;
    }
  }

  checkOut() {
    const total = this.calculation();
    if (this.nameParams === '') {
      this.toastService.showToast('warning', 3000, 'Name must not be null!');
    } else if (this.nameParams.indexOf(', ') === -1) {
      this.toastService.showToast('warning', 3000, 'Name must contain a comma & a space!');
    } else {
      this.router.navigate(['invoice', total]);
    }
    localStorage.setItem('calculation', JSON.stringify(total));
  }

  calculation() {
    let tax = 0;
    let total = 0;
    let subTotal = 0;
    let name;
    let firstName;
    let lastName;
    let fullName;
    // index or i will determine the amount of bikes in cart
    for (let i = 0; i < this.bikes.length; i++) {
      total += this.bikes[i].quantity * this.bikes[i].price;
      // tax amount found based on trying numbers until it matched image on github
      tax = total * .15;
      subTotal = total - tax;
      name = this.nameParams.replace(', ', ' ').split(' ');
      lastName = name[0];
      firstName = name[1];
      fullName = firstName + ' ' + lastName;
    } return {
      // What will be displayed on home page
      customerName: fullName,
      tax: tax.toFixed(2),
      subTotal: subTotal.toFixed(2),
      total: total.toFixed(2),
      // toFixed solution found during last exam
    };
  }

  // Paths from app routes
  //   }, {
  //     path: 'invoice',
  //     component: HomeComponent
  //   }, {
  //     path: 'cart',
  //     component: CartComponent

}
