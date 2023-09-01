parser grammar xplParser;

options {
    tokenVocab = xplLexer;
}

parse: (freeFormulaic | patchDef)* EOF;

freeFormulaic: formulaicPiped;

formulaic: (parentCall? formulaCall) | (parentCall? field) | table | string | number | context | placeholder;
formulaCall: exceptional | (formulaLabel formulaCallItem* ParenClose);
formulaLabel: (field ParenOpen | FormulaChar+);
formulaCallItem: (label Assign)? formulaic;
parentCall: ParentCall;
context: Context;
placeholder: Placeholder;

exceptional: exceptionalLabel Assign Assign exceptionalCatch? formulaCallItem?;
exceptionalCatch: BraceOpen formulaic BraceClose;
exceptionalLabel: Label;

type: typeFormulaic | null | typeString | typeBool | typeTable |
    ((TypeCustom typeLabel) (ParenOpen formulaCallItem+ ParenClose)?);
typeTable: TypeTable;
typeBool: TypeBool;
typeString: TypeString;
typeFormulaic: TypeFormulaic;
typeLabel: Label;

table: (ParenOpen batch ParenClose)? (TableOpen formulaic* TableClose)+;

formulaDef: (ParenOpen batch ParenClose)? CurlyOpen formulaicPiped CurlyClose;
formulaicPiped: alias? formulaic piped?;
piped: Pipe alias? formulaicPiped;
alias: Label Assign;

batch: batchItem+;
batchItem: type? protect? priv? batchLabel mutable? nullable? unique? (Assign (formulaic | formulaDef | table | null))?;
protect: Bang;
priv: Bang;
mutable: Bang;
nullable: Bang;
unique: Star;
batchLabel: Label;
null: Null;

hatch: formulaicPiped;

label: Label;
module: Label;
field: (module Dot)? label;

patchParent: BraceOpen formulaic BraceClose;
patchDef: (((label | field | number | string | formulaCall | pattern | null ) Assign) | path) Assign patchParent? (patchBatch patchHatch | patchBatch | patchHatch);
patchBatch: (ParenOpen batch ParenClose);
patchHatch: (CurlyOpen hatch CurlyClose);

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

patternMultiline: PM_Open (patternMultilinePart | patternMultilineField)* PM_Close;
patternMultilinePart: PM_Part+;
patternMultilineField: PM_FieldOpen formulaic? CurlyClose;

string: StringOpen (stringPart | stringField)* S_StringClose;
stringPart: S_StringPart+;
stringField: S_StringFieldOpen formulaic? CurlyClose;
