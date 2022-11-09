import {call, put, takeEvery} from 'redux-saga/effects'
import {setAppStatusAC} from 'app/app-reducer'
import {
    authAPI,
    LoginParamsType,
    LoginResponseType,
    ResponseType,
} from 'api/todolists-api'
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from 'utils/error-utils'
import {setIsLoggedInAC} from 'features/Login/auth-reducer'
import {AxiosResponse} from 'axios'

export function* loginWorkerSaga(action: ReturnType<typeof login>) {
    try {
        yield put(setAppStatusAC('loading'))
        const data: LoginResponseType = yield call(authAPI.login, action.data)
        if (data.resultCode === 0) {
            yield put(setIsLoggedInAC(true))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield* handleServerAppErrorSaga(data)
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    }
}

export const login = (data: LoginParamsType) => ({
    type: 'AUTH/LOGIN',
    data,
} as const)

export function* logoutWorkerSaga() {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<ResponseType<{userId?: number}>> = yield call(authAPI.logout)
    try {
        if (res.data.resultCode === 0) {
            yield put(setIsLoggedInAC(false))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield* handleServerAppErrorSaga(res.data)
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    }
}

export const logout = () => ({
    type: 'AUTH/LOGOUT',
} as const)

export function* authWatcherSaga() {
    yield takeEvery('AUTH/LOGIN', loginWorkerSaga)
    yield takeEvery('AUTH/LOGOUT', logoutWorkerSaga)
}