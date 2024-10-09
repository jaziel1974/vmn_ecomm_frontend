import { useRouter, useSearchParams } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from './api/auth/auth';

export default function EncryptedSigninPage() {
    const router = useRouter();
    const params = useSearchParams();
    const encryptedMessage = params.get("params");
    const { encryptedSignin } = useContext(AuthContext);

    encryptedSignin(encryptedMessage)
        .then(res => {
            if (res) {
                setError(res);
                return;
            }
            router.push('/products');
        });

    return (
        <>
            <span style={{ color: 'red' }}>Por favor, aguarde...</span>
        </>
    );
}