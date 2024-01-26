import Button from '@/components/Button';
import ButtonLink from '@/components/ButtonLink';
import Center from '@/components/Center';
import Header from '@/components/Header';
import Input from '@/components/Input';
import React, { useState } from 'react';
import styled from 'styled-components';
import useAuth from './hooks/useAuth';
import { useRouter } from 'next/navigation'

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 10px;
    height: 100vh;
`;

export const Content = styled.div`
    gap: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    box-shadow: 0 1px 2px #0003;
    background-color: white;
    max-width: 350px;
    padding: 20px;
    border-radius: 5px;
`;

export const Label = styled.label`
    font-size: 18px;
    font-weight: 600;
    color: #676767;
`;

export const LabelSignup = styled.label`
    font-size: 16px;
    color: #676767;
`;

export const LabelError = styled.label`
    font-size: 14px;
    color: red;
`;

export const Strong = styled.strong`
    cursor: pointer;

    a{
        text-decoration: none;
        color: #676767;
    }
`;

export default function SigninPage() {
    const router = useRouter();

    const { signin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if(!email | !password) {
            setError('Preencha todos os campos');
            return;
        }
        const res = signin(email, password);
        if(res){
            setError(res);
            return;
        }
        router.push('/products');
    }

    return (
        <>
            <Header />
            <Center>
                <Container>
                    <Content>

                        <Input placeholder="E-mail" type="email" value={email} onChange={e => [setEmail(e.target.value), setError('')]}></Input>
                        <Input placeholder="Senha" type="password" value={password} onChange={e => [setPassword(e.target.value), setError('')]}></Input>
                        <LabelError>{error}</LabelError>
                        <Button black block onClick={handleLogin}>Entrar</Button>
                        <LabelSignup>Não possui uma conta? <ButtonLink href="/signup" black={1}>Cadastre-se</ButtonLink></LabelSignup>
                    </Content>
                </Container>
            </Center>
        </>
    );
}