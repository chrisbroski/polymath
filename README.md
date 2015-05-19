Polymath
========

Defintion for a computer language designed for clear and simple scientific code.

Purpose
-------

It has been wisely said "Programs must be written for people to read, and only incidentally for machines to execute." But yet in 2015 our programming languages still look like machine code smothered in words. Polymath is an attempt to take what we know about code readability and maintainability and apply it to the language design process without concern for how a machine might execute it. It should natively handle how students are taught to express mathematics (for better or worse.)

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

Precision is important in floating point math. 

Basics
------

Polymath is a dynamically typed, garbage-collected, interpreted lanugage influenced by the most powerful abilities of Python and JavaScript. Examples of implementation will use JavaScript.
