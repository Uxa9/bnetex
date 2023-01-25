import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isCollapsed = false;


  public navigationRoot = [
    {
      title: 'Settings',
      icon: 'dashboard',
      childs: [        
        {
          title: 'Trading Pairs',
          path: '/pairs'
        }
      ]
    }
  ]
}
