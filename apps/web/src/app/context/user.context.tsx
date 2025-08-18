import { UserResponse } from "@neat/types/user";
import { createContext, type PropsWithChildren } from "react";

export type UserContext = {
	user: {
		firstname: string;
		lastname: string;
		email: string;
		id: string;
		profilePicture?: string | undefined;
		createdAt: Date;
		updatedAt?: Date | undefined;
	};
	roles: {
		role: {
			createdAt?: Date | undefined;
			createdBy?: string | undefined;
			updatedAt?: Date | undefined;
			updatedBy?: string | undefined;
			description?: string | undefined;
			permissions?: string[] | undefined;
			name: string;
			id: string;
		};
		permissions: {
			id: string;
			name: string;
			description?: string | undefined;
            resource: string;
            action: string;
		}[];
	}[];
};

export const UserContext = createContext<UserContext>(undefined as never);

export function UserContextProvider({ ctx, children }: PropsWithChildren<{ ctx: UserContext }>) {
	return <UserContext.Provider value={ctx}>{children}</UserContext.Provider>;
}
