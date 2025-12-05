import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss']
})
export class LoyaltyComponent implements OnInit {

  categories: string[] = ['All', 'Electronics', 'Accessories'];
  loyaltyPoints: number = 5000;  
  pointsToVND: number = 1000000; 
  usePoints: boolean = false;    
  pointsToUse: number = 0;      

  constructor() { }

  ngOnInit(): void {

  }

  onUsePointsChange(event: any): void {
    const checked = typeof event === 'boolean' ? event : event?.target?.checked;
    this.usePoints = !!checked;
    if (!checked) {
      this.pointsToUse = 0;  
    }
  }

}
