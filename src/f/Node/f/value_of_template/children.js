
export default (
    function() {
        return (
            this.children.reduce(
                this.reduce_simple_value_of,
                ""
            )
        )
    }
);
