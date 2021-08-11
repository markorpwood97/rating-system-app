import { Component, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Rating } from './rating.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent implements OnInit {
  title = 'rating-system-app';
  feedbackForm: FormGroup;
  error = new Subject<string>();
  currentRate = 0;   

  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.initForm();
  }
  
  onSubmit() {
    this.saveRating(this.feedbackForm.value['rating'], this.feedbackForm.value['reason']);
  };
  
  private saveRating(rating: number, reason: string) {
    const ratingItem: Rating = {rating: rating, reason: reason};
    this.http.post('https://rating-system-c8396-default-rtdb.firebaseio.com/posts.json', 
      ratingItem,
      {
        observe: 'response'
      }
    )
    .subscribe(responseData => {
      console.log(responseData);
    }, error => {
      this.error.next(error.message);
    });
  }

  private initForm() {
    this.feedbackForm = new FormGroup({
      rating: new FormControl(0, Validators.min(1)),
      reason: new FormControl()
    });
  }
}
