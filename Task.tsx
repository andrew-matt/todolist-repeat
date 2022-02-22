import React, {ChangeEvent} from 'react';
import {TaskType} from "./Todolist";
import {FilterValuesType} from "./App";

type TaskPropsType = TaskType & {
    removeTask: (taskID: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean) => void
}


const Task: React.FC<TaskPropsType> = (props) => {
    const taskClasses = `task ${props.isDone ? "task-completed" : ""}`;
    const removeTask = () => {props.removeTask(props.id)};
    const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.id, e.currentTarget.checked)
    }
    return (
        <li>
            <input type="checkbox"
                   onChange={changeTaskStatus}
                   checked={props.isDone}/>
            <span className={taskClasses}>{props.title}</span>
            <button onClick={removeTask}>x</button>
        </li>
    );
};

export default Task;