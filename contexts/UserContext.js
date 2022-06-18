import React from 'react'

export const UserContext = React.createContext({
    user: {},
    setUser: (e) => { },
    membership: {},
    setMembership: (e) => { }
})