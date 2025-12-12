

export default (
    (without_letters, with_letters) =>
    
    (char, index) => {
        return (
            (
                (index === 0)
                ? without_letters
                : with_letters
            )
            .test(char)
        );
    }
)(
    /[$_\p{ID_Start}]/u,
    /[$_\u200C\u200D\p{ID_Continue}]/u,
);
