import React from 'react';
import TodoListHeader from "./TodoListHeader";
import TasksList from "./TasksList";
import AddTaskForm from "./AddTaskForm";
import {FilterValuesType} from "./App";


type TodolistPropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskID: number) => void
    changeFilter: (filter: FilterValuesType) => void
}

export type TaskType = {
    id: number
    title: string
    isDone: boolean

}

const Todolist = (props: TodolistPropsType) => {
    return (
        <div>
            <TodoListHeader title={props.title}/>
            <AddTaskForm />
            <TasksList tasks={props.tasks} removeTask={props.removeTask} changeFilter={props.changeFilter}/>
        </div>
    );
};

export default Todolist;