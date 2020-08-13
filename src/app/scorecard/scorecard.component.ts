import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {

  @Input() team: number;
  public teamNames = ['Red Team', 'Yellow Team'];
  public rows = Array.from(new Array<number>(16).keys())
  constructor() { }

  ngOnInit(): void { }

}
