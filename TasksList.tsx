import React from 'react';
import Task from "./Task";
import {TaskType} from "./Todolist";
import ControlButtons from "./ControlButtons";
import {FilterValuesType} from "./App";

type TasksListPropsType = {
    tasks: Array<TaskType>
    removeTask: (taskID: string) => void
    changeFilter: (filter: FilterValuesType) => void
    filter: FilterValuesType
    changeTaskStatus: (taskId: string, isDone: boolean) => void
}


const TasksList = (props: TasksListPropsType) => {
    const tasksComponentsList = props.tasks.map(task => {
        return <Task
            key={task.id}
            {...task}
            removeTask={props.removeTask}
            changeTaskStatus={props.changeTaskStatus}
        />
    })
    return (
        <>
            <ul>
                {tasksComponentsList}
            </ul>
            <ControlButtons
                changeFilter={props.changeFilter}
                filter={props.filter}
            />
        </>
    );
};

export default TasksList;