## Readme

#*

[3 `fizz`]
[5 `buzz`]

 `The answer is { +(21 21) }.`

 +(21 21)

 /(1,024 24)

 (y: { +(*(m x) b) } m x b)
     [14 2 14]
     [7  3 21]

## single line comment

#*
    multiline comment
*#

#: annotation comment

#! inline shebang

~: (a: 6.481) { *(a a) }

42

0x2A

052 ## also 42

4.2e1 ## also 42

~: ($greeting: `Hello, world!`) { greeting }

`Hello, world!`

`The answer is { *(14 3) }.`

`The answer is \{42}.`

~: (&isProduction: 1) { if(isProduction `We're live!`) }

~: (
    #slopeTable: (y: { +(*(m x) b) } m x b)
    [3 7 21]
) { slopeTable }

~: (
    @@ y: { +(*(m x) b) }
    m
    x
    b
)

+(*(-8 -4) -33)

*(-8 -4) | +(% -33)

/(dividend: 504 divisor: 12)

~: { pitch(cutInHalf: <> 84)}

cutInHalf: (cutMe) { /(cutMe 2) }

 ~: { pitch(cutInHalf: <84>) }

cutInHalf: { /(%% 2) }

~: { pitch(cutInHalf: <[84][-84]>) }

cutInHalf: { /(%% 2) }

~: { throw(42: <`Moon`>)}
42: { `Good night, {%%}.` }

~: { throw(42: <>)}
%(%% 2): { `It's even!` }

~: { throw(42: <>)}
=(/(84 2)): { `It's 42!` }

~: { throw(`bananas`: <>) }
's$': { `It ends with the letter s` }

/img{=(id `kittens`)}: { set(src `kittens.jpeg`) }

~: (
    !a ## protected
    !!a ## private and protected
    a* ## mutable
    a~* ## nullable and mutable
    a[*] ## unique
)

_(id)

nameIndex: _(firstName lastName)

cityKey: _(city cityList.cityName)

~: (
    @number(precision: 2 scale: 0 radix: 10) n: 42
)

#!/usr/bin/env xpl
#! -m fs

fs.readFile(`example.xml`)

~: (@salary payroll: 1,000)

salary: <number(5)> (
    set: (n) {
        if(
            <(n 0)
            throw(`salary can't be negative`)
            \\set(n)
        )
    }
)

/employees/employee[=(status `temp`)]: { delete() }

#!/usr/bin/env xpl
#! -t "text/xml"
#! -c employees.xml

/employees/employee[=(status `temp`)]: { delete() }

#!/usr/bin/env xpl -t mysql -H localhost

/wp_users[=(id 1)]: { set(user_login `webmaster`) }

#!/usr/bin/env xpl
#! -m fs

~: { fs.pwd() }

#!/usr/bin/env xpl
#! -m math 
#! -s circumference 40,075.0

~: (!circumference: ~) { pitch(getDiameter: <circumference>) }

getDiameter: { /(%% math.pi) }













