import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '../store';

// Auto-login as demo user for now until auth is implemented
export default function useAutoLogin() {
    const [user, setUser] = useAtom(userAtom);

    useEffect(() => {
        if (!user) {
            fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'demo',
                    password: 'demo123'
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setUser(data.user);
                        console.log('Auto-logged in as demo user');
                    }
                })
                .catch(err => {
                    console.error('Auto-login failed:', err);
                });
        }
    }, [user, setUser]);
}