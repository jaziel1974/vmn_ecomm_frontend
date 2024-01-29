import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";
import { CustomerHold } from "@/models/CustomerHold";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();

    useEffect(() => {
        const userToken = localStorage.getItem('user_token');
        const userStorage = localStorage.getItem('users_db');

        if (userToken && userStorage) {
            const hasUser = JSON.parse(userStorage).filter(user => user.email === JSON.parse(userToken).email);
            if (hasUser) {
                setUser(hasUser[0]);
            }
        }
    }, []);

    const signin = async (email, password) => {
        const user = await axios.get('/api/customers?email=' + email);
        const hasUser = user?.data?.email === email;

        if (hasUser) {
            if (user.data.email === email /*&& user.data.password === password*/) {
                const token = Math.random().toString(36).substring(2);
                localStorage.setItem('user_token', JSON.stringify({ email, token }));
                setUser({ email, password });
                return;
            }
            else {
                return 'Usuário ou senha incorretos';
            }
        }
        else {
            return 'Usuário não encontrado';
        }
    };

    const signup = async (name, email, password) => {
        const responseHold = await axios.get('/api/customershold?email=' + email);
        const hasUserHold = responseHold?.data?.email === email;
        if (hasUserHold) {
            return 'Solicitação de cadastro já existe. Por favor, aguarde a liberação ou entre em contato pelo WhatsApp.';
        }
        return await axios.post('/api/customershold', {
            name: name,
            email: email,
            password: password
        })
    };

    const signout = () => {
        setUser(null);
        localStorage.removeItem('user_token');
    };

    return (
        <AuthContext.Provider
            value={{ user, signed: !!user, signin, signup, signout }}
        >
            {children}
        </AuthContext.Provider>
    );
};