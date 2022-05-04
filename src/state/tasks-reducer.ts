import {FilterValuesType, TasksStateType, TodolistType} from '../App';
import {v1} from 'uuid';

export type RemoveTasksActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}
export type AddTasksActionType = {
    type: 'ADD-TASK',
    todolistId: string
    title: string
}

type ActionsType = RemoveTasksActionType | AddTasksActionType;

export const tasksReducer = (state: TasksStateType, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)
            }
        case "ADD-TASK":
            return {
                ...state,
                [action.todolistId]: [{id: v1(), title: "juice", isDone: false}, ...state[action.todolistId]]
            }
        default:
            throw new Error("I don't understand this type")
    }
}

export const removeTaskAC = (todolistId: string, taskId: string): RemoveTasksActionType => {
    return { type: 'REMOVE-TASK', todolistId: todolistId, taskId: taskId}
}

export const addTaskAC = (todolistId: string, title: string): AddTasksActionType  => {
    return {type: 'ADD-TASK', todolistId: todolistId, title: title}
}