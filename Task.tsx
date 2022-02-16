import React from 'react';
import {TaskType} from "./Todolist";
import {FilterValuesType} from "./App";

type TaskPropsType = TaskType & {
    removeTask: (taskID: string) => void
}


const Task = (props: TaskPropsType) => {
    return (
        <li>
            <input type="checkbox"
                   checked={props.isDone}/>
            <span>{props.title}</span>
            <button onClick={() => {props.removeTask(props.id)}}>x</button>
        </li>
    );
};

export default Task;