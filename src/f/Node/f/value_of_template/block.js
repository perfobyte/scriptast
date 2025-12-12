

export default (
    function () {
        var value = this.value;
        return (
            value
            + this.children_value_of()
            + this.block_str_map[value]
        );
    }
);
