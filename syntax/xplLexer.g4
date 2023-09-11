lexer grammar xplLexer;

channels {
	COMMENTS,
	ANNOTATIONS,
	HASHBANG
}

BraceOpen: '<';
BraceClose: '>';

ParenOpen: '(';
ParenClose: ')';

TableOpen: '[';
TableClose: ']';

FormulaChar: [-~!@#$%^&_+*=<>?/]+ ParenOpen;

Context: '%%';
Placeholder: '%';
Star: '*';
Bang: '!';
Assign: ':';
Pipe: '|';
Dot: '.';
ParentCall: '\\\\';

Null: '~';
TypeCustom: '@';
TypeFormulaic: '@@';
TypeTable: '#';
TypeBoolean: '&';
TypeString: '$';

HexInteger: '-'? '0' [xX] HexDigit (HexDigit | ',')*;
OctalInteger: '-'? '0' OctalDigit (OctalDigit | ',')*;
DecimalInteger: '0' | [1-9] (DecimalDigit | ',')* | DecimalDigit+ ExponentPart;

Decimal: '-'? DecimalInteger (
        Dot DecimalDigit* ExponentPart?
        | DecimalDigit+ ExponentPart?
        | DecimalInteger ExponentPart?
    )?;

Label: [\p{L}_-] [\p{L}\p{N}_-]*;

fragment DecimalDigit: [0-9];
fragment HexDigit: [0-9a-fA-F];
fragment OctalDigit: [0-7];
fragment ExponentPart: [eE] [+-]? DecimalDigit+;

Ws: [\p{White_Space}] -> skip;
Comment: '#*' .*? '*#' -> channel(COMMENTS);
CommentLine: '##' ~[\r\n\p{Zl}]+ -> channel(COMMENTS);
Annotation: '#:' ~[\r\n\p{Zl}]+ -> channel(ANNOTATIONS);
HashBang: '#!' ~[\r\n\p{Zl}]+ -> channel(HASHBANG);

CurlyOpen: '{' -> pushMode(DEFAULT_MODE);
CurlyClose: '}' -> popMode;

PATH_Open: '/' -> pushMode(PATH);
PATTERN_Open: '\'' -> pushMode(PATTERN);
PM_Open: '^' -> pushMode(PATTERN_MULTILINE);

StringOpen: '`' -> pushMode(STRING);

mode PATH;
PATH_Part: PATH_Literal+;
PATH_Dig: '//';
PATH_Dir: '/';
PATH_Esc: '\\:';
PATH_FieldEsc: '\\{';
PATH_FieldOpen: '{' -> pushMode(DEFAULT_MODE);
PATH_Literal: PATH_Esc | PATH_FieldEsc | ~[/:{];
PATH_Close: ':' -> popMode;

mode PATTERN;
PATTERN_Part: PATTERN_Literal+;
PATTERN_Esc: '\\\'';
PATTERN_FieldEsc: '\\{';
PATTERN_FieldOpen: '{' -> pushMode(DEFAULT_MODE);
PATTERN_Literal: PATTERN_Esc | PATTERN_FieldEsc | ~['{];
PATTERN_Close: '\'' -> popMode;

mode PATTERN_MULTILINE;
PM_Part: PM_Literal+;
PM_Esc: '\\^';
PM_FieldEsc: '\\{';
PM_FieldOpen: '{' -> pushMode(DEFAULT_MODE);
PM_Literal: PM_Esc | PM_FieldEsc | ~[^{];
PM_Close: '^' -> popMode;

mode STRING;
S_StringPart: S_StringLiteral+;
S_StringEsc: '\\`';
S_StringFieldEsc: '\\{';
S_StringFieldOpen: '{' -> pushMode(DEFAULT_MODE);
S_StringLiteral: S_StringEsc | S_StringFieldEsc | ~[`{];
S_StringClose: '`' -> popMode;
