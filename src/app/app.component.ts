import { Component } from '@angular/core';
import { ETheme } from 'src/app/Core/Enums/ETheme.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'App-Vendas';
  icon = ETheme.ICON_MOON;
  textTheme = ETheme.TEXT_MOON;

  public toggle() {
    
    const theme = document.body.classList.toggle('dark-theme');
    
    alert('Tema: ' + this.icon);

    if (theme) {
      this.textTheme = ETheme.TEXT_SUN;
      return (this.icon = ETheme.ICON_SUN);
    }

    this.textTheme = ETheme.TEXT_MOON;
    return (this.icon = ETheme.ICON_MOON);
  }
}

