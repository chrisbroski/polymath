Polymath
========

Defintion for a computer language designed for clear and simple scientific code.

Pointless Introduction
----------------------

Leonardo DiVinci was the original polymath and the standard against which all renaissance men are held to. He was a brilliant engineer and artist. If that could be expressed mathematically, I would call it "Leonardo's Formula"

    Art + Science = Awesome!

Purpose
-------

It has been wisely said "Programs must be written for people to read, and only incidentally for machines to execute." But yet in 2015 our programming languages still look like machine code smothered in words. Polymath is an attempt to take what we know about code readability and maintainability and apply it to the language design process without concern for how a machine might execute it. It should also learn from what we have tried and failed at. Making computer code look like English is not an improvement. Spoken human languages are meant for chit-chat at a cocktail party, not to rigidly define machine instructions. To do that, you should use math. If you know math, you should know Polymath and vice-versa. It should natively handle how students are taught to express mathematics (for better or worse.)

Three Number Types
------------------

It should handle scientific (floating-point,) discrete (integer,) and monetary calculations differently. In a calculation, if all numbers are integers, it uses discrete math. If there is at least one float, it uses scientific (converting integers to max precision) unless there is at least one money. A single money type will cause the output to have a fixed number after the decimal equal to the largest number of digits after the decimal in all terms (minimum 2.)

###Scientific

These are double-precision (64-bit) floats. Calculations with all floats (or floats and integers) are rounded to the least precision of all floating-point values.

Force strings, money, integers to scientific notation:

    float('1')

###Integers

Calculations with all integers will only use integer math and only return integer answers. 

Force strings, money and floats to Integers:

    int(1.7)

###Money

If there is one money value, then calculations should return money rounded to a fixed decimal of the most fractional digits of all money terms. For example:

    $10.0 * 0.06
    > $0.6

Force anything to money by putting a $ in front of it.

The default rounding method should be able to be changed somehow. (round-to-even, round up, away-from zero, etc.)

Functions
---------

    f(x) = 2x + 3

The above is a legitimate function in Polymath. It should also handle measurement units and conversions using ratios.

    3.1415 * 3.086'cm'^2

would return

    29.92'in^2'

Here is how a conversion could be done

    inToCm: f(1) = 2.54'cm' / 1.00'in'
    3.086'cm'^2 / inToCm

returns

    1.21'cm/in'

Precision is important in floating point math, but not money.

    10.00$ * 7%

$ and % are special units. $ will calculate the result and round to a fixed number of decimal places equal to the highest number in the calculation. % is a shortcut to divide by 100.

What about modulus?

That is a side-effect of integer division. Dividing discrete numbers returns and object with an R property.

    (5 / 2).R

returns

    1

Basics
------

Polymath is a dynamically typed, garbage-collected, interpreted lanugage influenced by the most powerful abilities of Python and JavaScript. Examples of implementation will use JavaScript.

Calculations with Strings
-------------------------

It is prefectly fine to perform math on strings. They are treated like mathematical variables. For example:

    5.0 + 'hello'
    > 5.0 + 'hello'
    5.0 * 'banana'
    > 5.0'banana'
    5.0'banana' / 'banana'
    5.0
    cm: 'cm'
    pi: 3.14159
    8.12cm * pi
    > 25.5cm

Symbols
-------

If at all possible, symbols should be for one thing only. No doubling up of symbols due to conflation of purpose, or drawing silly arrow and other emoji to create compound symbols.

    ~ Almost equal to. Used to compare floating-point values with a precision. i.e. 5.000 ~3 5.001
    ! 
    @ 
    # 
    $ Indicator of money number type
    % Shortcut for / 100
    ^ To the power of
    & 
    * Multiply
    () Function parameters and nesting mathematics. Crap that's 2 things.
    _ 
    + Addition
    ` Start and end of comments (multiline)
    - Subtraction
    = Comparison
    [] List (like JSON)
    {} Object (like JSON)
    \ 
    |
    ; 
    ' start and end string literal
    : return
    " 
    , separator for element in arrays and object
    . Numeric decimal
    / Division
    < Less than
    > Greater than
    ? 

I suppose >= and <= are OK though. To avoid overloading, logical operators will use words.

    and
    or
    not

And bitwise operators will borrow from Erlang.

    bnot - Unary bitwise not
    band - Bitwise and
    bor - Bitwise or
    bxor - Arithmetic bitwise xor
    bsl - Arithmetic bitshift left
    bsr - Bitshift right

