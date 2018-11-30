History of Computer Syntax
==========================

## Basics and Early History

Computers understand a certain language. At its very root are the values "true" and "false". Add to this the logical operators "and", "or" and "not" and the have all you need to perform complex logical calculations. Here is what the 5 core symbols do:

    not true = false
    not false = true
    true and true = true
    true and false = false
    false and true = false
    false and false = false
    true or true = true
    true or false = true
    false or true = true
    false or false = false

There is also a thing called "xor" which return false if the operands are the same, and true if they are different:

    true xor true = false
    true xor false = true
    false xor false = false
    false xor true = true

It's amazing to think that all language and logic can be reduced to true, false, and, or, xor, and not, but it seems that it can; which is why computers were designed and built to use them. The hardware of the species of ape known as Homo sapiens was not made for working with these atomic ideas. They need bigger concepts, and ones that are analogous to symbols and operations built into their brains, or at least similar to concepts they learn are part of their habitat. It's nearly impossible to for a human to instruct a computer to do calculations using only 2 values and 4 operators, so quickly complexity was added for higher level abstractions that we could manage.

## Words

One of the first additions was the concept of a "word". This is a standard length collection of ordered true/false values. That length is arbitrary, but has historically been between 8 and 64 bits (binary digits, a value of either true or false.)

Now that there aren't only single true/false value, the operators need to be changed to handle a collection. From here on out, I will sometime use "1" to represent "true" and "0" for "false". It's shorter and clearer when looking at bit words, plus it maps to our concepts of numbers. Becuase these number use only two types of digits, the system is called "binary." I am going to use 8-bit words in examples because it is the shortest commonly-used word length.

    not 00000000 = 11111111
    not 11111111 = 00000000
    not 10010010 = 01101101

That should be intuitive. But what about "and" and "or"? They take two words and perform their operation at each position in the word, returning a new collection. For example:

        11001000
    and 10111000
        ========
        10001000

"Or" works similarly

       11001000
    or 10111000
       ========
       11111000

As does "xor"

        11001000
    xor 10111000
        ========
        01110000

A new operator was added to manipulate binary words - shifting bit in the words either left ("sl" for "shift left") or right ("sr" for "shift right") with created bits always false.

    sl 11111111 = 11111110
    sr 11111111 = 01111111

Organizing binary data into words and the new operators allowed people to start writing simple programs. And they are arguable the first increment in translating computer symbols into a version that people can more easily understand.

## "Bottom Up" Languages

