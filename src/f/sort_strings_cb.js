

export default (a, b) => {
    var
        al = a.length,
        bl = b.length
    ;
    return (
        (al === bl)
        ? (a.localeCompare(b))
        : (al - bl)
    );
}