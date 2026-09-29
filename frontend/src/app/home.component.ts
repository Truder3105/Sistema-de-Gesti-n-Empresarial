import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: '<main><h1>Gestión Empresarial</h1><p>Fundaciones del ERP listas para iniciar.</p></main>',
  styles: ['main { font-family: system-ui, sans-serif; margin: 3rem auto; max-width: 60rem; padding: 1rem; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
