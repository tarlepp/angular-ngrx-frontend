import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  const ts = Math.round((new Date()).getTime() / 1000);

  return new TranslateHttpLoader(httpClient, './assets/i18n/', `.json?t=${ts}`);
}
