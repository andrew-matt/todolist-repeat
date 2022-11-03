import {
    tasksReducer,
} from '../features/TodolistsList/tasks-reducer'
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer'
import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {appReducer} from './app-reducer'
import {authReducer} from '../features/Login/auth-reducer'
import createSagaMiddleware from 'redux-saga'
import {takeEvery, all} from 'redux-saga/effects'
import {
    fetchTasksWorkerSaga,
    removeTaskWorkerSaga, tasksWatcherSaga,
} from 'features/TodolistsList/tasks-sagas'
import {appWatcherSaga, initializeAppWorkerSaga} from 'app/app-sagas'

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
})

const sagaMiddleware = createSagaMiddleware()

// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, sagaMiddleware))
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield all([appWatcherSaga(), tasksWatcherSaga()])
}

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
