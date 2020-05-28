import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';
import {Presentation} from '../../model/presentation';

@Component({
  selector: 'app-admin',
  template: `

        <div class="center" *ngIf="items?.length !== 0">
          <img class="player-image" [src]="items[counter]" >
          <div>
            <button class="button" (click)="gotoPrevImage()">PREV</button>
            <span class="counter">{{counter + 1}} / {{items.length}}</span>
            <button class="button" (click)="gotoNextImage()">NEXT</button>
          </div>
        </div>

    <div class="gallery">
        <div class="center">
          <form #f="ngForm" (submit)="addImage(f.value.tmb)">
            <input type="text" placeholder="Add new Image URL" [ngModel] name="tmb">
            <button class="button" type="button" (click)="generateRandomImage()"> Generate Image</button>
          </form>
        </div>
        <div class="image-container">
            <div class="grid">
              <div class="cell"*ngFor="let item of items">
                <img class="responsive-image" [src]="item">
                <span class="cursor icon" (click)="deleteImage(item)">&#10006;</span>
              </div>
            </div>
        </div>
    </div>
  `,
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  items: string[] = [];
  counter: number;

  constructor(private db: AngularFireDatabase) {
    db.object<Presentation>('presentation')
      .valueChanges()
      .subscribe((res: Presentation) => {
        this.items = (res && res.images) || [];
        this.counter = (res && res.counter) || 0;
      })
  }


  addImage(url: string){
    console.log(url);
    this.items = [...this.items, url]
    this.db.object('presentation/images').set(this.items);
  }

  generateRandomImage(){
    const random =  Math.floor(Math.random() * 200);
    const tmb = `http://picsum.photos/699/400?image=${random}`
    this.addImage(tmb);
  }

  deleteImage(itemToDelete: string){
    this.items = this.items.filter(item => item !== itemToDelete)
    this.db.object('presentation/images').set(this.items);
    if (this.counter > this.items.length - 1) {
      this.updateCounter(0);
    }
  }

  gotoPrevImage() {
    const total = this.items.length - 1;
    const counter = (this.counter > 0) ? this.counter - 1 : total;
    this.updateCounter(counter);
  }

  gotoNextImage() {
    const total = this.items.length - 1;
    const counter = (this.counter < total) ? this.counter + 1 : 0;
    this.updateCounter(counter);
  }

  updateCounter(counter: number){
    this.db.object('presentation/counter').set(counter)
  }



}
