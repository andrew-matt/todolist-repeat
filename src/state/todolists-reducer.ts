import {TodolistType} from "../App";
import {v1} from "uuid";

type TodoListsReducerType = RemoveTodolistActionType | addTodolistActionType

type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
type addTodolistActionType = ReturnType<typeof addTodolistAC>

export const todoListsReducer = (state: TodolistType[], action: TodoListsReducerType): TodolistType[] => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.payload.todolistId)
        case "ADD-TODOLIST":
            return [...state, {id: v1(), title: action.payload.newTodolistTitle, filter: "all"}]
        default:
            throw new Error("I don't understand this type")
    }
}

export const removeTodolistAC = (todolistId: string) => {
    return {
        type: 'REMOVE-TODOLIST',
        payload: {
            todolistId: todolistId
        }
    } as const
}

export const addTodolistAC = (newTodolistTitle: string) => {
    return {
        type: 'ADD-TODOLIST',
        payload: {
            newTodolistTitle: newTodolistTitle
        }
    } as const
}