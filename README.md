# Peeceetje
Table of contents

[**Back-end**](#back-end)

> [Node.js](#node.js)

> [Express](#express)
  
> [MySQL Database Queries](mysql-database-queries)
  
> [app.js](#app-js)
  
> [Http Configuration](#http-configuration)
  
> [Database and MySql Configuration](#database-and-mysql-configuration)
  
> [Tools](#tools)
  
> [.htaccess](#.htaccess)
  
> [Views](#views)
  
> [Fragments](#fragments)
  
> [Templates](#templates)
  
[**Front-end**](#front-end)

> [JavaScript](#javascript)
  
>> [script.js](#script.js)
    
>>> [Structure](#structure)
      
>>> [Framework functionality](#framework-functionality)
      
>> [QR-code, camera and cashdesk.js](#qr-code,-camera-and-cashdesk.js)
      
>> [CSS](#css)
  
>> [Facebook Events](#facebook-events)

>>>[Generating access tokens](#generating-access-tokens)
  
[**Shared Hosting**](#shared-hosting)
  
> [cPanel](#cpanel)
  
>> [SSH-Access](#ssh-access)
  
>> [Configuration](#configuration)
  

## Back-end

### Node.js

Node.js version 4 (?) is used at shared hosting. Back-end is made using EcmaScript scripting language.

### Express

Node.js Express is used to build this web-application.

Routes are defined inside `routes` folder. *Express* renders [views](#views) to build dynamic HTML-responses, using 

### MySQL Database Queries.

-

### app.js

-

### Http Configuration

-

### Database and MySql Configuration

-

### Tools

-

### .htaccess

-

### Views

Views are `.ejs`-files, located in `/views`.
Every view contains at least `head.ejs` and `tail.ejs` fragments. Before including the head-fragment, it is recommended to define the page title this way:
`<% this.title = 'Homepage' %>`
Additional scripts can be added after (recommended) the tail-fragment. E.g.
```
<% include fragments/tail.ejs %>
<script src="/assets/3pty/jsQR.js"></script>
```

### Fragments

Fragments are included inside `views`, e.g.:

```
<% include fragments/head.ejs %>
```
Fragments are located in `/views/fragments`.


### Templates

Templates are also fragments, used inside dynamically generated HTML-content as templates. Templates are cloned by JavaScript DOM-manipulation to make it easier to add new complex elements to DOM (e.g. table-rows).
Templates are located in `/views/templates`.

## Front-end

### JavaScript

JavaScript version 2 is used as front-end scripting language to support client-side browser functionality as much as possible.

#### script.js

##### Naming conventions

- All variable names, created at Front-end, are in `English`.
- DOM (Document Object Model) variables begin with `$`-sign (e.g. `$table`).
- Global variables are in `UPPERCASE`.
- function names, local variables, and object properties are in `camelCase`.

##### Structure

Due to data transfer overhead, to minimize number of requests, to maximize page loading performance, and to insure the integrity of different script parts, number of script files is minimized as much as possible. For more explanation read [this answer](https://stackoverflow.com/a/15398107) on *Stackoverflow*. The main script-file is `script.js`. To keep this file readable, scalable, and maintainable, a certain structure is defined within it:

`script.js` begins with declaration of "standalone" basic global variables (e.g. `var THEMES = ['blue', 'yellow', 'white'];`, followed by expanding **core** (prototype) functionalities. This is done inside an *iffy*-function:

```
(function core() {
   /* Object.prototype.newFunction = function(args) {} ... */
})();
```
Generic Framework functionality is defined inside global function-variable `FRAMEWORK_GENERIC`:
```
var FRAMEWORK_GENERIC = function(/* may be expanded by args, if necessary */) {
   /* Framework Generic-Functionality */
   var customFunction1 = function() { ... }
   var expand() = function() { ... }
   return {
      expand: expand,
      customFunction1: customFunction1
   }
}
```
This global function-variable has same structure, as page-oriented / content-relative global function-variables (see further). with only one exception: it returns `expand` function-variable to be called (to activate generic framework functionality), together with other custom function-variables (expandable in the future):
`FRAMEWORK_GENERIC().expand();`.

Then framework expanding generic (re-usable) **components** are defined inside *iffy*-functions, such as:
```
(function numpad() {
   /* Numpad-component Functionality */
})();
```

Next is the object-variable `FETCH` which includes default fetch helper functions and the fetch functionality. It has following structure:
```
var FETCH = {
   get: function(url) {
        return fetch(url);
   }
   ,
   post: function(data, options) {
      return fetch(options.action, {
          headers: FETCH_HEADERS,
          method: options.method,
          body: JSON.stringify(data)
      });
   }
   ,
   ...
}
```

Object-variable `COOKIES` is made to set and get Cookies. Cookie keys and settings (constants) are defined inside this variable as well:
var COOKIES = {
    keys: {
        theme: 'theme',
        ...
    }
    ,
    age: 4/*years*/ * 365.25/*days*/
    ,
    set: function (cname, cvalue, exdays) { ... }
    ,
    get: function (cname) { ... }
};

All Storage functions, keys and settings (constants) are defined inside object-variable `STORAGE`, in the same way like Cookies. It has following structure:
var STORAGE = {
    isAvailable: function () {...}
    ,
    get: function (key) { ... }
    ,
    set: function (key, value) { ... }
    ,
    remove: function (key) { ... }
    ,
    keys: { ... }
};

Then **page-oriented / content-relative** global function-variables begin. First one is `GENERAL` which includes functionality that is necessary on all pages. It has same structure, as other content-relative variables (such as `INVENTORY`, `CASHDESK`, etc).
```
var GENERAL = function () {
    var eventHandlers = {
        doSomething: function (e) { 
           helpMeToDoIt();
        }, // Where e is event
        doSomethingElse: function (e) { ... },
        ...
    };

    function helpMeToDoIt() {
        ...
    }

    function addEventListeners() {
        document.getElementById('someDOMElement').addEventListener("click", eventHandlers.doSomething);
    }

    var init = function () {
        addEventListeners();
        ...
    };

    return {
        init: init
    }
};
```
These functions always return an object, containing `init` function-variable, and are called this way (example): `GENERAL().init();`

`script.js` ends with initializing function, which initializes the script, when document is ready.
```
var init = function() {
   FRAMEWORK_GENERIC().expand();
   GENERAL().init();
   CASHDESK().init();
   ...
}
$(document).ready(init);
```
> (**FYI**: `script.js` is written in jQuery, because Bootstrap is used for this application, and Bootstrap uses jQuery by default anyway):

> **NOTE: It is strongly recommended to keep this structure with maintainability purposes**

##### Framework functionality

-

#### QR-code, camera and cashdesk.js

### CSS

-

### Facebook Events

#### Generating access tokens

-

------

## Shared Hosting

### cPanel

#### SSH-Access

Commandline access (e.g. Gitbash):
```
ssh peecee1q@peeceetje.be -p 4000[ENTER]
Password: yourPassword
```
To copy files through SSH use this command (Windows):

```
scp -P 4000 /path/to/Peeceetje/ peecee1q@peeceetje.be:/home/peecee1q/
```

```
scp -P 4000 /path/to/Peeceetje/anySubfolder peecee1q@peeceetje.be:/home/peecee1q/anySubfolder
```

```
scp -P 4000 /path/to/Peeceetje/anyFileInsideAnySubfolder.extension peecee1q@peeceetje.be:/home/peecee1q/anyFileInsideAnySubfolder.extension
```

#### Configuration

-

