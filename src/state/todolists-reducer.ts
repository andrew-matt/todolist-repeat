import {TodolistType} from "../App";
import {v1} from "uuid";

type TodoListsReducerType = RemoveTodolistActionType | addTodolistActionType | changeTodolistTitleActionType

type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
type addTodolistActionType = ReturnType<typeof addTodolistAC>
type changeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>

export const todoListsReducer = (state: TodolistType[], action: TodoListsReducerType): TodolistType[] => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter(tl => tl.id !== action.payload.todolistId)
        case "ADD-TODOLIST":
            return [...state, {id: v1(), title: action.payload.newTodolistTitle, filter: "all"}]
        case "CHANGE-TODOLIST-TITLE":
            return state.map(tl => tl.id === action.payload.todolistId ? {...tl, title: action.payload.newTodolistTitle} : tl)
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

export const changeTodolistTitleAC = (todolistId: string, newTodolistTitle: string) => {
    return {
        type: 'CHANGE-TODOLIST-TITLE',
        payload: {
            todolistId: todolistId,
            newTodolistTitle: newTodolistTitle
        }
    } as const
}