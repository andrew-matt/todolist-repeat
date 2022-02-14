import React from 'react';
import Task from "./Task";
import {TaskType} from "./Todolist";
import ControlButtons from "./ControlButtons";

type TasksListPropsType = {
    tasks: Array<TaskType>
    removeTask: (taskID: number) => void
}

const TasksList = (props: TasksListPropsType) => {
    const tasksComponentsList = props.tasks.map(task => {
        return <Task key={task.id} {...task} removeTask={props.removeTask}/>
    })
    return (
        <>
            <ul>
                {tasksComponentsList}
            </ul>
            <ControlButtons/>
        </>
    );
};

export default TasksList;