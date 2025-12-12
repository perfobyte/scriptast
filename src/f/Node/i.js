import * as f from './f/i.js';

function Node(
    type,
    value,
    children,
    parent,
) {
    // console.dir({type,value});

    this.type = type;
    this.value = value;
    
    this.children = children;
    this.parent = parent;

    this[Symbol.toPrimitive] =
    this.toString =
    this.valueOf =
        this.value_of_template[type];
};

Object.assign(Node.prototype, f, f.NodeType);

export default Node;
