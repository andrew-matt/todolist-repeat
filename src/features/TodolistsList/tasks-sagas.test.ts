import {call, put} from 'redux-saga/effects'
import {
    GetTasksResponse,
    MeResponseType,
    TaskPriorities,
    TaskStatuses,
    todolistsAPI,
} from 'api/todolists-api'
import {setAppErrorAC, setAppStatusAC} from 'app/app-reducer'
import {addTaskWorkerSaga, fetchTasksWorkerSaga} from 'features/TodolistsList/tasks-sagas'
import {setTasksAC} from 'features/TodolistsList/tasks-reducer'

let meResponse: MeResponseType

beforeEach(() => {

})

test('fetchTasksWorkerSaga success flow', () => {
    const todolistId = 'todolistId'
    const gen = fetchTasksWorkerSaga({type: 'TASKS/FETCH-TASKS', todolistId: todolistId})
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

test('addTaskWorkerSaga error flow', () => {
    const todolistId = 'todolistId'
    const taskTitle = 'task title'
    const gen = addTaskWorkerSaga({type: 'TASKS/ADD-TASK', title: taskTitle, todolistId})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(todolistsAPI.createTask, todolistId, taskTitle))
    expect(gen.throw({message: 'some error'}).value).toEqual(put(setAppErrorAC('some error')))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))
})