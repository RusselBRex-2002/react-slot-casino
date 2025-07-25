// src/components/GameController.jsx
import React, { useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { playSpinSound, playWinSound } from '../utils/sound';

const SYMBOLS = ['🍒', '🍋', '🔔', '7️⃣', '🍊'];
const REEL_COUNT = 3;

function getRandomReels() {
  return Array.from({ length: REEL_COUNT }, () =>
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  );
}

const Container = styled.div`
  width: 90vw;
  max-width: 400px;
  margin: 0 auto;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.7);
  text-align: center;
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(1.5rem, 6vw, 2rem);
`;

const reelSpin = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
`;

const Reels = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 1rem 0;
  overflow: hidden;
`;

const Reel = styled.div`
  flex: 1;
  width: clamp(60px, 20vw, 100px);
  height: clamp(60px, 20vw, 100px);
  line-height: clamp(60px, 20vw, 100px);
  font-size: clamp(1.5rem, 8vw, 2.5rem);
  border: 3px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 6px;
  background: #333;
  color: ${({ theme }) => theme.colors.text};

  ${({ spinning }) =>
    spinning &&
    css`
      animation: ${reelSpin} 0.1s linear infinite;
    `}
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const Label = styled.label`
  font-size: clamp(0.9rem, 3vw, 1rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  max-width: 80px;
  margin-top: 0.25rem;
  padding: 0.3rem;
  font-size: 1rem;
  text-align: center;
  border: 2px solid ${({ theme }) => theme.colors.text};
  border-radius: 4px;
  background: #444;
  color: ${({ theme }) => theme.colors.text};
`;

const Button = styled.button`
  flex: 1;
  min-width: 100px;
  padding: 0.6rem 1rem;
  margin-top: 0.5rem;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(1rem, 4vw, 1.1rem);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.secondary};
  }
  &:disabled {
    background: #777;
    cursor: not-allowed;
  }
`;

export default function GameController() {
  const initialBalance = 100;
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState(5);
  const [reels, setReels] = useState(getRandomReels());
  const [isSpinning, setIsSpinning] = useState(false);

  const audioCtx = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  ).current;

  function handleSpin() {
    if (isSpinning || bet < 1 || bet > balance) return;

    setIsSpinning(true);
    playSpinSound(audioCtx);

    const intervalId = setInterval(() => {
      setReels(getRandomReels());
    }, 100);

    setTimeout(() => {
      clearInterval(intervalId);
      const final = getRandomReels();
      setReels(final);

      const [a, b, c] = final;
      const multiplier =
        a === b && b === c
          ? 10
          : a === b || b === c || a === c
          ? 2
          : 0;

      const payout = bet * multiplier;
      setBalance((bal) => bal - bet + payout);
      if (payout > 0) playWinSound(audioCtx);
      setIsSpinning(false);
    }, 2000);
  }

  function restartGame() {
    setBalance(initialBalance);
    setReels(getRandomReels());
  }

  return (
    <Container>
      {balance <= 0 ? (
        <>
          <Title>Game Over</Title>
          <p>Your balance is zero.</p>
          <Button onClick={restartGame}>Restart</Button>
        </>
      ) : (
        <>
          <Title>Balance: ₹{balance}/-</Title>
          <Reels>
            {reels.map((sym, i) => (
              <Reel key={i} spinning={isSpinning}>
                {sym}
              </Reel>
            ))}
          </Reels>

          <Controls>
            <Label>
              Bet
              <Input
                type="number"
                min="1"
                max={balance}
                value={bet}
                disabled={isSpinning}
                onChange={(e) => setBet(Number(e.target.value) || 0)}
              />
            </Label>

            <Button onClick={handleSpin} disabled={isSpinning}>
              {isSpinning ? 'Spinning…' : 'Spin'}
            </Button>
          </Controls>
        </>
      )}
    </Container>
  );
}
