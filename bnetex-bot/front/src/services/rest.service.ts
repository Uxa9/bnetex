import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, map, Observable, of, pluck } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  public objectToQuerystring(obj: any = {}) {
    if (!obj) return '';
    return Object.keys(obj)
      .filter((key) => obj[key])
      .reduce(function (str, key, i) {
        var delimiter, val;
        delimiter = i === 0 ? '?' : '&';
        key = encodeURIComponent(key);
        val = encodeURIComponent(obj[key]);

        return [str, delimiter, key, '=', val].join('');
      }, '');
  }

  public url = 'http://bnetex:3009/front';
  

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {}

  public get(path: any, params = null) {
    return this.httpClient.get(`${this.url}${path}${this.objectToQuerystring(params)}`);

  }

  public post<T>(path: any, params: any = {}): Observable<any> {
    return this.httpClient.post(`${this.url}${path}`, params)
  }

  // public delete(path: any, params: any): Observable<any> {
  //   return this.httpClient
  //     .delete(`${this.url}${path}${this.objectToQuerystring(params)}`, {
  //       headers: {
  //         BranchSelected: String(localStorage.getItem('cbranch')),
  //         Authorization: `Bearer ${this.getToken()}`,
  //       },
  //     })
  //     .pipe(
  //       pluck('data'),
  //       catchError((_) => {
  //         this.hanleError(_);

  //         throw _.error.detail;
  //       })
  //     );
  // }

  // public put<T>(path: any, params: any = {}): Observable<any> {
  //   return this.httpClient
  //     .put(`${this.url}${path}`, params, {
  //       headers: {
  //         BranchSelected: String(localStorage.getItem('cbranch')),
  //         Authorization: `Bearer ${this.getToken()}`,
  //       },
  //     })
  //     .pipe(
  //       pluck('data'),
  //       catchError((_) => {
  //         this.hanleError(_);

  //         throw _.error.detail;
  //       })
  //     );
  // }

  // public get<T>(
  //   path: any,
  //   params: any = {},
  //   config: { hideError?: Boolean } = {}
  // ): Observable<any> {
  //   return this.httpClient
  //     .get<T>(`${this.url}${path}${this.objectToQuerystring(params)}`, {
  //       headers: {
  //         BranchSelected: String(localStorage.getItem('cbranch')),
  //         Authorization: `Bearer ${this.getToken()}`,
  //       },
  //     })
  //     .pipe(
  //       pluck('data'),
  //       catchError((_) => {
  //         if (!config.hideError) {
  //           this.hanleError(_);
  //         }

  //         throw _.error.detail;
  //       })
  //     );
  // }

  // hanleError(error: HttpErrorResponse) {
  //   this.errorService.errorHandler(error);
  //   if (error.status == 401) {
  //     localStorage.removeItem('access_token');
  //     localStorage.removeItem('cbranch');
  //     this.router.navigate(['/login']);
  //   }
  // }
}
