module.exports = grammar({
  name: "isabelle",

  // Extras allow these rules to appear anywhere, typically used for whitespace and comments
  extras: ($) => [/\s/, $.comment],

  rules: {
    // The entry point of an Isabelle theory file
    source_file: ($) => seq($.theory_definition, repeat($._command), "end"),

    // theory Name imports A B begin
    theory_definition: ($) =>
      seq("theory", $.identifier, "imports", repeat1($.identifier), "begin"),

    // Top-level commands
    _command: ($) =>
      choice($.lemma_command, $.theorem_command, $.definition_command, $.datatype_command),

    lemma_command: ($) => seq("lemma", optional(seq($.identifier, ":")), $.inner_syntax, $.proof),

    theorem_command: ($) =>
      seq("theorem", optional(seq($.identifier, ":")), $.inner_syntax, $.proof),

    definition_command: ($) =>
      seq(
        "definition",
        // The name of the definition is optional, and sometimes followed by a colon
        optional(seq($.identifier, optional(":"))),
        // The type signature is optional
        optional(seq("::", $.inner_syntax)),
        // The 'where' keyword is optional
        optional("where"),
        // The actual definition body
        $.inner_syntax,
      ),

    datatype_command: ($) => seq("datatype", $.identifier, "=", $._datatype_constructors),

    _datatype_constructors: ($) => seq($.identifier, repeat(seq("|", $.identifier))),

    // Proof blocks
    proof: ($) =>
      choice(
        // Structured proof: proof ... qed
        seq("proof", optional($.method), repeat($._proof_step), "qed"),
        // Apply-script: zero or more apply steps followed by done
        seq(repeat(seq("apply", $.method)), "done"),
        // Single-step proofs
        seq("by", $.method),
        "sorry",
      ),

    _proof_step: ($) =>
      choice(
        seq("apply", $.method),
        seq("assume", optional(seq($.identifier, ":")), $.inner_syntax),
        seq("have", optional(seq($.identifier, ":")), $.inner_syntax),
        seq("show", optional(seq($.identifier, ":")), $.inner_syntax),
      ),

    // Proof methods (e.g., auto, simp, blast)
    method: ($) => choice($.identifier, seq("(", $.identifier, ")")),

    // Inner syntax is treated as an opaque string enclosed in double quotes
    inner_syntax: ($) => /"[^"]*"/,

    // Isabelle comments: (* block *) and -- line
    comment: ($) => choice(seq("(*", /[^*]*\*+([^)*][^*]*\*+)*/, ")"), seq("--", /.*/)),

    // Identifiers can include letters, numbers, underscores, and prime (')
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_']*/,
  },
});
