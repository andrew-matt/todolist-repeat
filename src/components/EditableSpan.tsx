import React, {ChangeEvent, useState} from 'react';

type EditableSpanPropsType = {
    title: string
    callback: (title: string) => void
}

export const EditableSpan = (props: EditableSpanPropsType) => {

    const [edit, setEdit] = useState(false)
    const [title, setTitle] = useState(props.title)

    const onDoubleClickHandler = () => {
        setEdit(true)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onBlurHandler = () => {
        setEdit(false)
        props.callback(title)
    }

    return (
        edit
            ? <input value={title} autoFocus={true} onBlur={onBlurHandler} onChange={onChangeHandler}/>
            : <span onDoubleClick={onDoubleClickHandler}>{props.title}</span>
    );
};