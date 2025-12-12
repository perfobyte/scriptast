

export default (
    function(Node, value) {
        return new Node(
            this.NUMBER_NODE,
            value,
            null,
            this,
        )
    }
);
