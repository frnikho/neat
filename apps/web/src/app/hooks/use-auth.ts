import { useContext } from "react";
import { UserContext } from "@app/context/user.context";

export function useAuth() {
	const { user, roles } = useContext<UserContext>(UserContext);

	return {
		user,
		roles,
	};
}
