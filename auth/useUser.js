import { useEffect, useState } from 'react'

import { removeUserCookie, setUserCookie, getUserFromCookie } from './userCookie'
import { mapUserData } from './mapUserData'
import { Redirect } from 'react-router'
import { app } from '../firebase'

const useUser = () => {
    const [user, setUser] = useState()

    const logout = () => {
        app.auth().signOut()
            .then(() => {
                return <Redirect to="/" />
            }).catch((e) => {
                console.error(e)
            })
    }

    useEffect(() => {
        const cancelAuthListener = app.auth().onIdTokenChanged((user) => {
            if (user) {
                const userData = mapUserData(user)
                setUserCookie(userData)
                setUser(userData)
            } else removeUserCookie()
        })

        const userFromCookie = getUserFromCookie()
        if (!userFromCookie) {
            return <Redirect to="/" />
        }
        setUser(userFromCookie)

        return () => {
            cancelAuthListener()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return { user, logout }
}
export { useUser }