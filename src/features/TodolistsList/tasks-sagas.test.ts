import {call, put, select} from 'redux-saga/effects'
import { cloneableGenerator } from '@redux-saga/testing-utils';
import {
    GetTasksResponse, ResponseType,
    TaskPriorities,
    TaskStatuses, TaskType,
    todolistsAPI,
    UpdateTaskModelType,
} from 'api/todolists-api'
import {setAppErrorAC, setAppStatusAC} from 'app/app-reducer'
import {
    addTaskWorkerSaga,
    fetchTasksWorkerSaga,
    removeTaskWorkerSaga,
    updateTaskWorkerSaga,
} from 'features/TodolistsList/tasks-sagas'
import {
    addTaskAC,
    removeTaskAC,
    setTasksAC,
    updateTaskAC,
} from 'features/TodolistsList/tasks-reducer'
import {AppRootStateType} from 'app/store'

let todolistId: string
let taskTitle: string
let taskId: string
let response: ResponseType<{ item: TaskType }>
let domainModel: UpdateTaskModelType
let state: AppRootStateType

beforeEach(() => {
    todolistId = 'todolistId1'
    taskTitle = 'taskTitle'
    taskId = '1'
    response = {
        resultCode: 0,
        data: {
            item: {
                description: 'testDescription',
                title: 'testTitle',
                status: 0,
                priority: 1,
                startDate: '',
                deadline: '',
                id: taskId,
                todoListId: todolistId,
                order: 1,
                addedDate: 'testAddedDate',
            },
        },
        messages: [],
    }
    domainModel = {
        description: 'newTestDescription',
        title: 'newTestTitle',
        status: 0,
        priority: 1,
        startDate: '',
        deadline: '',
    }
    state = {
        app: {
            error: null,
            isInitialized: true,
            status: 'succeeded'
        },
        auth: {
            isLoggedIn: true
        },
        todolists: [
            {id: "todolistId1", title: 'What to learn', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0},
            {id: "todolistId2", title: 'What to buy', filter: 'all', entityStatus: 'idle', addedDate: '', order: 0}
        ],
        tasks: {
            "todolistId1": [
                { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
                { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
                { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
            ],
            "todolistId2": [
                { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
                { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
                { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
                    startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
            ]
        },
    }
})

test('fetchTasksWorkerSaga success', () => {
    const gen = fetchTasksWorkerSaga({type: 'TASKS/FETCH-TASKS', todolistId})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(todolistsAPI.getTasks, todolistId))

    const fakeApiResponse: GetTasksResponse = {
        error: '',
        totalCount: 1,
        items: [{
            id: '1',
            title: 'CSS',
            status: TaskStatuses.New,
            todoListId: todolistId,
            description: '',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low,
        }],
    }

    expect(gen.next(fakeApiResponse).value).toEqual(put(setTasksAC(fakeApiResponse.items, todolistId)))
    expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')))
    expect(gen.next().done).toBeTruthy()
})

test('removeTaskWorkerSaga success', () => {
    const gen = removeTaskWorkerSaga({
        type: 'TASKS/REMOVE-TASK',
        taskId,
        todolistId,
    })
    expect(gen.next().value).toEqual(call(todolistsAPI.deleteTask, todolistId, taskId))
    expect(gen.next().value).toEqual(put(removeTaskAC(taskId, todolistId)))
    expect(gen.next().done).toBeTruthy()
})

describe('addTaskWorkerSaga', () => {
    const action = {
        type: 'TASKS/ADD-TASK',
        title: taskTitle,
        todolistId,
    }

    const gen = cloneableGenerator<any>(addTaskWorkerSaga)(action)
    expect(gen.next(action).value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(todolistsAPI.createTask, todolistId, taskTitle))

    it('puts task to store if no errors', () => {
        const clone = gen.clone()
        expect(clone.next(response).value).toEqual(put(addTaskAC(response.data.item)))
        expect(clone.next().value).toEqual(put(setAppStatusAC('succeeded')))
        expect(clone.next().done).toBeTruthy()
    })

    it('puts error to store if invalid request was sent and response contains message', () => {
        const clone = gen.clone()
        response.resultCode = 1
        response.messages = ['some error']
        expect(clone.next(response).value).toEqual(put(setAppErrorAC(response.messages[0])))
        expect(clone.next().value).toEqual(put(setAppStatusAC('failed')))
        expect(clone.next().done).toBeTruthy()
    })

    it('puts error to store if invalid request was sent and response doesn\'t contain message', () => {
        const clone = gen.clone()
        response.resultCode = 1
        expect(clone.next(response).value).toEqual(put(setAppErrorAC('Some error occurred')))
        expect(clone.next().value).toEqual(put(setAppStatusAC('failed')))
        expect(clone.next().done).toBeTruthy()
    })

    it('puts error to store if error was thrown', () => {
        const clone = gen.clone()
        expect(clone.throw && clone.throw({message: 'some error'}).value).toEqual(put(setAppErrorAC('some error')))
        expect(clone.next().value).toEqual(put(setAppStatusAC('failed')))
        expect(clone.next().done).toBeTruthy()
    })
})

test('updateTaskWorkerSaga success', () => {
    const gen = updateTaskWorkerSaga({
        type: 'TASKS/UPDATE-TASK',
        taskId,
        domainModel,
        todolistId,
    })

    expect(gen.next().value).toEqual(select())
    expect(gen.next({...state, ...response}).value).toEqual(call(todolistsAPI.updateTask, todolistId, taskId, domainModel))

    expect(gen.next({...state, ...response}).value).toEqual(put(updateTaskAC(taskId, domainModel, todolistId)))
    expect(gen.next().done).toBeTruthy()
})

test('updateTaskWorkerSaga failure with message', () => {
    const gen = updateTaskWorkerSaga({
        type: 'TASKS/UPDATE-TASK',
        taskId,
        domainModel,
        todolistId,
    })

    expect(gen.next().value).toEqual(select())
    expect(gen.next({...state, ...response}).value).toEqual(call(todolistsAPI.updateTask, todolistId, taskId, domainModel))

    response.resultCode = 1
    response.messages = ['some error']
    expect(gen.next({...state, ...response}).value).toEqual(put(setAppErrorAC(response.messages[0])))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))
    expect(gen.next().done).toBeTruthy()
})

test('updateTaskWorkerSaga failure without message', () => {
    const gen = updateTaskWorkerSaga({
        type: 'TASKS/UPDATE-TASK',
        taskId,
        domainModel,
        todolistId,
    })

    expect(gen.next().value).toEqual(select())
    expect(gen.next({...state, ...response}).value).toEqual(call(todolistsAPI.updateTask, todolistId, taskId, domainModel))

    response.resultCode = 1
    expect(gen.next({...state, ...response}).value).toEqual(put(setAppErrorAC('Some error occurred')))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))
    expect(gen.next().done).toBeTruthy()
})

test('updateTaskWorkerSaga catch error case', () => {
    const gen = updateTaskWorkerSaga({
        type: 'TASKS/UPDATE-TASK',
        taskId,
        domainModel,
        todolistId,
    })

    expect(gen.next().value).toEqual(select())
    expect(gen.next({...state, ...response}).value).toEqual(call(todolistsAPI.updateTask, todolistId, taskId, domainModel))

    expect(gen.throw({message: 'some error'}).value).toEqual(put(setAppErrorAC('some error')))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))
    expect(gen.next().done).toBeTruthy()
})

