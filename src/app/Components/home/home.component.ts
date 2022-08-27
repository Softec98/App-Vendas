import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isHandset$: Observable<boolean> = this.media.asObservable().pipe(
    map(() =>
      this.media.isActive('xs') ||
      this.media.isActive('sm') ||
      this.media.isActive('lt-md')
    ), tap(() => this.changeDetectorRef.detectChanges()))

  constructor(
    private media: MediaObserver,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

}