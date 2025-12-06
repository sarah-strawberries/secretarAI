import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

export function useAppAuth() {
    const auth = useAuth();

    useEffect(() => {
        if (auth.isAuthenticated && auth.user?.profile) {
            const email = auth.user.profile.email || auth.user.profile.name;
            const displayName = auth.user.profile.name || email || "User";
            
            if (email) {
                void fetch("/api/account-login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${auth.user.access_token}`,
                    },
                    body: JSON.stringify({ email, displayName }),
                });
            }
        }
    }, [auth.isAuthenticated, auth.user]);

    return auth;
}
