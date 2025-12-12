

export default (
    function(Node, value) {
        return new Node(
            this.UNKNOWN_NODE,
            value,
            null,
            this,
        )
    }
);
