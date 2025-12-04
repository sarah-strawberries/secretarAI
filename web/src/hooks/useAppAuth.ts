import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

export function useAppAuth() {
    const auth = useAuth();

    useEffect(() => {
        if (auth.isAuthenticated && auth.user?.profile.name) {
            void fetch("/api/user-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.user.access_token}`,
                },
                body: JSON.stringify({ email: auth.user.profile.name }),
            });
        }
    }, [auth.isAuthenticated, auth.user]);

    return auth;
}
