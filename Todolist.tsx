import React from 'react';
import TodoListHeader from "./TodoListHeader";
import TasksList from "./TasksList";
import AddTaskForm from "./AddTaskForm";


type TodolistPropsType = {
    title: string
    tasks: Array<TaskType>
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
            <TasksList tasks={props.tasks}/>
        </div>
    );
};

export default Todolist;