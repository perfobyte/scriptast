

export default (
    function(Node, value) {
        return new Node(
            this.SIGN_NODE,
            value,
            null,
            this,
        )
    }
);
