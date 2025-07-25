// src/App.jsx
import React from 'react';
import styled from 'styled-components';
import GameController from './components/GameController';

const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;    /* full viewport height */
  background: ${({ theme }) => theme.colors.bg};
`;

export default function App() {
  return (
    <AppWrapper>
      <GameController />
    </AppWrapper>
  );
}
