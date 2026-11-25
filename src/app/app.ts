import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  host: { '[class.dark-theme]': 'isDarkMode' },
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected isDarkMode = false;

  protected toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
  }
}
