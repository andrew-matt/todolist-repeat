import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

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

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS',
    taskId: string
    isDone: boolean
    todolistId: string
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE',
    taskId: string
    title: string
    todolistId: string
}

type ActionsType = RemoveTasksActionType
    | AddTasksActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType;

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
                [action.todolistId]: [{id: v1(), title: action.title, isDone: false}, ...state[action.todolistId]]
            }
        case "CHANGE-TASK-STATUS":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => task.id === action.taskId ? {...task, isDone: action.isDone} : task)
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.todolistId]: state[action.todolistId].map(task => {
                    if (task.id === action.taskId) return {...task, title: action.title}; else return task
                })
            }
        case "ADD-TODOLIST":
            return {
                ...state,
                [action.todolistId]: []
            }
        case "REMOVE-TODOLIST":
            // let stateCopy = {...state}
            // delete stateCopy[action.id]
            // return stateCopy
            let {[action.id]: [], ...rest} = {...state}
            return rest
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

export const changeTaskStatusAC = (taskId: string, isDone: boolean, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', taskId, isDone, todolistId}
}

export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', taskId, title, todolistId}
}