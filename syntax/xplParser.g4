parser grammar xplParser;

options {
    tokenVocab = xplLexer;
}

parse: (freeFormulaic | patchDef)* EOF;

freeFormulaic: formulaicPiped;

formulaic: (parentCall? formulaCall) | (parentCall? field) | table | string | number | context | placeholder | null;
formulaCall: exceptional | (formulaLabel formulaCallItem* ParenClose);
formulaLabel: (field ParenOpen | FormulaChar+);
formulaCallItem: (label Assign)? formulaic;
parentCall: ParentCall;
context: Context;
placeholder: Placeholder;

exceptional: exceptionalLabel Assign Assign exceptionalCatch? formulaCallItem?;
exceptionalCatch: BraceOpen formulaic BraceClose;
exceptionalLabel: Label;

type: typeFormulaic | null | typeString | typeBoolean | typeTable |
    ((TypeCustom typeLabel) (ParenOpen formulaCallItem+ ParenClose)?);
typeTable: TypeTable;
typeBoolean: TypeBoolean;
typeString: TypeString;
typeFormulaic: TypeFormulaic;
typeLabel: Label;

formulaDef: batch? CurlyOpen formulaicPiped CurlyClose;
formulaicPiped: alias? formulaic piped?;
piped: Pipe alias? formulaicPiped;
alias: Label Assign;

batch:ParenOpen  batchItem* ParenClose;
batchItem: type? protect? priv? batchLabel mutable? nullable? unique? (Assign batchDefault)?;
batchDefault: formulaic | formulaDef | null;
protect: Bang;
priv: Bang;
mutable: Bang;
nullable: Bang;
unique: Star;
batchLabel: Label;
null: Null;

hatch: CurlyOpen formulaicPiped* CurlyClose;

patchParent: BraceOpen formulaic BraceClose;
patchDef: (((label | field | number | string | formulaCall | pattern | null ) Assign) | path) Assign patchParent? (batch hatch | batch | hatch);
patchBatch: batch;

table: (batch tableData) | batch | tableData;
tableData: tableRow+;
tableRow: TableOpen tableField* TableClose;
tableField: formulaic;

label: Label;
module: Label;
field: (module Dot)? label;

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
