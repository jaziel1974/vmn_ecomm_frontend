import { useContext } from 'react';
import { AuthContext } from '../../pages/api/auth/auth';

const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
};

export default useAuth;

