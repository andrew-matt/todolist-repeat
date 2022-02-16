import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type PropsType = {
    addTask: (title: string) => void
}


const AddTaskForm: React.FC<PropsType> = ({addTask}) => {

    const [title, setTitle] = useState<string>("")

    console.log(title)
    const onClickAddTask = () => {
        addTask(title)
        setTitle("")
    }

    const onChangeSetTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressSetTitle = (e: KeyboardEvent<HTMLInputElement>) => {
        e.key === "Enter" && onClickAddTask()
        }

    return (
        <div>
            <input
                value={title}
                onChange={onChangeSetTitle}
                onKeyPress={onKeyPressSetTitle}
            />
            <button onClick={onClickAddTask}>+</button>
        </div>
    );
};

export default AddTaskForm;