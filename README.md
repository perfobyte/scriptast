# @perfobyte/scriptast

A small, fast, JavaScript-based JavaScript parser that builds a lightweight, lossless-ish AST as a tree of nodes.

@perfobyte/scriptast is designed for speed, simplicity, and practical tooling. It tokenizes and parses JavaScript source into a node tree that preserves whitespace, comments, operators, numbers, identifiers, and nested blocks such as (), [], {}, template strings, and regex literals.

This makes it suitable for formatters, linters, code mods, syntax highlighting, refactoring tools, and fast static analysis.

This is NOT a semantic ESTree-compatible parser like Acorn, Babel, or TypeScript. ScriptAST is a structural, token-preserving parser focused on performance and round-tripping.

----------------------------------------------------------------

## INSTALL

```bash
npm install @perfobyte/scriptast
```

----------------------------------------------------------------

## USAGE (ESM ONLY)

```js
import { parse, program, NodeType, Node } from "@perfobyte/scriptast";
```

----------------------------------------------------------------

## QUICK START

```js
const source = `
function add(a, b) {
  // sum
  return a + b;
}
`;

const root = program(Node, []);

parse(source, root, 0, source.length, root.constructor, Array);

console.log(root.children);
console.log(root.toString());
```

----------------------------------------------------------------

## WHAT THIS PARSER PRODUCES

ScriptAST produces a token + block tree instead of a semantic AST.

Preserved elements:
- keywords
- identifiers
- operators and punctuation
- numbers
- whitespace (including unicode)
- line and block comments
- nested blocks: (), [], {}, strings, template strings, regex literals

* The structure is ideal for round-tripping source code and fast tooling.

----------------------------------------------------------------

## CORE API

```js
parse(source, root, start, end, NodeClass, Container)
```

Parses JavaScript source into the provided root node.

Parameters:
- source: string
- root: PROGRAM node
- start: start index
- end: end index
- payload: arbitrary value (usually null)
- NodeClass: constructor used for node creation (use root.constructor)

* Returns the root node.

### Example:

```js
const
    root = program(),
    source = "let x = 1 + 2"
;
parse(source, root, 0, source.length, root.constructor, Array);
```

----------------------------------------------------------------

```js
program(Node, children)
```

* Creates a PROGRAM_NODE with empty children.

```js
import {Node} from '@perfobyte/scriptast';

const root = program(Node, []);
```

----------------------------------------------------------------

## NODE MODEL

Each node has:
- type: number
- value: string
- children: array or null
- parent: node or null

Nodes support:
- String(node)
- node.toString()
- node.valueOf()

----------------------------------------------------------------

## Node Types (`NodeType`)

| Name                 | Value | Description |
|----------------------|-------|-------------|
| `PROGRAM_NODE`       | `0`   | Root program node |
| `KEYWORD_NODE`       | `1`   | JavaScript keywords (`if`, `return`, `function`, …) |
| `BLOCK_NODE`         | `2`   | Nested block (`()`, `{}`, `[]`, strings, templates, regex) |
| `STRING_CONTENT_NODE`| `3`   | Raw string or template text content |
| `WHITESPACE_NODE`    | `4`   | Whitespace (spaces, tabs, newlines, unicode) |
| `VARIABLE_NODE`      | `5`   | Identifiers / variable names |
| `SIGN_NODE`          | `6`   | Operators and punctuation (`+`, `===`, `=>`, `{`, …) |
| `ONELINE_COMMENT_NODE` | `7` | `//` comment content |
| `COMMENT_NODE`       | `8`   | `/* */` comment content |
| `NUMBER_NODE`        | `9`   | Numeric literals |
| `UNKNOWN_NODE`       | `10`  | Unrecognized single-character token |

----------------------------------------------------------------

## SOURCE RECONSTRUCTION

* Calling String(node) reconstructs source code.

- whitespace renders as-is
- comments render with // or /* */
- blocks render with opening + children + closing
- program renders all children concatenated

## Round-trip example:

```js
import {Node} from '@perfobyte/scriptast';

const src = "/*a*/ let x = 1 + 2";
const root = program(Node, []);
parse(src, root, 0, src.length, Node, Array);
console.log(String(root) === src); // true
```

----------------------------------------------------------------

## BLOCKS

### Block nodes are created for:
- ()
- []
- {}
- "..."
- '...'
- `...`
- ${...}
- /regex/flags

* BLOCK_NODE.value contains the opening delimiter.
* Closing delimiter is derived internally.

----------------------------------------------------------------

## UTILITY EXPORTS

- WHITESPACE
- keywords
- signs
- blocks
- block_map
- block_str_map
- before_regex_keywords
- control_keywords
- statement_starter_keywords
- sign_start_expressions
- sort_strings_cb

* These are advanced exports intended for tooling and extensions.

----------------------------------------------------------------

## TREE WALKING EXAMPLE

```js
function walk(node, fn) {
  fn(node);
  if (node.children) {
    for (const c of node.children) walk(c, fn);
  }
}
```

----------------------------------------------------------------

## COMMENT STRIPPING EXAMPLE

```js
import {NodeType} from "@perfobyte/scriptast";

function stripComments(node) {
    var children = node.children
    if (children) {
        children = children.filter(
            n => (
                (n.type !== NodeType.COMMENT_NODE)
                &&
                (n.type !== NodeType.ONELINE_COMMENT_NODE)
            )
        );
        children.forEach(stripComments);
        node.children = children;
    }
}
```

----------------------------------------------------------------

## REGEX PARSING NOTES

- The parser uses fast heuristics to distinguish division from regex literals.
- This works well in practice but is not spec-perfect.

----------------------------------------------------------------

# LICENSE

* MIT © perfobyte

----------------------------------------------------------------

# REPOSITORY

- https://github.com/perfobyte/scriptast
