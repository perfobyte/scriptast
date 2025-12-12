

export default (
    function(Node, value) {
        return new Node(
            this.STRING_CONTENT_NODE,
            value,
            null,
            this,
        )
    }
);
