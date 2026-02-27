; Keywords
"theory" @keyword
"imports" @keyword
"begin" @keyword
"end" @keyword
"lemma" @keyword
"theorem" @keyword
"definition" @keyword
"datatype" @keyword
"where" @keyword
"proof" @keyword
"apply" @keyword
"by" @keyword
"done" @keyword
"sorry" @keyword
"assume" @keyword
"have" @keyword
"show" @keyword
"qed" @keyword

; Inner Syntax (The Math/Logic parts)
(inner_syntax) @string

; Identifiers
(theory_definition (identifier) @type)
(definition_command (identifier) @function)
(lemma_command (identifier) @function)
(theorem_command (identifier) @function)
(method (identifier) @function.builtin)

; Fallback for any other identifier
(identifier) @variable

; Comments
(comment) @comment
