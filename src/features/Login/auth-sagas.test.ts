import {call, put} from 'redux-saga/effects'
import {setAppErrorAC, setAppStatusAC} from 'app/app-reducer'
import {loginWorkerSaga} from 'features/Login/auth-sagas'
import {authAPI, LoginParamsType, LoginResponseType} from 'api/todolists-api'
import {setIsLoggedInAC} from 'features/Login/auth-reducer'

let data: LoginParamsType
let loginResponse: LoginResponseType
let error: {message: string}

beforeEach(() => {
    data = {email: 'testmail@gmail.com', password: 'testPassword', rememberMe: true}
    loginResponse = {
        resultCode: 0,
        data: {userId: 123},
        messages: [],
    }
    error = {} as {message: string}
})

test('loginWorkerSaga success', () => {
    const gen = loginWorkerSaga({type: 'AUTH/LOGIN', data})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(authAPI.login, data))
    expect(gen.next(loginResponse).value).toEqual(put(setIsLoggedInAC(true)))
    expect(gen.next().value).toEqual(put(setAppStatusAC('succeeded')))
    expect(gen.next().done).toBeTruthy()
})

test('loginWorkerSaga failure with message', () => {
    const gen = loginWorkerSaga({type: 'AUTH/LOGIN', data})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(authAPI.login, data))

    loginResponse.resultCode = 1
    loginResponse.messages = ['some error']
    expect(gen.next(loginResponse).value).toEqual(put(setAppErrorAC(loginResponse.messages[0])))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))
    expect(gen.next().done).toBeTruthy()
})

test('loginWorkerSaga failure without message', () => {
    const gen = loginWorkerSaga({type: 'AUTH/LOGIN', data})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(authAPI.login, data))

    loginResponse.resultCode = 1
    expect(gen.next(loginResponse).value).toEqual(put(setAppErrorAC('Some error occurred')))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))
    expect(gen.next().done).toBeTruthy()
})

test('loginWorkerSaga catch error case with message', () => {
    const gen = loginWorkerSaga({type: 'AUTH/LOGIN', data})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(authAPI.login, data))

    error.message = 'some error'
    expect(gen.throw(error).value).toEqual(put(setAppErrorAC(error.message)))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))
    expect(gen.next().done).toBeTruthy()
})

test('loginWorkerSaga catch error case without message', () => {
    const gen = loginWorkerSaga({type: 'AUTH/LOGIN', data})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')))
    expect(gen.next().value).toEqual(call(authAPI.login, data))

    expect(gen.throw(error).value).toEqual(put(setAppErrorAC('Some error occurred')))
    expect(gen.next().value).toEqual(put(setAppStatusAC('failed')))
    expect(gen.next().done).toBeTruthy()
})


