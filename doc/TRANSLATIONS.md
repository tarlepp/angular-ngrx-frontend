# What is this?

This document contains information on how to use translations in the application.

## Table of Contents

* [What is this?](#what-is-this)
  * [Table of Contents](#table-of-contents)
  * [Basic usage](#basic-usage-table-of-contents)
    * [In template files](#in-template-files-table-of-contents)
    * [In TypeScript code](#in-typescript-code-table-of-contents)
  * [Workflow](#workflow-table-of-contents)
  * [Resources](#resources-table-of-contents)

## Basic usage [ᐞ](#table-of-contents)

### Defining translations in the assets [ᐞ](#table-of-contents)

Each language translations are stored in its own JSON file, for example
`en.json`. In this application we are using nested (or so called
namespaced-json) format. Below is an example on how to group translation keys
correctly.

```json
{
  "component": {
    "some-component": {
      "bar": "bar",
      "foo": "foo"
    }
  }
}
```

### In template files [ᐞ](#table-of-contents)

Translations are easy to use with `transloco` pipe:

```html
<div>
  <form>
    <button>{{ 'button.start' | transloco }}</button>
  </form>
</div>
```

Another way is to use _structural directive_ like:

```html
<ng-container *transloco="let t">
  <div>
    <form>
      <button>{{ t('button.start') }}</button>
    </form>
  </div>
</ng-container>
```

```html

Sometimes we need to have params inside the translatable string:

```json
{
  "example": {
    "greeting": "Hello {{name}}!"
  }
}
```

Then we have to use `[translocoParams]` in template:

```html
<h1 [transloco]="'example.greeting'"
    [translocoParams]="{ name: 'Arnold' }"
></h1>
```

Or with _structural directive_ like:

```html
<ng-container *transloco="let t">
  <h1>{{ t('example.greeting', { name: 'Arnold' }) }}</h1>
</ng-container
```

### In TypeScript code [ᐞ](#table-of-contents)

Sometimes we have to use translatable strings straight in our code. Luckily,
there is a way to easily maintain these strings with the
`@jsverse/transloco-keys-manager/marker` package. What you need to do in the code, is
to first import the marker function:

```typescript
import { marker } from '@jsverse/transloco-keys-manager/marker';
```

Then, when you need to use a string in code, wrap it with the marker function.
This way we can automatically keep track on the translation keys with the
mentioned package. The function itself does nothing — it only passes the string
as a result.

```typescript
const message = marker('that-form.this-message');
```

This `message` variable can now be used as a normal translation tag in
component. e.g.

```html
<p>{{ message | transloco }}</p>
```

## Workflow [ᐞ](#table-of-contents)

Manually tracking all the translatable keys in our templates and code is a pain
in the $!@. Eventually some keys will be forgotten from some of our translation
files, or some keys turn out to be redundant and forgotten to be deleted.

**Fortunately** we have a tool to be used when working with translations.
`@jsverse/transloco-keys-manager` is set up in the application so, that it
will collect all used translation keys and add them to our translation files.
It'll also sort the JSON nicely, cleans up unused tags, and keeps the format
just like we wanted. All that just in one command:

```bash
yarn run extract-translations

OR

make extract-translations
```

Neat right? So recommend workflow with translations is just following:

1. Add your translations to your _templates_ or _code_ using that `marker`
   function.
1. Run `yarn run extract-translations` OR `make extract-translations`
   command.
1. Open your translation files under `translations` and fill out those
   empty spots.
1. After that you need to run `yarn run sync-translations` OR
   `make sync-translations` command

With that workflow your translation files will always be synced between
different languages and there isn't any redundant translations tags.

## Resources [ᐞ](#table-of-contents)

* [Github](https://github.com/jsverse/transloco/)
* [Transloco home page](https://jsverse.github.io/transloco/)

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
