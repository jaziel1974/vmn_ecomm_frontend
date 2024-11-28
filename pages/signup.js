import Button from '@/components/Button';
import ButtonLink from '@/components/ButtonLink';
import Center from '@/components/Center';
import Header from '@/components/Header';
import Input from '@/components/Input';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation'
import { AuthContext } from './api/auth/auth';
import {background} from "@/lib/colors";
import { sendEmail } from '@/shared/mail';

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

export const DivBlur = styled.div`
    display: flex;
    width:100%;
    height:100vh;
    background-color: ${background};
    position: absolute;
    left: 0px;
    z-index: 10;
    opacity: 80%;
`;

export const LabelWarning = styled.label`
    align-self: center;
    text-align: center;
    font-size: 2.5rem;
    color: #ff3737;

`;

export default function SigninPage() {
    const router = useRouter();

    const { signup } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [emailConfirm, setEmailConfirm] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('5511');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignup = () => {
        if (!name | !email | !emailConfirm | !phoneNumber | !password) {
            setError('Preencha todos os campos');
            return;
        } else if (phoneNumber.length < 8) {
            setError('Preencha o telefone com o DDD');
            return;
        } else if (email !== emailConfirm) {
            setError('Os e-mails devem ser iguais');
            return;
        }

        signup(name, email, phoneNumber, password)
            .then(res => {
                if (res?.data){
                    sendEmail(email, "template_20efba4");
                    setError("Solicitação de cadastro realizada. Em breve você receberá um e-mail de confirmação.");
                }
                else{
                    setError(res);
                }
            })
            .catch(err => {
                setError(err);
            })
    }

    return (
        <>
            <Header />
            <Center>
                <Container>
                    <Content>
                        <Input placeholder="Nome" type="name" value={name} onChange={e => [setName(e.target.value), setError('')]}></Input>
                        <Input placeholder="E-mail" type="email" value={email} onChange={e => [setEmail(e.target.value), setError('')]}></Input>
                        <Input placeholder="Confirme seu e-mail" type="email" value={emailConfirm} onChange={e => [setEmailConfirm(e.target.value), setError('')]}></Input>
                        <Input placeholder="Telefone" type="phoneNumber" value={phoneNumber} onChange={e => [setPhoneNumber(e.target.value), setError('')]}></Input>
                        <Input placeholder="Senha" type="password" value={password} onChange={e => [setPassword(e.target.value), setError('')]}></Input>
                        <LabelError>{error}</LabelError>
                        <Button black block onClick={handleSignup}>Cadastrar</Button>
                        <LabelSignup>Já possui uma conta? <ButtonLink href="/signin" black={1}>Entre</ButtonLink></LabelSignup>
                    </Content>
                </Container>
            </Center>
        </>
    );
}