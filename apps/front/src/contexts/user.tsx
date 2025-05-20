import {createContext, useContext} from "react"
import {User} from "@neat/types";

export const UserContext = createContext<User>(undefined as never)

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}