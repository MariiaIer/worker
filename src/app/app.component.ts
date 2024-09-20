import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { environment } from '../environment';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy, OnInit {
  private worker: Worker | undefined;
  private apiUrl = 'https://api.weatherapi.com/v1/';
  private apiKey = environment.apiKey;
  public weatherData$: Observable<any> = of();

  ngOnInit(): void {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./weather.worker.js', import.meta.url), { type: 'module' });

      this.worker.postMessage({ url: `${this.apiUrl}current.json?key=${this.apiKey}&q=Wroclaw&aqi=no` });

      this.worker.onmessage = ({ data }) => {
        if (data.status === 'success') {
          console.log('API response:', data.data);
          this.weatherData$ = of(data.data);
        } else if (data.status === 'error') {
          console.error('Error fetching data:', data.error);
        }
      };
    } else {
      console.error('Web Workers are not supported in this environment.');
    }
  }

  ngOnDestroy(): void {
    if (this.worker) {
      this.worker.terminate();
    }
  }

}
