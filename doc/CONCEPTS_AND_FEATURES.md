# What is this?

This document contains information about main concepts and features how this
application is build and how you can use it.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Main external components/libraries](#main-external-componentslibraries-table-of-contents)
    * [@angular/material](#angularmaterial-table-of-contents)
    * [@angular/flex-layout](#angularflex-layout-table-of-contents)
    * [@auth0/angular-jwt](#auth0angular-jwt-table-of-contents)
    * [@ngrx/store](#ngrxstore-table-of-contents)
    * [@ngx-translate/core](#ngx-translatecore-table-of-contents)
    * [ngx-webstorage](#ngx-webstorage-table-of-contents)
  * [Application stores](#application-stores-table-of-contents)
    * [Authentication](#authentication-table-of-contents)
    * [Error](#error-interceptor-table-of-contents)
    * [Layout](#layout-table-of-contents)
  * [Interceptors](#interceptors-table-of-contents)
    * [Error interceptor](#error-interceptor-table-of-contents)
  * [Links](#links-table-of-contents)

## Main external components/libraries [ᐞ](#table-of-contents)

This project uses specified components and libraries that have been tested with
multiple similar Angular applications and these have proven to be rock solid
starting point for Angular application.

Note that if you want to use some another component/library and/or replace any
of these to another one - no worries it's _your_ application, this template
project just makes some assumptions.

### @angular/material [ᐞ](#table-of-contents)

UI component infrastructure and Material Design components for mobile and
desktop Angular web applications.

Note that this just _my_ personal preference, you might like more eg.
[Bootstrap](https://getbootstrap.com/)
or some another UI library.

* [Website](https://material.angular.io/)

### @angular/flex-layout [ᐞ](#table-of-contents)

Provides HTML UI layout for Angular applications; using Flexbox and a
Responsive API.

* [Website](https://github.com/angular/flex-layout)

### @auth0/angular-jwt [ᐞ](#table-of-contents)

Helper library for handling JWTs in Angular 2+ apps.

* [Website](https://github.com/auth0/angular2-jwt)

### @ngrx/store [ᐞ](#table-of-contents)

Store is RxJS powered state management for Angular applications, inspired by
Redux. Store is a controlled state container designed to help write performant,
consistent applications on top of Angular.

* [Website](https://ngrx.io/guide/store)

### @ngx-translate/core [ᐞ](#table-of-contents)

The internationalization (i18n) library for Angular.

* [Website](http://www.ngx-translate.com/)

### ngx-webstorage [ᐞ](#table-of-contents)

This library provides an easy-to-use service to manage the web storages (local
and session) from your Angular application. It provides also two decorators to
synchronize the component attributes and the web storages.

* [Website](https://github.com/PillowPillow/ng2-webstorage)

## Application stores [ᐞ](#table-of-contents)

By default, this application gives you couple `NgRx stores` that you can easily
use within application to help you.

If you want to get deeper look of each of those stores you just need to go
through each of those code - no worries there isn't so much code really.

### Authentication [ᐞ](#table-of-contents)

This store contains `authentication` information about current logged in user.
This store contains following information;

* `loading<boolean>`, loading either user login or profile
* `loggedIn<boolean>`, is user logged in
* `profile<UserProfileInterface|null>`, logged in user profile
* `roles<Array<Role>>`, current user roles as an array
* `error<ServerErrorInterface|null>`, latest error from login or profile fetch

Store state is updated automatically by user login / logout events. Also note
that store is initialized by possible `token` value in `local storage` if/when
user refresh page.

### Error [ᐞ](#table-of-contents)

This store contains following `error` information;

* `errorSnackbar<ServerErrorInterface|null>`, Error that is show on snackbar

Application `ErrorInterceptor` is using this store to show possible HTTP errors
to user. With this store you can easily dispatch events to show some error
message in your application.

### Layout [ᐞ](#table-of-contents)

This store contains following generic `layout` information;

* `language<Language>`, current language that application uses - this language
is always one of the languages that your application supports - see `Language`
enum for this.
* `viewport<Viewport>`, current application viewport; xs, sm, md, lg or xl -
these will help you to build your components for each viewport size more
easily than just using `fxFlex*` attributes on your templates - although those
are still useful and you should use those.
* `device<Device>`, what kind of "device" user is using. This is determined
by `Viewports` constant.

When `language` property is changed it triggers `@ngx-translate/core` to change
used language to specified one + stores that language to `local storage`.

`viewport` and `device` properties are updated automatically when user changes
browser viewport.

## Interceptors [ᐞ](#table-of-contents)

Application contains some generic interceptors that will help you to
development your application. Note that these interceptors relies that you're
using
[Symfony Flex Backend](https://github.com/tarlepp/symfony-flex-backend)
or similar backend.

### Error interceptor [ᐞ](#table-of-contents)

Generic HTTP error interceptor that will dispatch event to
[Error store](#error),
so that error is shown within Angular Material snackbar.

## Links [ᐞ](#table-of-contents)

* [@angular/material](https://material.angular.io/)
* [@angular/flex-layout](https://github.com/angular/flex-layout)
* [@auth0/angular-jwt](https://github.com/auth0/angular2-jwt)
* [@ngrx/store](https://ngrx.io/guide/store)
* [@ngx-translate/core](http://www.ngx-translate.com/)
* [ngx-webstorage](https://github.com/PillowPillow/ng2-webstorage)

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
