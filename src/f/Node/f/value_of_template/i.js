
export var
    KEYWORD_NODE = 1,
    BLOCK_NODE = 2,

    STRING_CONTENT_NODE = 3,
    
    WHITESPACE_NODE = 4,
    VARIABLE_NODE = 5,
    SIGN_NODE = 6,

    ONELINE_COMMENT_NODE = 7,
    COMMENT_NODE = 8,

    NUMBER_NODE = 9
;
import simple_value_of from "./simple.js";
import children_value_of from "./children.js";
import block_value_of from "./block.js";

import oneline_comment_value_of from "./oneline_comment.js";
import comment_value_of from "./comment.js";

import reduce_simple_value_of from './reduce_simple.js';

export {
    simple_value_of,
    children_value_of,
    block_value_of,

    oneline_comment_value_of,
    comment_value_of,

    reduce_simple_value_of,
};

export var
    value_of_template = {
        0: children_value_of,
        1: simple_value_of,
        2: block_value_of,
        3: simple_value_of,
        4: simple_value_of,
        5: simple_value_of,
        6: simple_value_of,

        7: oneline_comment_value_of,
        8: comment_value_of,

        9: simple_value_of,
        10: simple_value_of,
    }
;
