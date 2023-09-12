parser grammar xplParser;

options {
    tokenVocab = xplLexer;
}

parse: (patchDef | freeFormulaic)* EOF;

freeFormulaic: formulaicPiped;

formulaDef: batch? CurlyOpen formulaicPiped CurlyClose;
formulaicPiped: alias? formulaic piped?;
piped: Pipe alias? formulaicPiped;
alias: Name Assign;

formulaic
	: (parentCall? formulaCall)
	| (parentCall? field)
	| exceptional
	| table
	| string
	| number
	| context
	| placeholder
	| null;

formulaCall: formulaName formulaCallItem* ParenClose;
formulaName: (field ParenOpen | FormulaChar+);
formulaCallItem: (name Assign)? formulaic;
parentCall: ParentCall;
context: Context;
placeholder: Placeholder;

exceptional: formulaName matcher (BraceOpen caught? BraceClose) formulaCallItem* ParenClose;
caught: formulaic;
matcher: ((formulaic | pattern) Assign) | path;

table: (batch tableData) | batch | tableData;
tableData: tableRow+;
tableRow: TableOpen tableField* TableClose;
tableField: formulaic;

patchDef: matcher patchParent? (batch hatch | batch | hatch);
patchParent: BraceOpen formulaic BraceClose;

batch: ParenOpen  batchItem* ParenClose;
batchItem: type? prot? priv? batchName nullable? mutable? unique?
	(Assign batchDefault)?;
batchDefault: formulaic | formulaDef | null;
prot: Bang;
priv: Bang;
nullable: Null;
mutable: Star;
unique: TableOpen Star TableClose;
batchName: Name;
null: Null;

hatch: CurlyOpen formulaicPiped* CurlyClose;

type: typeFormulaic | null | typeString | typeBoolean | typeTable |
	(TypeCustom typeName) (ParenOpen formulaCallItem+ ParenClose)?;
typeTable: TypeTable;
typeBoolean: TypeBoolean;
typeString: TypeString;
typeFormulaic: TypeFormulaic;
typeName: Name;

name: Name;
module: Name;
field: (module Dot)? name;

number: decimalInteger | decimal | hexInteger | octalInteger;
decimalInteger: DecimalInteger;
decimal: Decimal;
hexInteger: HexInteger;
octalInteger: OctalInteger;

path: PATH_Open (pathPart | pathDirect| pathDig | pathField)* PATH_Close;
pathPart: PATH_Part+;
pathDirect: PATH_Dir;
pathDig: PATH_Dig;
pathField: PATH_FieldOpen formulaic? CurlyClose;

pattern: patternEasy | patternMultiline;

patternEasy: PATTERN_Open (patternEasyPart | patternEasyField)* PATTERN_Close;
patternEasyPart: PATTERN_Part+;
patternEasyField: PATTERN_FieldOpen formulaic? CurlyClose;

patternMultiline:
	PM_Open
	(patternMultilinePart | patternMultilineField)*
	PM_Close;

patternMultilinePart: PM_Part+;
patternMultilineField: PM_FieldOpen formulaic? CurlyClose;

string: StringOpen (stringPart | stringField)* S_StringClose;
stringPart: S_StringPart+;
stringField: S_StringFieldOpen formulaic? CurlyClose;
