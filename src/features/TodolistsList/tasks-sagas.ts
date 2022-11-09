import {call, put, select, takeEvery} from 'redux-saga/effects'
import {setAppStatusAC} from 'app/app-reducer'
import {AxiosResponse} from 'axios'
import {
    GetTasksResponse,
    ResponseType, TaskType,
    todolistsAPI,
    UpdateTaskModelType,
} from 'api/todolists-api'
import {
    addTaskAC,
    removeTaskAC,
    setTasksAC,
    UpdateDomainTaskModelType,
    updateTaskAC,
} from 'features/TodolistsList/tasks-reducer'
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from 'utils/error-utils'
import {AppRootStateType} from 'app/store'

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    yield put(setAppStatusAC('loading'))
    const data: GetTasksResponse = yield call(todolistsAPI.getTasks, (action.todolistId))
    const tasks = data.items
    yield put(setTasksAC(tasks, action.todolistId))
    yield put(setAppStatusAC('succeeded'))
}

export const fetchTasks = (todolistId: string) => ({
    type: 'TASKS/FETCH-TASKS',
    todolistId,
} as const)

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTask>) {
    const res: AxiosResponse<ResponseType> = yield call(todolistsAPI.deleteTask, action.todolistId, action.taskId)
    yield put(removeTaskAC(action.taskId, action.todolistId))
}

export const removeTask = (taskId: string, todolistId: string) => ({
    type: 'TASKS/REMOVE-TASK',
    todolistId,
    taskId,
} as const)

export function* addTaskWorkerSaga(action: ReturnType<typeof addTask>) {
    try {
        yield put(setAppStatusAC('loading'))
        const data: ResponseType<{ item: TaskType }> = yield call(todolistsAPI.createTask, action.todolistId, action.title)
        if (data.resultCode === 0) {
            const task = data.data.item
            yield put(addTaskAC(task))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield* handleServerAppErrorSaga(data)
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    }
}

export const addTask = (title: string, todolistId: string) => ({
    type: 'TASKS/ADD-TASK',
    title,
    todolistId,
} as const)

export function* updateTaskWorkerSaga(action: ReturnType<typeof updateTask>) {
    const state: AppRootStateType = yield select();
    const task = state.tasks[action.todolistId].find(t => t.id === action.taskId)
    if (!task) {
        //throw new Error("task not found in the state");
        console.warn('task not found in the state')
        return
    }

    const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...action.domainModel,
    }

    try {
        const data: ResponseType<{ item: TaskType }> = yield call(todolistsAPI.updateTask, action.todolistId, action.taskId, apiModel)
        if (data.resultCode === 0) {
            yield put(updateTaskAC(action.taskId, action.domainModel, action.todolistId))
        } else {
            yield* handleServerAppErrorSaga(data)
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    }
}

export const updateTask = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) => ({
    type: 'TASKS/UPDATE-TASK',
    taskId,
    domainModel,
    todolistId,
} as const)

export function* tasksWatcherSaga() {
    yield takeEvery('TASKS/FETCH-TASKS', fetchTasksWorkerSaga)
    yield takeEvery('TASKS/REMOVE-TASK', removeTaskWorkerSaga)
    yield takeEvery('TASKS/ADD-TASK', addTaskWorkerSaga)
    yield takeEvery('TASKS/UPDATE-TASK', updateTaskWorkerSaga)
}