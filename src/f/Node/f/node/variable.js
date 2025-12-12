

export default (
    function(Node, value) {
        return new Node(
            this.VARIABLE_NODE,
            value,
            null,
            this,
        )
    }
);
