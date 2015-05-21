Polymath (Language)
===================

Polymath is a computer programming language designed with a programmer in mind. Is the syntax easy to parse or execute? I don't care. It should be intuitive, easy to type, and easy to read.

Math is at its core, especially algebra (as taught in school.) A programmer shouldn't have to learn a new mathematical notation to start programming. You should be able to write something like f(x) = 2x and have it make sense.

It borrows good ideas from the history of languages. Notably Python (block denoting with indentation) and JavaScript (JSON.) It also tries to avoid repeating mistakes (multiple uses for the = and + operators for instance.)

    Assignment            :
    Equality              =
    Type coerced equality ~
        if 2 strings, trim and lowercase, if 2 numbers, specific the precision of the                         
        comparison like 1 ~5 1.0000001 returns true
    Return                = (at start of line in algebraic function)
    Multiline Comment     ` (start and end)
    std or console out    out
    define function       f()

String concatenation: none\! Use mustache '{{0}}{{1}}'.format(['a', 'b'])  
Mustache default "string".format(data)  
Math default complex numbers, integration, differentiation  
JSON support (including functions)  
url(path) returns a cookieless http GET response body  
jQuery DOM for web

###Function define

    FunctionName1: f(x)
        = 2x

Uses hanging indents like Python for blocks. To write 1-liners do

    FunctionName2: f(x) = 2x

Functions can only have one parameter, but since you can use JSON, that complexity

###Public Functions

A function that is built to be accessed outside of its module must be explicitly declared (somehow.)

###Identifiers
Constants start with a capital letter, variables with a small (cannot start with a number)
All variables and constants have an optional 'desc' property that can be set once
"Plain" variables and arrays are actually objects like so

    x: 1

is actually

    x: {default: 1, desc: ''}

Variables are private by default
Global variables can be made by declaring an object in module scope. There is automatically a default in each module called "global"

    global: {}

And can assign like so

    global.var: 10

#####Cannot begin with
1234567890

#####Cannot contain the following
:=[]()&|{}!"%&'*+,-./:;<>?`~·
whitespace like: space, tab, carriage return

#####Can include
Extended Latin (U+00C0 - U+024F)
Basic Greek (U+0391 - U+03A1, U+03A3 - U+03A9, U+03B1 - U+03C9)
Latin extended additional (U+1E00 - U+1EFF)

#####Maybe
$@#

###Data Types
string, float, int, money, array, object, function, polynomial

###Conditionals

    if x = 3
        out('not 3')

    if 'a' = input & accept
        process(input)

Uses 'truthy' evaluation same as JavaScript

Can combine < and >

    if 3 > x > 1
        out('twoish')

###Math

    + 	  unary +
    - 	  unary -
    + 	  addition
    - 	  subtraction
    * 	  multiplication
    /     division
    ^     Exponent
    cos(x)
    acos(x)
    sin(x)
    asin(x)
    tan(x)
    atan(x)
    atan2(x, y)
    abs(x)
    ln(x)
    ceil(x)
    floor(x)

####Integer Math

    bnot   unary bitwise not
    band   bitwise and
    bor    bitwise or
    bxor   arithmetic bitwise xor
    << 	   arithmetic bitshift left
    >> 	   bitshift right
    >>>    Zero-fill right shift

####Random

    rand(seed)                returns random float between 0 and 1
    randNormal(mean, stdev)   returns normal distribution random from the mean
    array.rand(seed)          Technically an array method but worth mentioning

###Loops

Not sure yet. Probably go through an array, plus array creation syntax.

    for i, n in [1, 2, 3]
        total: total + n

Iterators in for loops (1 and n in this example) are private to the block, but nothing else is.

    x: 5
    while x > 0
        x: x + 1

###Array

Creation syntax like so

    arrayA: [1...8] `Default is incrementing by 1`
    arrayB: [1, 3...15] `If two starting numbers, increment is the difference between them`
    arrayC: [1, 2, 4...512] `If three starting numbers, increment is by multiply of the divisors between them`
    ArrayD: array1[20, 30...100][1000]array3[123...456] `Build larger arrays with auto-concatenating of adjacent arrays`
    arrayE: array1[]array2 `use empty arrays to glue variable or constant arrays together`

Array indices are 1-based. This is a major difference from traditional languages but if done right, should prevent many fence post errors. All indices are also meant to be inclusive.

    arrayA[1;5]

I had to use a semicolon somewhere! This is a programming language after all. This will return elements 1, 2, 3, 4, and 5 or array1. Isn't that clear?

    array1.find('banana') `returns 0 not -1 which is dumb`

'find' is like indexOf but makes more intuitive sense. You can even use it inside a slicer

    arrayA[2; find(13)]

It will assume that is is supposed to find in its parent array.

Return a random item from an array

    arrayA.rand(seed)
    > 4

###Misc
A carriage return is a line ending except for string, comment, and algebraic types which are always multi-line.

White space is almost entirely optional for formatting, except indentation

Files are "modules" with private scope. Modules are imported into a local object like so

    Time: url('time.oc', other, initial, params);

If this compiles to JS, import JS directly. If an .oc extension, compile to JS. Either way, the imported modules need to be wrapped and instantiated somehow.
