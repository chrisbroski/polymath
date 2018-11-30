Polymath
========

In the field of designing languages that make it easy to write code that is readable, there are very few. Python is the best of a meager lot. (Though I have also drawn inspiration from JavaScript, Ruby, YAML, and Erlang.)

So what would the next evolution of this type of language look like? Let's keep what we have learned and use Python as a starting point and make some incremental improvements.

## Qualities of Improvements

### Reducing complexity

If there are 10 similar ways to do something, but there only really needs to be 2, then make that happen. Avoid creating shortcut-style alternatives. Shortcut syntax makes learning and reading harder and its only benefit is saving key presses. Make the one true way short and simple (preferably) or learn to type faster.

### Reducing ambiguity

If two very different things are done is very similar ways, make them look more different. Reusing operators should be avoided. (But even I am having trouble not reusing the equals sign.)

Is this that important? I am finding that Daddy needs his sweet, sweet sugar. The syntax should be, at its core, rigorously logical. But shortcut syntax (a la YAML) should exist if it is clear and offers significant improvements.

### Lessons from Linters

Static code analysis is a great tool, but it is also a list of the failings of a language. Can we write a syntax that makes common types of linter warnings irrelevant?

Yes, by baking the linter into the complier: until the code is strictly formatted it will not compile.

### Reducing Verbosity

Eliminate structural code. The code should say what it is trying to accomplish, not leak through how the compiler thinks. Short and abbreviated terms for the core operators are fine, as long as they are understandable (even to a beginner.)

There are way too many extra characters in most languages. The problem with that is not that they take too long to type. The main problems are:

1. The decrease readability by obscuring the valuable information
2. They create unnecessary parsing errors.

## Ideas for Improvements

### Assignment

Using `=` for assignment has always been a terrible idea that is constantly repeated. Use a colon `:` instead. It's already in common use for assigning values to keys in objects.

### Data Structures

Python has 4 data structures: list, dictionary, tuple, and set. Ruby I think got this right by reducing it to 2: arrays and hashes. I don't like the term *hash*. It can be confused with the cryptographic type of hash. I think I am going to call these types *lists* (like Python) and *maps* (from "hash map").

Arrays are going to be 1-based. I hate you too.

### String Concatenation

This is a problem not only in overloading the `+` operator, but in writing messy code and optimization issues. Let's not allow it. Array joins and template syntax should be the only ways to create a string from parts. The best template syntax I have seen is *mustache*, though I think it could use some number formatting features. Template strings should be a core part of the system, and trivially usable from external files.

### Files Are Objects

My only *big* idea, inspired by Python's white space as code block delimiter is making the single way to define an importable object a separate file. These can be executed directly, imported as a library, or instantiated with a constructor. How to do this (and how to define public and private methods) I don't know yet.

### Conditionals and Bitwise Operators

You see logical and, or, and not as *and*, *or*, and *not*; *&*, *|*, and *!* and *&&*, *||*, and *!*. The reason for the doubling is the `&` and `|` or used in bitwise operators. I think Erlang got this right by using `band`, `bor`, and `bnot` for the bitwise operations so that the single characters could be reserved for (the arguably more commonly used) conditionals.

What about the ternary if? A lot of languages have this and as many recommend against it. What it didn't need to be explicitly created but was simply a side effect of other operators? That would allow it but ge tme off the hook for creating it. How about:

    val: ['a', 'b'] item (1 < 2) as int

### For / Next

I don't see any purpose for this as long as there is a good iterable generator with an `each` method.

### Scope

How to define scope? This would be a simpler question if there were no block structures. I eliminated for/next, could I get rid of if/else and do/while? That'd be cool if I could.

Whatever the scope delimiter is, I don't want to use a declaration syntax for using proper data names. Stick with Python's way: use the *global* declaration as a badge of shame.

I prefer *outscope* over *global*. These values don't span the globe, they are just externally scoped. Combining this with all-cap variables make bad code look bad. Also, this should be prohibited in a true function. You'll have to use `sub`, like a scrub.

    TOTAL: 0
    [1...10].each
        outscope TOTAL: TOTAL + 1

Maybe that will encourage programmers to write more like

    total: [1...10].reduce
        = index + acc

Scope should be to the container.

* Data can be read from the parent container.
* Anything declared inside a container is not accessible from outside.
* Variables can be changed in the parent scope only by using the `outscope` operator, otherwise it is treated as if it was declared in the container.

### Immutability

I can't see why making everything a const by default would be bad. If you want a modifiable data container, declare it in ALL CAPS. I know it's the opposite of convention, but I think its a good enough idea to warrant it.

### Asynchronous Programming

Python doesn't do this. JavaScript is OK at it. Erlang is the master. Not sure what to do about this, but I'd bet money that event listening and the actor model have a place.

### Block Delimiter

Like Python, I think indentation should be used. However I don't think it should be an arbitrary amount. It should be tabs, and only tabs.

In addition to just blocks, aren't function arguments blocks too? No, they are not, HOWEVER, built-ins like `each` and `reduce` should be. These are really core structural elements like `f`. I would say this is only if you are using a single function argument.

#### Do While

Would this work?

    loop {limit: 0.5}
        if rand() >= limit
            exit

So, how *while*, but has to have an explicit exit clause. Should this work with the *can* block? Not sure. More testing.

#### Switch Case

Use an object with function values

    switchcase:
        '5': f() = 'echinoderm'
        '8': f() = 'arachnid'
        '': f() = 'unknown

    switchcase[numberOfArms]

It's the default value that is not quite right. If I could figure that out, we could use that if if/else as well. How about:

if(x < 10, f(x) = x + 1)

#### Could I User Indentation for Function Arguments Too?

No, let's enforce a single map for all arguments.

### String Delimiters

All strings are multi-line and escape their delimiters with 2 delimiter characters.

* `'` - Single quotes for strings
* `` ` `` - Back ticks for templates
* `"` - Double-quotes for comments

Let's stick with a single quote `'`. Escape it with double single-quotes `''`. All strings are multi-line.

### Function Syntax

I've seen *function*, *fun*, *def*, and nothing. Would a simple *f* work? Maybe. Also, return syntax. I've seen *return*, setting the name of the function equal to a number, and simply returning the last value. As much as I like the simplicity of the 3rd approach, another way is required for early exiting functions, so now you need 2 ways and it's just a shortcut for whatever way that is. I am thinking about using `=`. Yes, I know now it's overloaded with conditionals, but using f() and = you could write something like this:

    f(x) = x * x

And I can't help but think that is kind of cool. It's what they already teach kids in math class. We won't have to do the `==` crap because when it means *return* it will always be the first character of a line (or immediately after a function declaration in lambdas.)

Also, forget special ways to name functions. I don't see the point of having two ways to do the same thing. If you want to name it, then:

    square: f(x) = x * x

I think I am OK with parentheses as arguments. Everything uses that and probably for good reason. I don't like how you can execute a function in Ruby without the parens. I like to know when I am firing it off versus when I just want to pass it around.

#### Subroutines

Subroutines are just sloppy functions. It's simplest to say that functions are subs with these rules:

* No outside scope variables or constants are allowed
* Must return something

Because no outside values are allowed, functions use all names implicitly as its arg map keys.

### Truth and Falsehood

Do we need both and NULL and an undefined? I hope not, but I am not sure. More research is needed.

I like truthy/falsy values, but like Python's, not JavaScript's. [] and {} should be false.

### Strings

Declaration: `myString: 'abcd'`

#### Methods

* myString.part(`start`, `end`) - Returns an inclusive part of an string between the start and end indicies. If *end* is not specified it defaults to the end of the string
* myString.in(`value`) - Returns the index of the value (0 if not found)
* myString.length() - Returns the length (duh)
* myString.split(`delimiter`) - returns a list split by the delimiter
* myString.at(`index`) - Return value at index

### Lists

Yeah, like Python I am going to call *arrays* *lists*: a bunch of values arranged in a particular order. And they are going to be 1-based! Seriously, this 0-based stuff is such a bad habit.

#### Iterator Generation Syntax

Use *iterize* syntax developed by me https://github.com/chrisbroski/iterize

#### Declaration

Make it just like JSON: `phyla: ['animal', 'plant', 'bacteria', 'fungus', 'protist']`

You can also use indentation and carriage return instead of a comma

    phyla:
        'animal'
        'plant'
        'bacteria'
        'fungus'
        'protist'

I will use the list named `aList` in the definitions and the `phyla` list in examples.

#### Methods

You can do lots of stuff...

##### Methods That Return List

* aList.add(`value or another list`) - Returns a list with the arguments added to the end
* aList.remove(`value or another list`) - Returns a list with the argument values removed
* aList.at(`value or another list`) - Returns a list with the argument values removed
* aList.part(`start`, `end`) - Returns an inclusive part of a list between the start and end indices. If *end* is not specified, it defaults to the end of the list
* aList.allExcept(`start`, `end`) - Returns a list minus the part specified by *start* and *end*. (*end* is optional.)
* aList.all(`function`) - Same as a typical *map* method
* aList.filter(`function`) - Returns a list only of the argument function return true

    phyla.filter(f(phylum) = phylum.at(1) == 'p')

##### Set Methods

These are methods that work on regular lists but are intended to inherently deal with duplicate items.

* aList.dedup() - Returns a list with duplicates removed
* aList.union(`another list`) - Returns a list of items that are in either list
* aList.intersect(`another list`) - Returns a list of items that exists in both arrays.
* aList.diff(`another list`) - Return a list of all items that exist in one, but not the other.

##### Methods That Return Nothing

`each` is a block method who's argument map includes the keys *item* and *index*

    phyla.each
        out(`{{arg.item}}, {{arg.index}}`)

##### Methods That Return Other Things

* aList.in(`value`) - Returns the index of the value (0 if not found)
* aList.length() - Returns the length (duh)
* aList.reduce(`f(accumulator, valueA, valueB)`, `initial accumulator value`)
* aList.join(`delimiter`) - Returns a string of all array values joined by the delimiter
* aList.at(`index`) - Returns value at index

## Math

### Operators

* `+`, `-`, `*`, `/` - typical
* `%` - remainder
* `**` exponent
* `|` - absolute value `positiveTwo = |-2|`

### Functions

* `ceil(x)`, `floor(x)`, `round(x)`
* `factorial(x)`
* `mod(x)`
* `log(x, base)`
* `sqrt(x)`
* `acos(x), asin(x), atan(x), atan2(x, y), cos(x), sin(x), tan(x)`
* `rand()` - time-seeded random
* `rand(x)` - time-seeded random integer between 1 and x, inclusive
* `rand(x, y)` - time-seeded random integer between x and y, inclusive
* `prand(seed)` - explicitly seeded random
* `sha(x)` - SHA-256 of x

### Constants

* `pi`
* `e`
* `true`
* `false`

## Logic

Conditional operators return booleans

* `is` - equals
* `~(precision)` - floating point comparison
* `>` - greater than
* `>=` - greater than or equal to
* `<` - less than
* `<=` - less than or equal to
* `!=` - does not equal
* `and`
* `or`
* `not`
* `(`, `)` - for order grouping

## Templates

Templates will use mustache syntax, for now. I am not yet certain that adding more advanced formatting is a good or evil.

Use the backtick like in JS template literals, or use the *as* syntax.

    tmpl: as(template, '{{one}} and {{two}}')

Templates should also be able to be easily imported from external files. These files should be able to contain multiple templates separated by a delimiter. If so, importing creates a dictionary object using the delimiter names as keys

> # greeting
>
> Hello, {{name}}! I hope you are {{state}}.
>
> # sql statement
>
> SELECT *
> FROM table
> WHERE id = {{id}}
>

There is no need to escape the hash (#). If a line starts with a hash, its a key name, unless it comes after a line that starts with a hash

## Regular Expressions

These will be the same as JS. Slashes can be used or `as(regex, value)` syntax.

## Core Types

Polymath is strongly, but implicitly, typed. It can guess by the context, or force using the `as` syntax.

* **string** - Declare by surrounding with single-quotes `'Tyrannosaurus'`
* **integer** - Declare by using only 0-9 and the minus `-` sign: `5`, `-33`
* **float** - Declare by using a decimal point. May include exponent: `1.`, `1.23e5`
<!-- * **real** - Declare by using a decimal point. May include exponent: `1.`, `1.23e5`. Includes a precision of significant digits
* **money** - Preface with a dollar sign: `$1`, `$1.235e5` -->
* **list**, Declare by surrounding with brackets `[]`
* **map**, Declare by surrounding with brackets `{}`
* **template**, Declare by surrounding with back-ticks ````
* **regex**, Declare by surrounding with slashes `/`
* **sub**, Declare with `sub()` syntax
* **function**, Declare with `f()` syntax
* **json**, You must as *as*, because it looks just like a map object. In fact, it *is* a map object, just with more stringent parsing - it must contain only the basic JSON data types.

(Should there be a binary buffer type too?)

* type `value` - returns type name as a string
* `value` as `typename` - Returns a conversion from one type to another, if possible. If no typename is specified, it will guess.
* raw `value` - returns a representation of the actual binary data
* isnumber `value` - Special *is* function that will return true for all numeric types and strings that can be cast to numeric.

## Maps

Maps can be declared just like JSON: with brackets. Like lists you can replace the comma with an indent and carriage return.

    myMap:
        cat: 'mammal'
        dog: 'mammal'
        shark: 'fish'

How does the parser know if this is a map, or an array of maps? How about this rule: if all items are maps, then its parent is a map. If you want to force an array of maps, then you will need to explicitly use brackets.

    myArray: [
        cat: 'mammal'
        dog: 'mammal'
        shark: 'fish'
    ]

Key names that are preceded by an underscore `_` are private - they are only accessible from inside the map.

* `clone *map*` - Returns a duplicate map without any inheritance to the original object
* `spawn *myMap*` - Return a new map that has prototypal inheritance with its parent
* `each *map*` - loops through the map with arg.key, arg.val
* `keys *map*` - returns a list of key names.

## Modules

All modules are files. Using `import` finds the file, then parses it as a *map*. All top-level container names are keys. Inline code is ignored. If the import has arguments, then trigger a constructor somehow.

## Bitwise

These are from Erlang.

* `bnot` - Unary bitwise NOT
* `band` - Bitwise AND
* `bor` - Bitwise OR
* `bxor` - Arithmetic bitwise XOR
* `bsl` - Arithmetic bitshift left
* `bsr` - Bitshift right

Core Programming Paradigms
==========================

## Delimiting

The complier needs to know when something starts and when it ends, wether it be a piece of data, a command, a statement, or a block of statements. The most common a space, a carriage return, a semi-colon, curly brackets (C-based languages love semi-colons and curly brackets,) square brackets, single and double quotes, and parentheses (Lisp inspired languages love these.)

TODO: catalog the types of delimiting, research what has been used in different languages and examine the good and bad of it. What is the least amount of delimiters needed? Is it better to have as few as possible versus different characters for different types of delimiting?

## Grammar

A statement is the basic unit of code and is analogous to a linguistic sentence: `Subject -> verb -> object`

## Blocks

Blocks are containers of statements. They can contain other blocks. There needs to be rules about the interface of a block with other statements and blocks.

Blocks are not just about organization. They are about modularity: keeping code in one block from interfering with code in another.

Notes
=====

## Block Structure

value: do sub {a: 1, b: 2}
    "This is equivalent to arg.a + arg.b"
    = a + b

*can* is OK. These might be better:

* bag
* pod
* block

val: loop 5
    if rand(10)

Would it be OK to force all data structures to only allow a single argument? I dont' see why not as long as that argument is a map. All assigned constants and variables become keys of that argument map. This would go along with the "no tuples" rule - functions would not be a weird exception.

## Basic Types

Everything is either a container, an operator, a structure, or a datum.

### Containers

* `do` - Executes a required operand of type *f* or *sub*.
* `loop` - Executes the code in its container forever or until an exit statement. Can use input from an optional *map* operand.
* `if` - Evaluates a required parameter of a logical statement. Returns *true* or *false* unless there is a following block, then it returns whatever that specifies, if anything. Can chain with the `else` and `elseif` blocks.
* `sub` - Defines a generic block of code
* `f` - Defines a block of code that must return something and is forbidden from reading values from the parent scope.

### Operators

#### Math

* `+`, `-`, `*`, `/` - typical
* `%` - remainder
* `**` exponent
* `|` - absolute value `positiveTwo = |-2|`

#### Type

* `type *datum*` - returns type name as a string
* `*datum* as *typename*` - Returns a conversion from one type to another, if possible. If no typename is specified, it will guess.
* `raw *value*` - returns a representation of the actual binary data
* `isnumber *datum*` - Special *type* function that will return true for all numeric types and strings that can be cast to numeric.

#### Logical

* `is` - equals
* `~(precision)` - floating point comparison
* `>` - greater than
* `>=` - greater than or equal to
* `<` - less than
* `<=` - less than or equal to
* `!=` - does not equal
* `and`
* `or`
* `not`
* `(`, `)` - for order grouping

## Research

I should check out Scheme. Ugh, that could take time.

I looked at racket. I was not impressed. Maybe Haskell is the way to go.

## Key coding examples

Fibonacci is always good. Some simple "Hello World" examples and some complex, multi-module ones too.

### Fibonacci

    fib: f(n)
        if n = 0
            : 0

        if n = 1
            : 1

        : fib(n - 1) + fib(n - 2)

    each item from [0...10]
        out fib(item)

## DOM

Use what we've learned from jQuery to create the interface to an HTML doc.

    el: doc '#css .query'

What exactly have we learned from jQuery?

* One selector that uses css selectors only (no `getElementById` and `getElementsByTagName`)
* All methods should act on the output of an element selector should work on a collection the same as a single element
* The selector can also be used as a creator if the argument is a hash instead of a string
* Those verbose method names of the vanilla JS DOM aren't helpful at all

### Methods of doc

* text: return or replaces text body of element
* append: added and el at the end of the parent element's content
* on: attaches a listener
* attr: gets and sets attributes
* prop: adds and removes solitary properties
* frag: creates a doc fragment
* class.add
* class.remove

### Methods of win

