(keyword) @keyword
(type) @type.builtin
(constant) @constant.builtin
(number) @number
(string) @string
(quoted_identifier) @property
(comment) @comment
(parameter) @variable.special
(operator) @operator

((punctuation) @punctuation.bracket
 (#match? @punctuation.bracket "^[()\\[\\]]$"))

((punctuation) @punctuation.delimiter
 (#match? @punctuation.delimiter "^[,;.]$"))

; Function call, including type names like date(...)
(source
  [(identifier) (type)] @function
  .
  (punctuation) @_paren
  (#eq? @_paren "("))

; Column after a table alias, even when named like a keyword
(source
  (punctuation) @_dot
  .
  [(identifier) (keyword) (type) (constant)] @property
  (#eq? @_dot "."))
