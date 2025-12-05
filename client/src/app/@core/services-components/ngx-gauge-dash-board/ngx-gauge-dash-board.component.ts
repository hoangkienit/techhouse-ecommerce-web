import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-ngx-gauge-dash-board',
  templateUrl: './ngx-gauge-dash-board.component.html',
  styleUrls: ['./ngx-gauge-dash-board.component.scss']
})
export class NgxGaugeDashBoardComponent implements OnInit, OnChanges {

  @Input() value: number = 0;
  @Input() max: number = 1000;

  @Output() valueChange = new EventEmitter<number>();
  @Output() maxChange = new EventEmitter<number>();

  size = 220;
  stroke = 14;
  radius = (this.size - this.stroke) / 2;
  center = this.size / 2;

  startAngle = Math.PI;
  endAngle = 0;

  arcPath = '';
  arcLength = 0;
  dashOffset = 0;

  displayValue = 0;

  ngOnInit() {
    this.arcLength = Math.PI * this.radius;
    this.arcPath = this.describeArc(this.center, this.center, this.radius, this.startAngle, this.endAngle);
    this.updateGauge();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.updateGauge();
    }

    if (changes['max']) {
      this.maxChange.emit(this.max);
      this.updateGauge();
    }
  }

  describeArc(cx: number, cy: number, r: number, start: number, end: number) {
    const startX = cx + r * Math.cos(start);
    const startY = cy + r * Math.sin(start);
    const endX = cx + r * Math.cos(end);
    const endY = cy + r * Math.sin(end);
    return `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
  }

  updateGauge() {
    this.displayValue = this.value;
    this.valueChange.emit(this.displayValue);

    const pct = Math.min(this.value / this.max, 1);
    this.dashOffset = this.arcLength * (1 - pct);
  }
}