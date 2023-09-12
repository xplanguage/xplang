# The Exceptional Programming Language

XPL is a general purpose programming language for the rapid development of data-driven, web-native solutions. It is monoparadigmatically table-oriented, storing, representing, and manipulating data in terms of relational tables.

Alert: You may wish to scroll to the bottom for the Status. This project isn't done.

## Features

### Everything is a table

    [3 `fizz`]
    [5 `buzz`]

Okay, you also have formulas. Then you have formulaic tables and tabular formulas.

### No Boilerplate

You can dive right into the console and begin solving problems.

     `The answer is { +(21 21) }.`

### Simple Syntax

There are no operators or keywords in XPL. Even adding is done with the `+()` formula. For example, instead of `21 + 21`:

     +(21 21)

There are no commas between arguments. Commas are for making big numbers more readable:

     /(1,024 24)

### Presumptive Paralellism

Processors have had multiple threads and multiple cores for decades now, and yet concurrency remains an afterthought in the most popular programming languages. In XPL, concurrency is the default.

This anonymous table defines four number fields, `y`, `m`, `x`, and `b`. The `y` field is formulaic, calculating the "slope" from the other fields.

     1: (y: { +(*(m x) b) } m x b)
     2:    [14 2 14]
     3:    [7  3 21]

The output is:

|  y  |  m  |  x  |  b  |
|:---:|:---:|:---:|:---:|
| 42  | 14  |  2  | 14  |
| 42  |  7  |  3  | 21  |

This approach brings the innately parallel dataflow functionality found in spreadsheets and database views to general purpose programming.

### Reactive Programming

In addition to labeled patches that can be called by label, patches of code can also have matchers that are formulas, patterns, and paths. Patterns and paths can capture plain text or structured data from the context.

This script uses a pattern `'^\d+$'` to accept every row of numbers in `fizzRaw.txt` and uses the modulo formula `%(x y)` to determine if a number is a multiple of 15, 5, or 3 and emit the proper fizzbuzz replacement. The `%%` is the "context placeholder," containing whatever was sent from the matcher.

     1: #!/usr/bin/env xpl -c fizzRaw.txt
     2:
     3: '^\d+$': { ?(%(%% 15) ?(%(%% 5) ?(%(%% 3) %% `fizz) `buzz`) `fizzbuzz`) }

That's a fun one-liner, but nested formulas can be difficult to read. Fortunately, you can (and should) use the pipe `|` and placeholder `%` to break nested expressions up.

     1: #!/usr/bin/env xpl -c fizzRaw.txt
     2:
     3: '^\d+$': {
     4:     ?(%(%% 15) %% `fizzbuzz`)
     5:   | ?(%(%   5) %  `fizz`)
     6:   | ?(%(%   3) %  `buzz`)
     7: }

This script reads the `employees.xml` file and fires all of the temps, with the modified copy of the file being read to standard output:

     1: #!/usr/bin/env xpl -c employees.xml
     2:
     3: /employees/employee[{=(status `temp`)}]: { set(fired `true`) }

## Philosophy

Programming languages dictate an abstract paradigm for how one creates, reads, updates, and deletes data. That's what a language is, a *language* one uses to solve the problem. If a programming language enables multiple paradigms, then it ceases to be a programming language at all, but a sort of metalinguistic alphabet with which one can solve problems in multiple incompatible and mutually unintelligible languages.

Paradigmatically pure languages like C (variables), APL (arrays), Lisp (linked lists), and SQL (relational tables) ensure that what's written by one person in the language can be read by another person who's proficient in the language. This cannot be said for the popular multiparadigmatic languages.

This is a crisis for modern programming, making the discipline needlessly complex and confusing. Because every interface is bespoke, there can be none of the accretivity that one finds with unix's elegantly stream-oriented shell scripting languages.

There's a valid reason for the crisis, as real world systems and processes are often not expressible as variables, streams, vectors, arrays, or lists. The solution has been to staple the ability to design arbitrary interfaces onto languages that are intrinsically variable, array, or list oriented or whatever.

But absolutely every system and process can indeed be defined in terms of relational tables of data, presuming one permits tabular formulas and formulaic tables. Therefore, if one creates a general purpose programming language that's table-oriented, the design of custom types can be performed within the same paradigm as the language itself, interacting with one another in terms tabular terms.

In theory, an elegant new programming language can be designed that's a dialect of SQL while looking nothing like it and being suitable for solving just about every problem with a computer. XPL is an attempt to prove that theory.

## Syntax

The syntax of XPL does not belong to any existing family, though it borrows from and has similarities to several. The goal is clarity and simplicity, with the target audience being people who have not coded before.

### Comments

|   Syntax    | Name                | Example                |
|:-----------:| ------------------- | ---------------------- |
|    `##`     | Single line comment | `## This is a comment` |
| `#* ... *#` | Multiline comments  | `#* multiple lines *#` |
|    `#:`     | Annotation          | `#: Slope of line`     |
|    `#!`     | Hashbang            | `#!/usr/bin/env xpl`   |

Single line and multiline comments are self-explanatory.

Annotations allow one to add descriptions to parts of the code that can be leveraged by one's IDE, debugger, or profiler to better understand the code.

The hashbang is embraced from the unix ecosystem and extended for much more than telling the shell which interpreter to use. Visit the Configuration section to see how the extended hashbang works.

### Numbers

Decimal numbers are the default type in XPL. When defining a field as a decimal number, you need no type decoration.

    ~: (a: 6.481) { *(a a) }

This is a valid program:

    42

If you enter that in the console, XPL will emit `42`.

This is also a valid program:

    0x2A

But, perhaps unexpectedly, XPL will emit `42`.

This is because `2A` is the hexadecimal representation of `42`, and unless instructed otherwise, XPL will store and represent numbers as normal decimals.

You can also do this with octal notation:

    052 ## also 42

It also handles scientific notation:

    4.2e1 ## also 42

There is no such thing as precision or overflow in the native number type. However precise you write it is how precisely it's stored. While the output may limit its representation to 16 digits, that's just a formatting thing.

This is a feature for people who don't care to figure out how microprocessors handle floating point arithmetic, but if performance matters then you'll want to rely on a more primitive type that's much faster but doesn't protect the programmer from precision and overflow errors.

### Strings

String fields are defined with a `$` symbol before the field name.

    ~: ($greeting: `Hello, world!`) { greeting }

Stringl are enclosed in backticks rather than quotes.

    `Hello, world!`

You can include primitives and formulas in your string with the curly brace escape `{ }`.

    `The answer is { *(14 3) }.`

To include curly braces, simply escape the opening one with a backslash:

    `The answer is \{42}.`

### Booleans

Boolean (true/false) values are defined with a `&` before the field name.

    ~: (&isProduction: 1) { if(isProduction `We're live!`) }

There's no special symbol for true or false. It's just `1` or `0`.

If something other than `1` or `0` is given, the boolean type will attempt to cast it, delivering true (`1`) if the thing is not null or zero.

### Tables

Tables are defined with a `#` before the field name.

     1: ~: (
     2:     #slopeTable: (y: { +(*(m x) b) } m x b)
     3:         [3 7 21]
     4: ) { slopeTable }

When you define a table field, you include the `(` batch `)` of fields for the table, and also either `[` tabular values `]` or a `{` formula `}` that returns a tabular result.

### Formulas

Formulas are defined with the type of whatever the formula returns. You can, however, use the formulaic (`@@`) type to indicate that the field can be any type. This opts out of safety and is not a "best practice" for developing enterprise applications, but can be useful in some cases.

     1: ~: (
     2:     @@ y: { +(*(m x) b) }
     3:     m
     4:     x
     5:     b
     6: )

XPL doesn't doom you to parentheses hell. Pipes (`|`) and placeholders (`%`) help you break up nest expressions.

Instead of:

    +(*(-8 -4) -33)

You can do:

    *(-8 -4) | +(% -33)

Pipes are only allowed in the console, formula definitions, and hatches. This is enforced for readability. Those are the only places where complex, deeply nested formulas are appropriate. They are not allowed when you're defining a batch field or when you're creating a formulaic match. Permitting them in that context invites unreadable code.

While you can call a formula with unnamed arguments, relying on the order in which public fields are defined, you can also name the fields.

    /(dividend: 504 divisor: 12)

### Exceptions

Exceptions are the magic formulas that make the Exceptional Programming Language truly *exceptional*. They break the flow of execution out of the formula.

     1: ~: { pitch(cutInHalf: 84)}
     2:
     3: cutInHalf: (cutMe) { /(cutMe 2) }

There are two ways to send a value to the exceptional. If you place it within `<` brackets `>` immediately after the `:` declaration, then it is sent by reference and becomes the "context" for the patch that matches and catches what's pitched or thrown. By default, the values will be sent the same way values are always sent to formulas, which is by value.

If the context is not a table, then it can be accessed with `%%`.

     1: ~: { pitch(cutInHalf: <84>) }
     2:
     3: cutInHalf: { /(%% 2) }

If the context is a table, the patch executes for every row in the table. In the following example, a table with two rows is sent to the patch, which executes twice.

     1: ~: { pitch(cutInHalf: <[84][-84]>) }
     2:
     3: cutInHalf: { /(%% 2) }

With "pitch", the field is returned to the original formula and patch. The other exceptional formulas enable alternative behavior.

| Exceptional | Description                         |
|:-----------:| ----------------------------------- |
|    throw    | abandon current context             |
|    pitch    | expect return and continuation      |
|    split    | fork execution                      |
|    watch    | fork and watch table for new values |

The "watch" formula is especially powerful, attaching monitors to tables to achieve event-driven behavior.

It can be disorienting at first for programmers who are familiar with conventional control flow operators and keywords, but the exceptional formulas are a complete replacement.

### Patches

Patches are magic tables with matches and hatches that can include formulas that are evaluated when the patch is instantiated.

| Match     | Parent     | Batch     | Hatch         |
| --------- | ---------- | --------- | ------------- |
|  `label:` | `<parent>` | `(a b c)` | `{ +(a b c)}` |

Fields can't be defined outside of a patch. While a lot of evaluation can be achieved in the root level of the console, an XPL program, module, or script is generally a collection of patches that interact with one another.

### Matches

The simplest sort of "match" is the label. There's one special label, the "null label," (`~:`) which is instantiated when the program, module, or script is loaded. It's the entrypoint for your program and whatever fields are public in its batch are visible in the environment.

The match can also be a number, string, boolean, formula, regular expression pattern, or "path."

Literals:

     1: ~: { throw(42: <`Moon`>)}
     2: 
     3: 42: { `Good night, {%%}.` }

Formulaic (contextual):

     1: ~: { throw(42: <>)}
     2: 
     3: %(%% 2): { `It's even!` }

Formulaic (equality):

     1: ~: { throw(42: <>)}
     2: 
     3: =(/(84 2)): { `It's 42!` }

Pattern:

     1: ~: { throw(`bananas`: <>) }
     2:
     3: 's$': { `It ends with the letter s` }

There are also `^` open patterns `^` that use a different regular expression syntax, deal with white space differently, can span multiple lines, and can include comments.

Path:

Paths are handy for when the XPL program possesses a context, such as a web page's DOM or a context piped into it from the command line.

     1: /img{=(id `kittens`)}: { set(src `kittens.jpeg`) }

### Batches

Formula definitions, tables, and patches all contain batches. They're where fields are defined.

You can decorate the field label with the following symbols to alter its behavior.

| Private | Protected | Field | Nullable | Mutable  | Unique |
|:-------:|:---------:|:-----:|:--------:|:--------:|:------:|
|   `!`   |    `!`    | field |   `~`    |   `*`    | `[*]`  |

     1: ~: (
     2:     !a ## protected
     3:     !!a ## private and protected
     4:     a* ## mutable
     5:     a~* ## nullable and mutable
     6:     a[*] ## unique
     7: )

A "protected" field is one that can be read outside the patch but can only be modified internally.

A "unique" field only really makes sense in tabular contexts, enforcing that every row has a unique value.

Additionally, you can add the index formula `_()` to achieve even more constraints on your fields. Adding the right indexes can dramatically improve the performance of your program.

Primary key:

    _(id)

Index:

    nameIndex: _(firstName lastName)

Foreign Key:

    cityKey: _(city cityList.cityName)

### Hatches

The hatch is a patch's sequential collection of formulas that are evaluated when the patch is instantiated. If the patch is instantiated against a tabular context, than the hatches are evaluated once for every row of the context.

In a well-written XPL program, everything is defined and constrained to a sufficient extent in the batch and in custom types, permitting the hatch to provide a concise description of what it's doing.

### Types

XPL has core, primitive, native, library, and custom types.

The core types are decimal numbers, strings (`$`), booleans (`&`), tables (`#`), null (`~`) and formulaic (`@@`). They have the special symbols in the syntax.

The primitive types are a selection of types directly associated with WebAssembly primitives. Every other type is derived from one of these primitive types.

| Type     | Name           |
| -------- | -------------- |
| `@_i1`   | bit            |
| `@_i8`   | 8 bit integer  |
| `@_i16`  | 16 bit integer |
| `@_i32`  | 32 bit integer |
| `@_i64`  | 64 bit integer |
| `@_f32`  | 32 bit float   |
| `@_f64`  | 64 bit float   |
| `@_v128` | 128 bit vector |

Native types are the types that are available without importing any modules. One example is `@number`:

     1: ~: (
     2:    @number(precision: 2 scale: 0 radix: 10) n: 42
     3: )

Library types are types that you must import from the standard libraries.

     1: #!/usr/bin/env xpl
     2: #! -m fs
     3:
     4: fs.readFile(`example.xml`)
 
### Custom Types

Types are just a magical patch that implements (or inherits) certain formulas.

     1: ~: (@salary payroll: 1,000)
     2:
     3: salary: <number(5)> (
     4:     set: (n) {
     5:         if(
     6:             <(n 0)
     7:             throw(`salary can't be negative`)
     8:             \\set(n)
     9:         )
    10:     }
    11: )

These formulas are `get`, `set`, `format`, `sort`, and `hash`.

## Configuration

All configuration of XPL occurs on the command line, with several command line arguments. To address this, XPL allows multiline shebang, enabling sane default arguments at the top of the file itself in the same syntax as the command line arguments. Finally, `.env` files containing environment variables and the environment variables themselves can override the shebang arguments.

Here's the order of precedence:

1. Command line arguments
2. Environment variables
3. `.custom.env` arguments with `-e custom`
4. `.env` arguments
5. Shebang arguments

The shebang syntax is even used in situations where there's no unix shell.

Let's say you have an XPL script, `fireTemps.en.xpl` that reads an `employees.xml` file and removes all the temps.

The xml file looks like this:

    <employees>
        <employee status="temp" id="1" />
        <employee status="temp" id="2" />
        <employee status="full" id="3" />
    </employees>

Your XPL script looks like this:

    /employees/employee[=(status `temp`)]: { delete() }

For this XPL script to modify the `employees.xml` file, you'll need to let it know what file it's receiving as input and how to handle that input. In this case, it's an XML file, so this would work:

    ~$ xpl fireTemps.en.xpl -t "text/xml" -c employees.xml

That's the command line way to do it. You can also do it in your shebang, so that you don't need to add any command line arguments for your script to work.

     1: #!/usr/bin/env xpl
     2: #! -t "text/xml"
     3: #! -c employees.xml
     4:
     5: /employees/employee[=(status `temp`)]: { delete() }

Then you can just enter this in the shell:

    ~$ xpl fireTemps.en.xpl

Or better yet, do a `chmod +x fireTemps.en.xpl` and then:

    ~$ ./fireTemps.en.xpl

You can also use environment variables, either through the environment or through a `.env` file in the same folder as the script.

You can have the shebang implement your sane and universal defaults for development, then use command line arguments or environment variables to run the same script in production or whatever.

| Short | Long            | Environment     | Description    |
| ----- | --------------- | --------------- | -------------- |
| `-t`  | `--type`        | XPL_TYPE        | Context type   |
| `-c`  | `--context `    | XPL_CONTEXT     | Context file   |
| `-H`  | `--host`        | XPL_DB_HOST     | Database host  |
| `-D`  | `--database`    | XPL_DB_NAME     | Database name  |
| `-U`  | `--user`        | XPL_DB_USER     | Database user  |
| `-P`  | `--pass`        | XPL_DB_PASS     | Database pass  |
| `-l`  | `--locale`      | XPL_LOCALE      | Language code  |
| `-d`  | `--debug`       | XPL_DEBUG       | Debug mode     |
| `-r`  | `--release`     | XPL_RELEASE     | XPL Release    |
| `-e`  | `--environment` | XPL_ENVIRONMENT | `.X.env` file  |
| `-o`  | `--output`      | XPL_OUTPUT      | Compile XPL    |
| `-m`  | `--module`      | XPL_MODULES     | Import modules |
| `-s`  | `--set`         | XPL_SET         | Set fields     |

### XPL_TYPE (`--type / -t`): Input type

There are three types of type:

* MIME

In the aforementioned example, we used `"text/xml"` to inform XPL of the mimetype of the context file. This wasn't actually necessary in this case, given that it could have been guessed by the `.xml` extension of the context file.

* Special

Special types include databases. For example:

    #!/usr/bin/env xpl
    #! -t mysql 
    #! -H localhost
    #! -D mywebiste
    #! -U user
    #! -P abc123

Pro-Tip: Including a password in the script is a terrible idea. In practice, use environment variables instead.

When you do this, the database becomes the context, and you can access it with path directives:

     1: #!/usr/bin/env xpl -t mysql -H localhost
     2:
     3: /wp_users[=(id 1)]: { set(user_login `webmaster`) }

* Filter

If you include an absolute or relative path to a `.xpl` module, then it will assume that module is a filter that accepts the input as raw text and builds the context model.

    ~$ xpl logReport.en.xpl -t ./logFilter.en.xpl -c website.log

For example, if you have a folder filled with a bunch of log files in a weird format, you can create a `logFilter.en.xpl` file that uses patterns, paths, and such to translate the data into a structured model. You can then apply that filter in other XPL scripts focused on reporting on the log information.

### XPL_CONTEXT (`--context / -c`): Context

XPL can optionally have a "context." If you're running XPL in the browser, then by default the context is the HTML's DOM. In the unix shell, you can pipe the STDIN, and that'll be the context. You can, of course, not have a context. It's optional.

### XPL_LOCALE (`--locale / -l`): Language code

A lot of things in life are culturally contextual. How currency is displayed, which words go in which order, and several other things are culturally contextual. By entering the language code, you dictate the default language and locale.

You may have noticed the `.en` before the `.xpl` in the XPL script filenames. This is a similar but different convention. That determines what language the script itself is written in.

    ~$ xpl sortWords.zh.xpl -l en

In that example, the `sortWords` script is written in Mandarin Chinese, with Chinese formula labels using Chinese characters. But since we made the locale `en`, the string formulas will expect English language inputs and have English language behavior.

If you're an English language speaker, all XPL asks is that you respect the best practice of including the `.en` in your script names. Aside from that, you can ignore all this and carry on oblivious to the fact that 80% of the world doesn't speak or read English.

A big goal of XPL is to be more usable for those who don't speak English, with forethought put into internationalization and localization concerns. While facts on the ground are what they are, people who aren't Americans will not be an afterthought.

### XPL_DEBUG (`--debug / -d`): Debug mode

| Mode | Name       | Description                  |
|:----:| ---------- | ---------------------------- |
|  0   | Production | No debugging, performant     |
|  1   | Dump       | record tracing dumps         |
|  2   | Debug      | Run debugging code           |
|  3   | Profile    | Include profiling hooks      |
|  4   | Rollback   | Permit time travel debugging |

By default, XPL runs at debug level `3`. If you're deploying to production, you probably want level `1`. Level `0` permits compressing and uglifying the code in ways that make figuring out what went wrong impossible, for potential performance and size gains. Level `4` is basically "memory leak mode," not cleaning up after any transaction in order to permit "time travel debugging."

### XPL_RELEASE (`--release / -r`): XPL Release

XPL rejects `semver` versioning in favor of a rolling release semantic for versioning. While it also determines which release of XPL is used to execute the code, it sets the default release of imported modules. As you'll see later, you can override this setting when importing modules in order to select specific tags and branches.

CY is "Current Year". For example, if the year is 2042, then `-r 2042` will use the 2042 release of XPL and try to pull modules with the git tag of `2042`.

| Year   | Label        | Description                         |
| ------ | ------------ | ----------------------------------- |
| CY + 0 | STABLE       | Enterprise production environments  |
| CY + 1 | TESTING      | Power users seeking latest features |
| CY + 2 | UNSTABLE     | Proceed with caution                |
| CY + 3 | EXPERIMENTAL | Expect library conflicts            |

The idea here is to establish a sane default. If you add a breaking feature change to your module's API, then you tag it with the EXPERIMENTAL release while you're working on it, then change it to the UNSTABLE year code when you're done. That will give downstream developers two years to make the changes necessary to work with your new interface.

### XPL_ENVIRONMENT (`--environment / -e`): XPL Environment

You can define more sophisticated control of your environment by creating multiple `.env` files:

    .testing.env
    .production.env
    .milwaukeee.env

This way, when you want to deploy the code on your Milwaukee office's server, you can just:

    ~$ xpl fireTemps.xpl -e milwaukee

Command line arguments and true environment variables can override these settings, but they will override the shebang and the `.env`. Importantly, `.env` is still read, but is overwritten by whatever's in here when you target a specific environment.

### XPL_OUTPUT (`--output / -o`): Compile XPL

, it will generate a WebAssembly module instead of interpreting the script.

### XPL_MODULES (`--module / -m`): Import modules

You can import modules through the environment or command line arguments, though the only reason you would want to do that is to override the shebang to grab a different release, tag, branch, or commit of a module.

Let's say your script imports `fs`, the filesystem module.

     1: #!/usr/bin/env xpl
     2: #! -m fs
     3:
     4: ~: { fs.pwd() }

But let's say there's an experimental new feature in `fs` that you want to use which isn't available in the stable release. Rather than changing your script, you could:

    ~$ xpl pwd.xpl --module fs#newFeature

This would override the default "STABLE" version and pull the "newFeature" branch of the module from the repo, using that instead.

You can use release years, tags, branches, or commit hashes.

Only XPL project folders, XPL files, and WebAssembly modules can be imported.

### XPL_SET (`--set / -s`): Set field

This enables the inclusion of integers, decimals, and strings into the batch definition of the `~` patch.

     1: #!/usr/bin/env xpl
     2: #! -m math
     3: #! -s circumference 40,075.0
     4:
     5: ~: (!circumference: ~) { pitch(getDiameter: <circumference>) }
     6:
     7: getDiameter: { /(%% math.pi) }

In this example, `getDiameter.en.xpl`, the program outputs the diameter in kilometers of the planet Earth. The circumference of Earth is set with a shebang declaration. This could be overriden with environment variables or the command line with a different number for different units of measurement, different planets, or whatever.

Notably, the `circumference` field is not flagged as nullable but is set as null (`~`). This means that a value must be passed to `circumference` or the patch can't instantiate. But since the definition is flagged as private (`!`), a module that imported it couldn't set the circumference. Only the `--set` directive can work here.

## Implementation

XPL is currently implemented as a node project, with `npm run cli` for the shell and `npm run web` for the browser. To begin with XPL, will be relying upon sqlite as a virtual machine.

First clone it:

    ~$ git clone git@github.com:xplanguage/xplang.git

Then go in and pull the dependencies...

    ~$ cd xplang/
    ~/xplang$ npm install

Then download the antlr jar...

    ~/xplang$ npm run getAntlr

Then generate the bindings from the EBNF files...

    ~/xplang$ npm run bind

Then create the test file where you'll be putting your test code:

    ~/xplang$ touch test/test.xpl

From there, you can run `npm run cli` or `npm run web` to see XPL in action. Happy hacking!

## Roadmap

- [x] Grammar
- [ ] Transpilation to database
- [ ] Instantiation and execution (JS)
- [ ] Migrate from sqlite to JS imports to WASM
- [ ] Implement WASM FFI
- [ ] Migrate to pure WAST

### Supplemental

- [ ] Vim syntax highlighting
- [ ] VSCode LSP
- [ ] Debug Adapter Protocol (DAP)
- [ ] XPL Studio
- [ ] Standard library

## Status

The grammar is mature. The current work is in using the listener to walk through the grammar and transpile it into its sqlite tabular representation.

There's some drudgery to be done in adapting the parser to permit the most elegant transpilation code. Once that's done, the first goal is to be able to write an anonymous table and have both its structure and its (integer-only) data stored in the database correctly.

I can't seem to get sqlite-wasm to work in node mode, and am stuck in the browser for now. The error appears to pertain to node-fetch. I'm hoping it gets resolved for me upstream.

## Issues

- [ ] Currently only working in browser

## Get Involved

I need help. Like, co-founder level help. Please help.
