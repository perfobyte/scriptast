import * as f from './f/i.js';

function Node(
    type,
    value,
    children,
    parent,
) {
    this.type = type;
    this.value = value;
    
    this.children = children;
    this.parent = parent;
};

Node.prototype = f;

export default Node;
