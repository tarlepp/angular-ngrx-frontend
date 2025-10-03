import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Factory for `TranslateHttpLoader` loader that we're using to load
 * translation JSON files. We need to use this custom factory for this
 * service to prevent HTTP cache within those translation JSON files.
 */
export const httpLoaderFactory = (httpClient: HttpClient): TranslateHttpLoader => {
  const ts = Math.round((new Date()).getTime() / 1000);

  return new TranslateHttpLoader(httpClient, './assets/i18n/', `.json?t=${ts}`);
};
