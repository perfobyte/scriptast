export var
    LET_DECLARATION_NODE = 0,
    CONST_DECLARATION_NODE = 1,

    CLASS_DECLARATION_NODE = 2,
    CLASS_EXPRESSION_NODE = 2,

    SWITCH_STATEMENT_NODE = 10,
    FOR_IN_STATEMENT_NODE = 12,
    FOR_OF_STATEMENT_NODE = 13,
    FOR_AWAIT_OF_STATEMENT_NODE = 14,
    DO_WHILE_STATEMENT_NODE = 16,
    TRY_STATEMENT_NODE = 17,
    THROW_STATEMENT_NODE = 18,
    CONTINUE_STATEMENT_NODE = 21,
    WITH_STATEMENT_NODE = 22,
    SUPER_EXPRESSION_NODE = 31,

    OPTIONAL_MEMBER_EXPRESSION_NODE = 39,
    OPTIONAL_CALL_EXPRESSION_NODE = 42,
    IMPORT_EXPRESSION_NODE = 43,

    INSTANCEOF_NODE = 44,
    IN_NODE = 45,
    SPREAD_EXPRESSION_NODE = 46,

    TYPEOF_EXPRESSION_NODE = 47,
    DELETE_EXPRESSION_NODE = 48,
    AWAIT_EXPRESSION_NODE = 67,              // await
    YIELD_EXPRESSION_NODE = 68,              // yield / yield*
    SPREAD_ELEMENT_NODE = 70,                // ...x (в массивах/аргументах)
    REST_ELEMENT_NODE = 71,                  // ...x (в параметрах/паттернах)
    OBJECT_PATTERN_NODE = 72,                // { a, b: c }
    ARRAY_PATTERN_NODE = 73,                 // [a, , b]
    ASSIGNMENT_PATTERN_NODE = 74,            // a = 1 (в параметрах/паттернах)
    PROPERTY_DEFINITION_NODE = 76,           // поля класса
    METHOD_DEFINITION_NODE = 77,             // методы класса
    STATIC_BLOCK_NODE = 78,                  // static { }
    NEW_TARGET_PROPERTY = 79,
    PRIVATE_IDENTIFIER_NODE = 86,            // #x
    PRIVATE_PROPERTY_DEFINITION_NODE = 87,    // #x = 1 / #m() {}
    SWITCH_CASE_NODE = 88,          // case ... : ... в SwitchStatement
    CATCH_CLAUSE_NODE = 89,         // catch (e) { ... } в TryStatement
    CLASS_BODY_NODE = 93,           // тело класса (список методов/полей)
    DECORATOR_NODE = 95,            // @decorator
    HASHBANG_NODE = 96,
    META_PROPERTY_NODE = 85                 // import.meta
;