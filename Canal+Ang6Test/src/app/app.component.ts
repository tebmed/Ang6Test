import {
  Component, ElementRef
} from '@angular/core';
import { VERSION } from '@angular/material';

@Component({
  selector: 'material-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  version = VERSION;
}

