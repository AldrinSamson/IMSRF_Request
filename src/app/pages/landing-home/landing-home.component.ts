import { Component, ViewChildren, ViewEncapsulation, QueryList, AfterViewInit } from '@angular/core';
import { NgbCarousel, NgbSlide } from '@ng-bootstrap/ng-bootstrap';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-landing-home',
  templateUrl: './landing-home.component.html',
  styleUrls: ['./landing-home.component.scss'],
  styles: [`
  .carousel-item
 {
   display:block;
 }
 .carousel-caption
 {
   display:block
 }
`],
 animations: [
   trigger('simpleTranslation', [
     state('outleft', style({ transform: `translateX(-100%)` })),
     transition('*=>inleft',[
       style({transform:`translateX(-100%)`}),
       animate('260ms ease-in',style({ transform: `translateX(0)` }))
     ]),
     transition('*=>outleft', [
       animate('260ms ease-in',style({ transform: `translateX(100%)` }))
     ]),
   ])
 ]
})
export class LandingHomeComponent implements AfterViewInit {

  @ViewChildren(NgbSlide) slides: QueryList<NgbSlide>
  slideControl: any[] = []
  onSlide(event) {
    this.slides.forEach((x, index) => {
      if (x.id == event.current) {
        this.slideControl[index] = 'in' + event.direction
      }
      if (x.id == event.prev) {
        this.slideControl[index] = 'out' + event.direction
      }
    })
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.slides.forEach((x, index) => {
        this.slideControl[index] = index ? 'outleft' : 'inleft'
      })
    })
  }

 

}
