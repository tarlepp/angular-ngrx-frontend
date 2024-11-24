import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { take } from 'rxjs/operators';

import {
  DictionaryInterface,
  ErrorMessageClientInterface,
  ErrorMessageInterface,
  ErrorMessageServerInterface,
} from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
  standalone: false,
})

export class ErrorMessageComponent implements OnInit {
  public errors: Array<ErrorMessageInterface>;
  public readonly production: boolean;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    @Inject(MAT_SNACK_BAR_DATA) private readonly serverMessages: Array<ErrorMessageServerInterface>,
    private readonly snackBarRef: MatSnackBarRef<ErrorMessageComponent>,
    private readonly translateService: TranslocoService,
  ) {
    this.errors = [];
    this.production = environment.production;

    ErrorMessageComponent.markTexts();
  }

  /**
   * Method to mark all custom error messages so that those aren't removed when
   * you run `yarn extract-translations` command.
   *
   * Just remember to add _all_ custom error translations for your application
   * here!
   */
  private static markTexts(): void {
    marker([]);
  }

  /**
   * Method to format `ErrorMessageServerInterface` data for this component.
   * Basically this is just adding following properties to that initial object;
   *  - messageText
   *  - messageProperty
   *
   * So that we can easily use those as a translations if/when we need to
   * translate some errors from backend side on our frontend application - just
   * remember to add those translations tags to `markTexts` method!
   */
  private static getClientMessage(message: ErrorMessageServerInterface): ErrorMessageClientInterface {
    const target = message.target.split('.').map((bit: string): string => bit.charAt(0).toLowerCase() + bit.slice(1)).join('.');

    return {
      ...message,
      messageText: ['server-error', message.code, target, message.propertyPath].join('.'),
      messageProperty: ['server-error', 'property', target, message.propertyPath].join('.'),
    };
  }

  /**
   * A callback method that is invoked immediately after the default change
   * detector has checked the directive's data-bound properties for the first
   * time, and before any of the view or content children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  public ngOnInit(): void {
    const clientMessages = this.serverMessages.map(ErrorMessageComponent.getClientMessage);

    // Fetch possible custom translations for each error
    this.translateService
      .selectTranslate([
        ...clientMessages.map((message: ErrorMessageClientInterface): string => message.messageText),
        ...clientMessages.map((message: ErrorMessageClientInterface): string => message.messageProperty),
      ])
      .pipe(take(1))
      .subscribe((texts: DictionaryInterface<string>): void => {
        // Determine messages to show in component
        const messages = clientMessages.map(this.processTranslations(texts), clientMessages);

        // Initialize errors that are shown on component
        this.errors = messages.map(
          (error: ErrorMessageClientInterface): ErrorMessageInterface => ({
            message: error?.messageTextClient || error.message,
            property: error?.messagePropertyClient || error.propertyPath,
            debug: error.target.split('.').join('\\') + '::$' + error.propertyPath,
          }),
        );
      });
  }

  /**
   * Method to dismiss current error message snack bar.
   */
  public dismiss(): void {
    this.snackBarRef.dismiss();
  }

  /**
   * Method to process error message translations and trigger `console.warn`
   * if/when some "expected" translation is not found frontend application. Just
   * note that this is not an error - we just want to notice that you _might_
   * be missing some translation.
   *
   * Also note that this `console.warn` message is only shown non-production
   * environment.
   */
  private processTranslations(texts: DictionaryInterface<string>): (message: ErrorMessageClientInterface) => ErrorMessageClientInterface {
    return (message: ErrorMessageClientInterface|any): ErrorMessageClientInterface => {
      const properties = ['messageProperty', 'messageText'];

      properties.map((property: string): void => {
        const propertyClient = `${property}Client`;

        message[propertyClient] = texts[message[property]];

        // If translated text is the same as the property definition (text tag) itself - we don't have translation
        if (texts[message[property]] === message[property]) {
          if (!environment.production) {
            console.warn(`Missing translation! '${message[property]}' - This is only shown in non 'production' environments.`);
          }

          message[propertyClient] = null;
        }
      });

      return message;
    };
  }
}
