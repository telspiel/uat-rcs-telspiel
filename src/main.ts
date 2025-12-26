import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { loadAppConfig } from './app/config/app-config';

// Load the runtime configuration before bootstrapping the app
loadAppConfig()
  .then(() => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch(err => console.error('Bootstrap error:', err));
  })
  .catch(err => {
    console.error('Failed to load runtime config:', err);
  });
