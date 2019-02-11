(module
    (func (export "add") (param i32) (param i32) (result i32)
        get_local 0
        get_local 1
        i32.add)
    ;; (import "document" "querySelector" (func $dqs (param i32)))
    ;; (func (export "addDisplay") (param i32) (param i32)
    ;;     get_local 0
    ;;     get_local 1
    ;;     call 0

    ;;     )
)
