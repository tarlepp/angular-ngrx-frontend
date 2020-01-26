/**
 * These role enums presents the same roles that you have in your backend.
 *
 * Logged in user Json Web Token (JWT) contains currently logged in user roles
 * that you can use to hide/show some elements etc. within your frontend
 * application.
 *
 * You can fetch currently logged in user roles by following code examples.
 *
 * Authentication store;
 *  constructor(private authenticationStore: Store<AuthenticationState>) { }
 *
 *  public ngOnInit(): void {
 *    this.subscription
 *      .add(this.authenticationStore
 *        .select(authenticationSelectors.roles)
 *        .subscribe((roles: Array<Role>): Array<Role> => this.rolesA = roles),
 *      );
 *  }
 *
 * Authentication service;
 *  constructor(private authenticationService: AuthenticationService) { }
 *
 *  public ngOnInit(): void {
 *    this.subscription
 *      .add(this.authenticationService.getLoggedInRoles()
 *        .subscribe((roles: Array<Role>): Array<Role>|null => this.rolesB = roles),
 *      );
 *  }
 */
export enum Role {
  ROLE_LOGGED = 'ROLE_LOGGED',
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_ROOT = 'ROLE_ROOT',
  ROLE_API = 'ROLE_API',
}
