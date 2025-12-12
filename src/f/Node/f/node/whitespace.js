

export default (
    function(Node, value) {
        return new Node(
            this.WHITESPACE_NODE,
            value,
            null,
            this,
        )
    }
);
