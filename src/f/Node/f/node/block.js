

export default (
    function(Node, start_char, children) {
        return (
            new Node(this.BLOCK_NODE, start_char, children, this)
        );
    }
);
