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

Translations are easy to use with `translate` pipe:

```html
<div>
  <form>
    <button>{{ 'button.start' | translate }}</button>
  </form>
</div>
```

Sometimes we need to have params inside the translatable string:

```json
{
  "example": {
    "greeting": "Hello {{name}}!"
  }
}
```

Then we have to use `[translateParams]` in template:

```html
<h1 translate
    [translateParams]="{name: 'Arnold'}"
>example.greeting</h1>
```

### In TypeScript code [ᐞ](#table-of-contents)

Sometimes we have to use translatable strings straight in our code. Luckily,
there is a way to easily maintain these strings with the
`@biesbjerg/ngx-translate-extract` package. What you need to do in the code, is
to first import the marker function:

```typescript
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
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
<p>{{ message | translate }}</p>
```

## Workflow [ᐞ](#table-of-contents)

Manually tracking all the translatable keys in our templates and code is a pain
in the $!@. Eventually some keys will be forgotten from some of our translation
files, or some keys turn out to be redundant and forgotten to be deleted.

**Fortunately** we have a tool to be used when working with translations.
`@biesbjerg/ngx-translate-extract` is set up in the application so, that it
will collect all used translation keys and add them to our translation files.
It'll also sort the JSON nicely, cleans up unused tags, and keeps the format
just like we wanted. All that just in one command:

```bash
yarn run extract-translations
```

Neat right? So recommend workflow with translations is just following:

1. Add your translations to your _templates_ or _code_ using that `marker`
   function.
2. Run `yarn run extract-translations` command.
3. Open your translation files and fill out those empty spots.

With that workflow your translation files will always be synced between
different languages and there isn't any redundant translations tags.

## Resources [ᐞ](#table-of-contents)

* [Great tutorial](https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-angular7-app-with-ngx-translate)
* [Github](https://github.com/ngx-translate/core)
* [Ngx-Translate home page](http://www.ngx-translate.com/)

---

[Back to resources index](README.md) - [Back to main README.md](../README.md)
