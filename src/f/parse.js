export default (
    (source, global, index, length, Node, Container) => {
      var
        parent = global,
        children = global.children,
  
        ws = global.WHITESPACE,
  
        WHITESPACE_NODE = global.WHITESPACE_NODE,
        BLOCK_NODE = global.BLOCK_NODE,
  
        keywords = global.keywords,
  
        is_sign_code = global.is_sign_code,
        is_number_code = global.is_number_code,
        is_number_literal_code = global.is_number_literal_code,
        is_var_char = global.is_var_char,
  
        blocks = global.blocks,
        block_map = global.block_map,
        block_str_map = global.block_str_map,
  
        before_regex_keywords = global.before_regex_keywords,

        control_keywords = global.control_keywords,
        statement_starter_keywords = global.statement_starter_keywords,
        sign_start_expressions = global.sign_start_expressions,
  
        new_children = null,
        new_parent = null,
  
        char = "",
        from = index,
        to = index,
  
        indexOf = 0,
        second_char = "",
        code = 0,
  
        stage = 0,
        levels = 0,
        j = 0,
  
        parent_value = "",
        sign_value = "",
  
        regex_allowed = true,
        stmt_start = true,
        pending_control = 0,
        paren_ctx = [],
        brace_ctx = [],

        in_class = false,
  
        is_kw = false,

        signs = global.signs,          // {1:[...],2:[...],3:[...],4:[...]}
        maxLen = 0,                    // because you have >>>=
        best = "",

        remain = 0,
        len = 0,
        op = "",
        kind = 0,
        bkind = 0,
        closed = "",

        cc = 0,
        f0 = 0
      ;
  
      while (index < length) {
        code = (char = source[index]).charCodeAt(0);

        if (stage === 0) {
          // WHITESPACE
          if (ws.includes(char)) {
            index = ++to;
          } else {
            (from === to) || (
              children.push(parent.whitespace(Node, source.substring(from, to))),
              (from = to)
            );
  
            // CLOSE BLOCK ( }, ], ), `, ", ' )
            if (levels && (char === block_str_map[parent_value = parent.value])) {
              // move up
              children = (parent = parent.parent).children;
              levels--;
  
              from = to = ++index;
  
              // update contexts based on which opener we just closed
              if (parent_value === "(") {
                // closing a paren: control header or normal grouping?
                kind = paren_ctx.length ? paren_ctx.pop() : 0;
                if (kind === 1) {
                  // if (...) / for (...) / while (...) / etc → statement starts
                  stmt_start = true;
                  regex_allowed = true;
                } else {
                  // grouping/call/member ends an expression
                  stmt_start = false;
                  regex_allowed = false;
                }
              }
              else if (parent_value === "[") {
                stmt_start = false;
                regex_allowed = false; // array/index ends expression
              }
              else if (parent_value === "{") {
                // block vs object literal affects what comes next
                bkind = brace_ctx.length ? brace_ctx.pop() : 1; // default assume block
                if (bkind === 1) {
                  // closing a block statement → new statement may start
                  stmt_start = true;
                  regex_allowed = true;
                } else {
                  // closing an object literal expression
                  stmt_start = false;
                  regex_allowed = false;
                }
              }
              else if (parent_value === "`" || parent_value === '"' || parent_value === "'") {
                // string/template as expression value
                stmt_start = false;
                regex_allowed = false;
              }
  
              // resume template mode if we just closed ${ ... } inside a template
              if (parent.type === BLOCK_NODE && parent.value === "`") {
                stage = 3;
              }
            }
  
            // SLASH: comment / regex / division
            else if (char === "/") {
              second_char = source[index + 1];
  
              if (second_char === "*") {
                to = from = (index += 2);
                stage = 8;
                // comment doesn't change regex_allowed or stmt_start
              }
              else if (second_char === "/") {
                to = from = (index += 2);
                stage = 7;
                // comment doesn't change regex_allowed or stmt_start
              }
              else if (second_char === "=") {
                children.push(parent.sign(Node, "/="));
                to = from = (index += 2);
                // after an operator, an expression starts
                stmt_start = false;
                regex_allowed = true;
              }
              else if (regex_allowed) {
                // REGEX LITERAL
                to = from = (++index);       // skip leading '/'
                second_char = "/";
  
                new_children = new Container();
                children.push(new_parent = parent.block(Node, "/", new_children));
                children = new_children;
                parent = new_parent;
                levels++;
  
                stage = 2;
                stmt_start = false;
                // regex_allowed will become false when we close it
              }
              else {
                // DIVISION
                children.push(parent.sign(Node, "/"));
                from = to = ++index;
  
                stmt_start = false;
                regex_allowed = true; // after binary operator, RHS expression can start
              }
            }
  
            // OPEN BLOCKS
            else if ((indexOf = blocks.indexOf(char)) !== -1) {
              second_char = block_map[indexOf];
  
              // push contexts BEFORE descending
              if (char === "(") {
                // if we just saw control keyword, this paren is control header
                paren_ctx.push(pending_control ? 1 : 0);
                pending_control = 0;
              }
              else if (char === "{") {
                // heuristic: at statement-start, `{` is a block.
                // otherwise, if we're in expression position, `{` is likely an object literal.
                // (this matches how JS treats `{a:1}` at statement start as a block/label.)
                brace_ctx.push(stmt_start ? 1 : (regex_allowed ? 0 : 1));
              }
  
              new_children = new Container();
              new_parent = parent.block(Node, char, new_children);
  
              children.push(new_parent);
              children = new_children;
              parent = new_parent;
  
              to = from = ++index;
              levels++;
  
              // entering any (...) / [...] / {...} is an expression/statement start region
              // (inside you can begin with a regex)
              if (char === "(" || char === "[" || char === "{") {
                regex_allowed = true;
                // inside { } as block, we are at statement start; inside object literal, still ok to start expressions
                stmt_start = (char === "{") ? true : false;
              }
  
              stage = (
                (indexOf < 3) ? 0 :
                (indexOf > 3) ? 2 :
                3
              );
            }
  
            // SIGNS
            else if (is_sign_code(code)) {
              to = from = index;
              stage = 4;
            }
  
            // NUMBERS
            else if (is_number_code(code)) {
              to = from = index;
              stage = 5;
            }
  
            // IDENT / KEYWORD
            else if (is_var_char(char)) {
              to = from = index;
              stage = 6;
            }
            else {

              // ERROR:
              // if (char === ")" || char === "]" || char === "}") {
              //   console.error("CLOSER BECAME UNKNOWN at index", index, "char", char, "parent is", parent?.value);
              //   console.error(source.slice(Math.max(0, index - 120), Math.min(length, index + 120)));
              //   throw new Error("Desynced stack: closer treated as unknown");
              // }
              children.push(parent.unknown(Node, char));
              from = to = (++index);
            }
          }
        }
  
        // STRING / REGEX BODY (stage 2)
        else if (stage === 2) {
          in_class = false;
  
          while (to < length) {
            char = source[to];
  
            if (char === "\\") {
              // skip escaped char
              to += 2;
              continue;
            }
            if (parent.value === "/") {
              // regex mode: track character class
              if (char === "[") in_class = true;
              else if (char === "]") in_class = false;
  
              if (!in_class && char === "/") break;
            } else {
              // string mode
              if (char === second_char) break;
            }
  
            to++;
          }
  
          closed = parent.value;
          children.push(parent.text(Node, source.substring(from, to)));
  
          // close block
          levels--;
          children = (parent = parent.parent).children;
  
          // consume closing quote/slash
          from = index = (++to);
          stage = 0;
  
          // regex/string literal ends an expression
          stmt_start = false;
          regex_allowed = false;
  
          // If this was a regex literal, optionally swallow flags (gimsuyd...)
          // This prevents `/re/g` from becoming `regex` + `variable("g")`.
          if (closed === "/" && index < length) {
            f0 = index;
            while (index < length) {
              cc = source[index].charCodeAt(0);
              if ((cc >= 65 && cc <= 90) || (cc >= 97 && cc <= 122)) index++;
              else break;
            }
            if (index > f0) {
              children.push(parent.text(Node, source.substring(f0, index)));
              from = to = index;
            }
          }
        }
  
        // TEMPLATE STRING (stage 3)
        else if (stage === 3) {
          while (to < length) {
            char = source[to];
        
            // handle escapes inside template text
            if (char === "\\") { to += 2; continue; }
        
            second_char = source[j = to + 1];
        
            if (char === "$" && second_char === "{") {
              from === to || children.push(parent.text(Node, source.substring(from, to)));
              new_children = new Container();
              new_parent = parent.block(Node, "${", new_children);
              children.push(new_parent);
              children = new_children;
              parent = new_parent;
              from = to = index = j + 1;
              stage = 0;
              levels++;
              stmt_start = false;
              regex_allowed = true;
              break;
            }
        
            if (char === "`") {
              from === to || children.push(parent.text(Node, source.substring(from, to)));
              children = (parent = parent.parent).children;
              levels--;
              to = from = index = j;
              stage = 0;
              stmt_start = false;
              regex_allowed = false;
              break;
            }
        
            to++;
          }
        
          // EOF guard (prevents infinite loop on unterminated template)
          if (to >= length && stage === 3) {
            from === to || children.push(parent.text(Node, source.substring(from, to)));
            index = to;          // or: index = length;
            stage = 0;           // or: break; (if you want to stop parsing)
          }
        }
  
        // SIGNS (stage 4)
        else if (stage === 4) {
          // Match a single VALID operator (longest first), not "all sign chars"
          signs = global.signs;          // {1:[...],2:[...],3:[...],4:[...]}
          maxLen = 4;                    // because you have >>>=
          best = "";

          remain = length - from;
          len = Math.min(maxLen, remain)
          op = "";
          for (; len >= 1; len--) {
            op = source.substr(from, len);
            if (signs[len] && signs[len].includes(op)) {
              best = op;
              break;
            }
          }

          if (!best) best = source[from];      // fallback (should be rare)

          children.push(parent.sign(Node, best));
          from = index = to = from + best.length;
          stage = 0;

          if (best === ";") {
            stmt_start = true;
            regex_allowed = true;
          } else if (best === "++" || best === "--") {
            stmt_start = false;
            regex_allowed = true;              // keep your heuristic
          } else {
            stmt_start = false;
            regex_allowed = !(sign_start_expressions.includes(best));
          }
        }
  
        // NUMBER (stage 5)
        else if (stage === 5) {
          while (to < length) {
            char = source[to];
            code = char.charCodeAt(0);
  
            if (is_number_literal_code(code)) {
              to++;
              continue;
            }
            else if ((char === "e" || char === "E") && ((source[to + 1] === "-") || (source[to + 1] === "+"))) {
              to += 2;
              continue;
            }
            break;
          }
  
          children.push(parent.number(Node, source.substring(from, to)));
          from = to = index = to;
          stage = 0;
  
          stmt_start = false;
          regex_allowed = false;
        }
  
        // IDENT / KEYWORD (stage 6)
        else if (stage === 6) {
          while ((to < length) && is_var_char(source[to])) {
            to++;
          }
  
          index = to;
  
          second_char = source.substring(from, to);
          is_kw = (keywords[to - from]?.includes(second_char) || false);
  
          children.push(
            is_kw
              ? parent.keyword(Node, second_char)
              : parent.variable(Node, second_char)
          );
  
          stage = 0;
  
          if (is_kw) {
            if (control_keywords.includes(second_char)) {
              // next '(' is control header paren
              pending_control = 1;
              stmt_start = false;
              regex_allowed = true;
            }
            else if (statement_starter_keywords.includes(second_char)) {
              // else/do/try/finally → statement begins
              pending_control = 0;
              stmt_start = true;
              regex_allowed = true;
            }
            else if (before_regex_keywords.includes(second_char)) {
              // return/throw/new/typeof/... expects expression
              pending_control = 0;
              stmt_start = false;
              regex_allowed = true;
            }
            else {
              pending_control = 0;
              stmt_start = false;
              regex_allowed = false;
            }
          } else {
            pending_control = 0;
            stmt_start = false;
            regex_allowed = false;
          }
  
          from = to = index;
        }
  
        // ONE-LINE COMMENT (stage 7)
        else if (stage === 7) {
          while (
            (to < length)
            && (source[to] !== "\n")
            && (source[to] !== "\r")
            && (source[to] !== "\u2028")
            && (source[to] !== "\u2029")
          ) {
            to++
          };
   
          children.push(parent.oneline_comment(Node, source.substring(from, to)));
        
          // don't skip newline here:
          from = to = index = to;
          stage = 0;
        }
  
        // BLOCK COMMENT (stage 8)
        else if (stage === 8) {
          while (to < length && !(source[to] === "*" && source[to + 1] === "/")) to++;
          children.push(parent.comment(Node, source.substring(from, to)));
          from = to = index = (to + 2);
          stage = 0;
          // comment doesn't change regex_allowed or stmt_start
        }
      }

      if (stage === 0 && from !== to) {
        children.push(parent.whitespace(Node, source.substring(from, to)));
        from = to;
      }

      // ERROR:
      // if (levels !== 0) {
      //   console.error("UNBALANCED EOF", { levels, parent: parent?.value });
      //   throw new Error("Lexer ended with unclosed blocks");
      // }
      
      return global;
    }
  );
  