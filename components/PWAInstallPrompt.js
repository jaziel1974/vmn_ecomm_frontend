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

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000); // Show for 5 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <ModalPrompt>
      <div>
        <strong>📱 Instale o VMN Store!</strong>
        <br />
        <small>Adicione o app à sua tela inicial para uma experiência completa.</small>
      </div>
      <CloseButton onClick={() => setVisible(false)}>×</CloseButton>
    </ModalPrompt>
  );
}
