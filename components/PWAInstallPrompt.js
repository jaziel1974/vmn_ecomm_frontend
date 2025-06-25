import { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalPrompt = styled.div`
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #1B422E;
  color: white;
  padding: 18px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.18);
  z-index: 3000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80vw;
  max-width: 80vw;
  min-width: 260px;
  animation: fadeInDown 0.4s cubic-bezier(.4,0,.2,1);

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-40px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

const InstallButton = styled.button`
  background: #FEBA51;
  color: #1B422E;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-left: 18px;
  &:hover {
    background: #e6a54a;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin-left: 18px;
`;

export default function PWAInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000);
    // Detect iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    // Listen for beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <ModalPrompt>
      <div>
        {isIOS ? (
          <small>Abra o menu de compartilhamento e toque em "Adicionar à Tela de Início".</small>
        ) : deferredPrompt ? (
          <small>Clique para adicionar o app à tela inicial para acesso rápido.</small>
        ) : (
          <small>Adicione à tela inicial para uma experiência completa.</small>
        )}
      </div>
      <div>
        {!isIOS && deferredPrompt && (
          <InstallButton onClick={handleInstallClick}>
            Instalar
          </InstallButton>
        )}
        <CloseButton onClick={() => setVisible(false)}>×</CloseButton>
      </div>
    </ModalPrompt>
  );
}
