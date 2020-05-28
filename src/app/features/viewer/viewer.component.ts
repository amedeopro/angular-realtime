import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Presentation} from '../../model/presentation';
import {animate, state, style, transition, trigger, AnimationEvent} from '@angular/animations';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-viewer',
  animations: [
    trigger('imageGallery', [
      state('show', style({
        opacity: 1
      })),
      state('hide', style({
        opacity: 0
      })),
      transition('hide <=> show', [
        animate('0.5s')
      ])
    ])
  ],
  template: `
    <div class="bg" *ngIf="presentation?.images?.length; else nodata">
      <img *ngIf="presentation.images[presentation.counter]"
           [src]="image"
           [@imageGallery]="state"
           (@imageGallery.done)="transitionEnd($event)"
           (load)="showTransitionStart()"
      >
    </div>

    <ng-template #nodata>
      Non ci sono immagini
    </ng-template>
  `,
  styleUrls: ['./viewer.component.css']
})
export class ViewerComponent {

  presentation: Presentation;
  state = 'hide';
  image: string;

  constructor(private db: AngularFireDatabase) {
    this.db.object<Presentation>('presentation')
      .valueChanges()
      .pipe(distinctUntilChanged((prev, actual) => {
        return prev.counter === actual.counter;
      }))
      .subscribe(res => {
        this.state = 'hide';
        this.presentation = res;
      });
  }

  transitionEnd(event: AnimationEvent) {
    if (event.toState === 'hide') {
      const { images, counter } = this.presentation;
      this.image = images[counter];
    }
  }
  showTransitionStart() {
    this.state = 'show';
  }


}
