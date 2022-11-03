import {initializeAppWorkerSaga} from 'app/app-sagas'
import {call, put} from 'redux-saga/effects'
import {authAPI, MeResponseType} from 'api/todolists-api'
import {setIsLoggedInAC} from 'features/Login/auth-reducer'
import {setAppInitializedAC} from 'app/app-reducer'

let meResponse: MeResponseType

beforeEach(() => {
    meResponse = {
        resultCode: 0,
        data: {id: 1, email: '', login: ''},
        messages: [],
    }
})

test('initializeAppWorkerSaga login success', () => {
    const gen = initializeAppWorkerSaga()
    expect(gen.next().value).toEqual(call(authAPI.me))
    expect(gen.next(meResponse).value).toEqual(put(setIsLoggedInAC(true)))
    expect(gen.next().value).toEqual(put(setAppInitializedAC(true)))
})

test('initializeAppWorkerSaga login failure', () => {
    const gen = initializeAppWorkerSaga()
    expect(gen.next().value).toEqual(call(authAPI.me))

    meResponse.resultCode = 1
    expect(gen.next(meResponse).value).toEqual(put(setAppInitializedAC(true)))
})