import React from 'react';
import AddTaskForm from "./AddTaskForm";

type TodoListHeaderPropsType = {
    title: string
    addTask: (title: string) => void
}

const TodoListHeader = (props: TodoListHeaderPropsType) => {
    return (
        <>
            <h3>{props.title}</h3>
            <AddTaskForm addTask={props.addTask}/>
        </>
    )

};

export default TodoListHeader;