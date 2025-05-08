'use client';

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { decrypt, encrypt } from "../../../shared/crypto";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();

    useEffect(() => {
        const userToken = localStorage.getItem('user_token');

        if (userToken) {
            const emailFromStorage = JSON.parse(userToken).email;
            if (emailFromStorage) {
                axios.get('/api/users?email=' + emailFromStorage)
                    .then(response => {
                        const userResponse = response;
                        axios.get('/api/customers?email=' + emailFromStorage)
                            .then(response => {
                                if (!response.data) {
                                    setUser(null);
                                }
                                else {
                                    userResponse.data.customer = response.data;
                                    setUser({ email: emailFromStorage, password: undefined, user: userResponse });
                                }
                            })
                            .catch(error => {
                                console.log("error", error);
                            });
                    })
                    .catch(error => {
                        setUser(null);
                    });
            }
            else {
                setUser(null);
            }
        }
    }, []);

    const signin = async (email, password) => {
        let user = await axios.get('/api/users?email=' + email);
        console.log("user", user);

        if (user.data) {
            const decrPass = decrypt(user.data?.password);

            if (user.data.email === email && decrPass === password) {
                const token = Math.random().toString(36).substring(2);
                localStorage.setItem('user_token', JSON.stringify({ email, token }));

                let customerData = await axios.get('/api/customers?email=' + email);
                if (!customerData.data) {
                    user = null;
                }
                else {
                    user.data.customer = customerData.data;
                }

                setUser({ email, password, user });
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

    const encryptedSignin = async (encryptedMessage) => {
        const decrypted = decrypt(encryptedMessage);
        const data = decrypted.split(':');
        const email = data[0];
        const password = data[1];
        const expiration = data[2];

        const user = await axios.get('/api/users?email=' + email);
        const customer = await axios.get('/api/customers?email=' + email);

        const userData = user?.data;
        userData.customer = customer?.data;

        const hasUser = userData?.email === email;
        const encrPass = encrypt(password);

        if (hasUser) {
            if (user.data.email === email && user.data?.password === encrPass) {
                const token = Math.random().toString(36).substring(2);
                localStorage.setItem('user_token', JSON.stringify({ email, token }));

                if (expiration > Date.now()) {
                    return 'Sua sessão expirou. Por favor, faca login novamente.';
                }

                setUser({ email, password, user });
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

    const signup = async (name, email, phoneNumber, password) => {
        const responseHold = await axios.get('/api/customershold?email=' + email);
        const hasUserHold = responseHold?.data?.email === email;
        if (hasUserHold) {
            return 'Solicitação de cadastro já existe. Por favor, aguarde a liberação ou entre em contato pelo WhatsApp.';
        }
        const responseCustomer = await axios.get('/api/customers?email=' + email);
        const hasUser = responseCustomer?.data?.email === email;
        if (hasUser) {
            return 'Usuário ja existe';
        }

        return await axios.post('/api/customershold', {
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            password: password
        })
    };

    const signout = () => {
        setUser(null);
        localStorage.removeItem('user_token');
    };

    return (
        <AuthContext.Provider value={{ user, signed: !!user, signin, signup, signout, encryptedSignin }}>
            {children}
        </AuthContext.Provider>
    );
}