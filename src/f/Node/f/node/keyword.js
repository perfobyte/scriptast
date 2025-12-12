

export default (
    function(Node, value) {
        return new Node(
            this.KEYWORD_NODE,
            value,
            null,
            this,
        )
    }
);
