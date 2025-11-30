import { useEffect } from 'react';
import './App.css'
import { useAuth } from "react-oidc-context";

function App() {
    const auth = useAuth();

    useEffect(() => {
        if (auth.isAuthenticated && auth.user?.profile.name) {
            fetch('/api/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.user.access_token}`
                },
                body: JSON.stringify({ email: auth.user.profile.name })
            }).catch(console.error);
        }
    }, [auth.isAuthenticated, auth.user]);

    switch (auth.activeNavigator) {
        case "signinSilent":
            return <div>Signing you in...</div>;
        case "signoutRedirect":
            return <div>Signing you out...</div>;
    }

    if (auth.isLoading) {
        return <div>Loading...</div>;
    }

    if (auth.error) {
        return <div>Oops... {auth.error.message}</div>;
    }

    if (auth.isAuthenticated) {
        return (
        <div>
            Hello {auth.user?.profile.name}{" "}
            <button onClick={() => void auth.signoutRedirect()}>Log out</button>
        </div>
        );
    }

    return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
}

export default App;