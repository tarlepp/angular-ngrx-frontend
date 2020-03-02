import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import {
  ErrorMessageClientInterface,
  ErrorMessageInterface,
  ErrorMessageServerInterface,
} from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})

export class ErrorMessageComponent implements OnInit {
  public errors: Array<ErrorMessageInterface>;
  public production = environment.production;

  private static getClientMessage(message: ErrorMessageServerInterface): ErrorMessageClientInterface {
    const target = message.target.split('.').map(bit => bit.charAt(0).toLowerCase() + bit.slice(1)).join('.');

    return {
      ...message,
      messageText: ['server-error', message.code, target, message.propertyPath].join('.'),
      messageProperty: ['server-error', 'property', target, message.propertyPath].join('.'),
    };
  }

  public constructor(
    @Inject(MAT_SNACK_BAR_DATA) private serverMessages: Array<ErrorMessageServerInterface>,
    private snackBarRef: MatSnackBarRef<ErrorMessageComponent>,
    private translateService: TranslateService,
  ) { }

  public ngOnInit(): void {
    const clientMessages = this.serverMessages.map(ErrorMessageComponent.getClientMessage);

    this.translateService
      .get([
        ...clientMessages.map((message: ErrorMessageClientInterface): string => message.messageText),
        ...clientMessages.map((message: ErrorMessageClientInterface): string => message.messageProperty),
      ])
      .pipe(take(1))
      .subscribe((texts: {[key: string]: string}): void => {
        const messages = clientMessages.map(this.processTranslations(texts), clientMessages);

        this.errors = messages.map(
          (error: ErrorMessageClientInterface): ErrorMessageInterface => ({
            message: error?.messageTextClient || error.message,
            property: error?.messagePropertyClient || error.propertyPath,
            debug: error.target.split('.').join('\\') + '::$' + error.propertyPath,
          }),
        );
      });
  }

  public dismiss(): void {
    this.snackBarRef.dismiss();
  }

  private processTranslations(texts: { [key: string]: string }): (message: ErrorMessageClientInterface) => ErrorMessageClientInterface {
    return (message: ErrorMessageClientInterface): ErrorMessageClientInterface => {
      const properties = ['messageProperty', 'messageText'];

      properties.map((property: string): void => {
        const propertyClient = property + 'Client';

        message[propertyClient] = texts[message[property]];

        if (texts[message[property]] === message[property]) {
          if (!environment.production) {
            console.warn('Missing translation! `' + message[property] + '` - This is only shown in non `production` environments.');
          }

          message[propertyClient] = null;
        }
      });

      return message;
    };
  }
}
