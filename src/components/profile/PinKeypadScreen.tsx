import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PinKeypadScreenProps {
  childName: string;
  childAvatar?: string;
  childColor?: string;
  pinLength: number; // usually 4 or 6
  onVerifyPin: (pin: string) => Promise<boolean>;
  onCancel: () => void;
  isLocked?: boolean;
  lockedUntil?: Date;
}

export function PinKeypadScreen({
  childName,
  childAvatar,
  childColor,
  pinLength,
  onVerifyPin,
  onCancel,
  isLocked = false,
  lockedUntil,
}: PinKeypadScreenProps) {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked || isVerifying || isSuccess) return;

      if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        onCancel();
      } else if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isLocked, isVerifying, isSuccess]);

  const handleKeyPress = async (digit: string) => {
    if (pin.length >= pinLength || isVerifying || isLocked || isSuccess) return;
    setError(null);
    const newPin = pin + digit;
    setPin(newPin);

    if (newPin.length === pinLength) {
      verify(newPin);
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isVerifying && !isLocked && !isSuccess) {
      setPin(pin.slice(0, -1));
      setError(null);
    }
  };

  const verify = async (pinToVerify: string) => {
    setIsVerifying(true);
    try {
      const success = await onVerifyPin(pinToVerify);
      if (success) {
        setIsSuccess(true);
      } else {
        setPin('');
        setError('Oops! Try again.');
      }
    } catch (err: any) {
      setPin('');
      setError(err.message || 'Oops! Try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const keypadDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white/95 rounded-[40px] shadow-2xl p-8 md:p-12 max-w-md w-full flex flex-col items-center relative overflow-hidden"
      >
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div
          className="w-24 h-24 rounded-full mb-6 shadow-inner flex items-center justify-center text-4xl overflow-hidden"
          style={{ background: childColor || '#E2E8F0' }}
        >
          {childAvatar ? (
            <img src={childAvatar} alt={childName} className="w-full h-full object-cover" />
          ) : (
            '🦊'
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Hi, {childName}!</h2>
        <p className="text-gray-500 font-medium mb-8">
          {isLocked ? 'Profile is resting' : 'Enter your secret PIN'}
        </p>

        {isLocked ? (
          <div className="text-center p-6 bg-orange-50 rounded-2xl border border-orange-100 mb-8 w-full">
            <div className="text-4xl mb-4">💤</div>
            <p className="text-orange-800 font-semibold mb-2">Too many tries!</p>
            <p className="text-orange-600/80 text-sm">
              Let's take a short break. Try again later.
            </p>
          </div>
        ) : (
          <>
            {/* PIN Dots */}
            <motion.div
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex gap-4 mb-8"
            >
              {[...Array(pinLength)].map((_, i) => (
                <div
                  key={i}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                    i < pin.length
                      ? 'bg-blue-500 border-blue-500 scale-110'
                      : 'bg-transparent border-gray-300'
                  } ${isSuccess ? 'bg-green-500 border-green-500' : ''}`}
                />
              ))}
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-500 font-semibold text-sm mb-4 absolute top-1/2 mt-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-[280px]">
              {keypadDigits.map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeyPress(digit.toString())}
                  disabled={isVerifying}
                  className="w-full aspect-square rounded-full bg-gray-50 hover:bg-blue-50 active:bg-blue-100 text-3xl font-bold text-gray-700 transition-colors shadow-sm flex items-center justify-center border border-gray-100 disabled:opacity-50"
                >
                  {digit}
                </button>
              ))}
              
              <div className="col-span-1" /> {/* Empty space */}
              
              <button
                onClick={() => handleKeyPress('0')}
                disabled={isVerifying}
                className="w-full aspect-square rounded-full bg-gray-50 hover:bg-blue-50 active:bg-blue-100 text-3xl font-bold text-gray-700 transition-colors shadow-sm flex items-center justify-center border border-gray-100 disabled:opacity-50"
              >
                0
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isVerifying || pin.length === 0}
                className="w-full aspect-square rounded-full bg-gray-50 hover:bg-red-50 active:bg-red-100 text-gray-500 hover:text-red-500 transition-colors shadow-sm flex items-center justify-center border border-gray-100 disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" x2="12" y1="9" y2="15" />
                  <line x1="12" x2="18" y1="9" y2="15" />
                </svg>
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
