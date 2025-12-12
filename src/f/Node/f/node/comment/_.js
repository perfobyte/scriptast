
export default (
    function(Node, value) {
        return new Node(this.COMMENT_NODE, value, null, this);
    }
);
