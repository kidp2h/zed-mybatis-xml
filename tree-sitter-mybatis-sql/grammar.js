/**
 * Token-level SQL grammar for MyBatis mapper fragments.
 * Never builds a syntax tree, so partial SQL highlights the same as full statements.
 */

const KEYWORDS = [
  'select', 'from', 'where', 'and', 'or', 'not', 'in', 'is', 'as', 'on',
  'join', 'left', 'right', 'inner', 'outer', 'full', 'cross', 'natural', 'lateral',
  'group', 'by', 'order', 'having', 'limit', 'offset', 'fetch', 'first', 'next',
  'rows', 'row', 'only', 'distinct', 'all', 'any', 'some', 'exists', 'between',
  'like', 'ilike', 'similar', 'escape', 'case', 'when', 'then', 'else', 'end',
  'union', 'intersect', 'except', 'insert', 'into', 'values', 'update', 'set',
  'delete', 'returning', 'with', 'recursive', 'over', 'partition', 'window',
  'asc', 'desc', 'nulls', 'last', 'using', 'conflict', 'do', 'nothing',
  'interval', 'filter', 'within', 'cast', 'default', 'excluded', 'array',
  'range', 'current', 'unbounded', 'preceding', 'following', 'ties',
];

const TYPES = [
  'integer', 'int', 'int2', 'int4', 'int8', 'smallint', 'bigint', 'numeric',
  'decimal', 'real', 'float', 'double', 'serial', 'bigserial',
  'boolean', 'bool', 'varchar', 'char', 'character', 'text',
  'date', 'timestamp', 'timestamptz', 'json', 'jsonb', 'uuid',
];

const CONSTANTS = [
  'true', 'false', 'null',
  'current_date', 'current_time', 'current_timestamp', 'localtimestamp',
];

function words(list) {
  return new RegExp('(' + list.join('|') + ')', 'i');
}

module.exports = grammar({
  name: 'mybatis_sql',

  extras: $ => [/\s/],

  rules: {
    source: $ => repeat($._token),

    _token: $ => choice(
      $.comment,
      $.parameter,
      $.string,
      $.quoted_identifier,
      $.number,
      $.keyword,
      $.type,
      $.constant,
      $.identifier,
      $.operator,
      $.punctuation,
      $.other,
    ),

    comment: _ => token(choice(
      /--[^\n]*/,
      /\/\*[^*]*\*+([^/*][^*]*\*+)*\//,
    )),

    parameter: _ => token(/[#$]\{[^}]*\}/),

    string: _ => token(/[eE]?'([^'\n]|'')*'/),

    quoted_identifier: _ => token(/"[^"]*"/),

    number: _ => token(/\d+(\.\d+)?/),

    keyword: _ => token(words(KEYWORDS)),

    type: _ => token(words(TYPES)),

    constant: _ => token(words(CONSTANTS)),

    identifier: _ => token(/[A-Za-z_À-￿][A-Za-z0-9_$À-￿]*/),

    operator: _ => token(choice(
      /[<>=!~]+/,
      '->', '->>', '#>', '#>>', '@>', '<@', '?',
      '::',
      '||',
      '+', '-', '*', '/', '%',
    )),

    punctuation: _ => token(choice(',', ';', '(', ')', '.', '[', ']')),

    other: _ => token(prec(-1, /[^\s]/)),
  },
});
