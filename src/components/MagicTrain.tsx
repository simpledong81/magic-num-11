import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plus, RefreshCw, Volume2, VolumeX, Flame, ChevronRight, HelpCircle } from 'lucide-react';
import { audioEngine } from './AudioEngine';
import { TrainCar, MagicMode } from '../types';

interface MagicTrainProps {
  sceneId: 'split-magic' | 'addition-slide' | 'shortcut-derivation';
  inputNumber: number;
  magicMode: MagicMode;
  onSceneComplete?: () => void;
}

const CAR_COLORS = [
  'bg-rose-500 border-rose-600 shadow-rose-200 text-white',
  'bg-amber-500 border-amber-600 shadow-amber-200 text-white',
  'bg-sky-500 border-sky-600 shadow-sky-200 text-white',
  'bg-purple-500 border-purple-600 shadow-purple-200 text-white',
  'bg-emerald-500 border-emerald-600 shadow-emerald-200 text-white',
];

export const MagicTrain: React.FC<MagicTrainProps> = ({ sceneId, inputNumber, magicMode, onSceneComplete }) => {
  // Parse digits of the number
  const digits = String(inputNumber).split('').map(Number);
  
  // Audio state
  const [isMuted, setIsMuted] = useState(false);

  // Scene 1 State
  const [splitStep, setSplitStep] = useState<0 | 1 | 2>(0); // 0: initial, 1: twins/symbol appear, 2: split completed

  // Scene 2 State
  const [additionStep, setAdditionStep] = useState<number>(-1); // -1: initial align, 0 to length: active column index (from right to left)
  const [additionResult, setAdditionResult] = useState<number[]>([]);

  // Scene 3 State
  const [shortcutStep, setShortcutStep] = useState<0 | 1 | 2 | 3>(0); // 0: original, 1: ends pulled, 2: middle adding, 3: completed
  const [huggedIndex, setHuggedIndex] = useState<number>(-1); // which adjacent pair is currently hugging

  // Reset states when inputNumber or sceneId or magicMode changes
  useEffect(() => {
    setSplitStep(0);
    setAdditionStep(-1);
    setAdditionResult([]);
    setShortcutStep(0);
    setHuggedIndex(-1);
  }, [inputNumber, sceneId, magicMode]);

  // Audio mute sync
  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioEngine.setMute(nextMute);
  };

  // Helper to get color class based on index
  const getColorClass = (index: number) => {
    return CAR_COLORS[index % CAR_COLORS.length];
  };

  // Train Carriage render component
  const RenderCar = ({ digit, index, isSpecial = false, isEngine = false, isBalloon = false }: { digit: string | number, index: number, isSpecial?: boolean, isEngine?: boolean, isBalloon?: boolean }) => {
    const color = isSpecial 
      ? 'bg-yellow-400 border-yellow-500 text-yellow-950 font-black shadow-yellow-100 animate-pulse' 
      : isEngine 
        ? 'bg-slate-700 border-slate-800 text-white' 
        : getColorClass(index);

    if (isEngine) {
      return (
        <div className="relative flex flex-col items-center justify-end h-16 w-16">
          {/* Smokestack with steam bubbles */}
          <div className="absolute -top-3 left-4 w-3 h-5 bg-slate-600 rounded-t border-2 border-slate-800 flex justify-center">
            <motion.div 
              animate={{ y: [-5, -20], scale: [0.6, 1.2, 0], opacity: [1, 0.8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute w-3 h-3 bg-white rounded-full border border-slate-200"
            />
            <motion.div 
              animate={{ y: [-5, -15], scale: [0.4, 0.9, 0], opacity: [0.8, 0.6, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: 0.5 }}
              className="absolute w-2 h-2 bg-white rounded-full border border-slate-200"
            />
          </div>
          {/* Cabin body */}
          <div className="w-16 h-12 bg-rose-600 border-4 border-slate-800 rounded-lg relative flex items-center justify-center shadow-lg">
            {/* Cute driver window */}
            <div className="w-6 h-5 bg-cyan-200 rounded-sm border-2 border-slate-800 flex items-center justify-center overflow-hidden">
              <span className="text-[10px] select-none">🐼</span>
            </div>
            {/* Cabin headlight */}
            <div className="absolute -left-2 top-4 w-3 h-3 bg-yellow-300 rounded-full border-2 border-slate-800 animate-pulse"></div>
            {/* Wheels */}
            <div className="absolute -bottom-2.5 left-1 w-5 h-5 bg-slate-800 rounded-full border-2 border-slate-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <div className="absolute -bottom-2.5 right-1 w-5 h-5 bg-slate-800 rounded-full border-2 border-slate-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      );
    }

    if (isBalloon) {
      return (
        <motion.div 
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="relative flex flex-col items-center w-14"
        >
          {/* Balloon Body */}
          <div className="w-12 h-14 bg-gradient-to-br from-yellow-300 to-amber-500 border-4 border-slate-800 rounded-full flex items-center justify-center shadow-md relative">
            <span className="text-xl font-bold font-display text-slate-900">{digit}</span>
            {/* Balloon knot */}
            <div className="absolute -bottom-1 w-2 h-2 bg-amber-600 border border-slate-800 rotate-45"></div>
          </div>
          {/* Balloon string */}
          <div className="w-0.5 h-6 bg-slate-600"></div>
        </motion.div>
      );
    }

    return (
      <div className={`w-14 h-12 rounded-lg border-4 border-slate-800 flex flex-col items-center justify-center relative shadow-md font-display font-bold text-lg ${color}`}>
        {/* Carriage window */}
        <div className="w-8 h-3 bg-white/20 rounded-xs border border-slate-800/20 mb-0.5"></div>
        <span>{digit}</span>
        {/* Wheels */}
        <div className="absolute -bottom-2.5 left-1.5 w-4 h-4 bg-slate-800 rounded-full border-2 border-slate-600 flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
        <div className="absolute -bottom-2.5 right-1.5 w-4 h-4 bg-slate-800 rounded-full border-2 border-slate-600 flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
    );
  };

  // Coupling link between carriages
  const Coupling = () => (
    <div className="w-3 h-2 bg-slate-700 self-end mb-3 border-y-2 border-slate-900 flex-shrink-0 z-0"></div>
  );

  // Train Tracks UI
  const TrainTrack = () => (
    <div className="relative w-full h-8 flex items-center my-1 select-none pointer-events-none">
      <div className="absolute w-full h-1 bg-slate-400 border-y border-slate-500 rounded"></div>
      <div className="absolute w-full h-full flex justify-around items-center px-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-1.5 h-6 bg-amber-800 border border-slate-900 rounded-xs"></div>
        ))}
      </div>
    </div>
  );

  // Trigger Split Spell in Scene 1
  const handleSplitMagic = () => {
    if (splitStep === 0) {
      audioEngine.playPop();
      setSplitStep(1);
    } else if (splitStep === 1) {
      audioEngine.playTrainWhistle();
      setSplitStep(2);
      if (onSceneComplete) setTimeout(onSceneComplete, 1500);
    }
  };

  // Math Setup digit calculations for sliding columns (Scene 2)
  const multiplier10Digits = [0, ...digits, 0];
  const multiplier1Digits = [0, 0, ...digits];

  // Digit arrays for carrying and borrowing
  const colSums: number[] = [];
  const colCarriesIn: number[] = [];
  const colCarriesOut: number[] = [];
  const colBorrowsIn: number[] = [];
  const colBorrowsOut: number[] = [];

  if (magicMode === 'multiply-9-magic') {
    let borrow = 0;
    for (let i = multiplier10Digits.length - 1; i >= 0; i--) {
      colBorrowsIn[i] = borrow;
      let diff = multiplier10Digits[i] - multiplier1Digits[i] - borrow;
      if (diff < 0) {
        diff += 10;
        borrow = 1;
      } else {
        borrow = 0;
      }
      colSums[i] = diff;
      colBorrowsOut[i] = borrow;
    }
  } else {
    let carry = 0;
    for (let i = multiplier10Digits.length - 1; i >= 0; i--) {
      colCarriesIn[i] = carry;
      const sum = multiplier10Digits[i] + multiplier1Digits[i] + carry;
      colSums[i] = sum % 10;
      carry = Math.floor(sum / 10);
      colCarriesOut[i] = carry;
    }
  }

  // Slice off leading zero in product sums if present
  const hasLeadingZero = colSums[0] === 0;
  const activeMultiplier10 = hasLeadingZero ? multiplier10Digits.slice(1) : multiplier10Digits;
  const activeMultiplier1 = hasLeadingZero ? multiplier1Digits.slice(1) : multiplier1Digits;
  const activeColSums = hasLeadingZero ? colSums.slice(1) : colSums;
  const activeCarriesIn = hasLeadingZero ? colCarriesIn.slice(1) : colCarriesIn;
  const activeBorrowsIn = hasLeadingZero ? colBorrowsIn.slice(1) : colBorrowsIn;

  // Slide addition step-by-step
  const handleAdditionStep = () => {
    const totalSteps = activeColSums.length;
    const currentStep = additionStep + 1;

    if (currentStep < totalSteps) {
      audioEngine.playPop();
      setAdditionStep(currentStep);
      
      const colIdx = totalSteps - 1 - currentStep;
      setAdditionResult(prev => [activeColSums[colIdx], ...prev]);
    } else {
      audioEngine.playChime();
      setAdditionStep(totalSteps);
      if (onSceneComplete) setTimeout(onSceneComplete, 1000);
    }
  };

  // Run Mnemonic Shortcut Step-by-Step
  const handleShortcutStep = () => {
    if (magicMode === 'multiply-9-magic') {
      if (shortcutStep === 0) {
        audioEngine.playSlide();
        setShortcutStep(1); // Show trailing zero attached
      } else if (shortcutStep === 1) {
        audioEngine.playPop();
        setShortcutStep(2); // Show subtraction column representation
      } else if (shortcutStep === 2) {
        audioEngine.playTrainWhistle();
        setShortcutStep(3); // Show finished product
        if (onSceneComplete) setTimeout(onSceneComplete, 1500);
      } else if (shortcutStep === 3) {
        setShortcutStep(0);
      }
    } else {
      // multiply-11 modes
      if (shortcutStep === 0) {
        audioEngine.playSlide();
        setShortcutStep(1);
      } else if (shortcutStep === 1) {
        audioEngine.playPop();
        setShortcutStep(2);
        setHuggedIndex(0);
      } else if (shortcutStep === 2) {
        const nextHug = huggedIndex + 1;
        if (nextHug < digits.length - 1) {
          audioEngine.playPop();
          setHuggedIndex(nextHug);
        } else {
          audioEngine.playTrainWhistle();
          setShortcutStep(3);
          setHuggedIndex(-1);
          if (onSceneComplete) setTimeout(onSceneComplete, 1500);
        }
      } else if (shortcutStep === 3) {
        setShortcutStep(0);
        setHuggedIndex(-1);
      }
    }
  };

  // Calculation of standard adjacent pairs for Shortcut Mnemonic representation (x11 modes)
  const intermediateSums: number[] = [];
  for (let i = 0; i < digits.length - 1; i++) {
    intermediateSums.push(digits[i] + digits[i + 1]);
  }

  return (
    <div className="w-full flex flex-col items-center select-none" id="magic-train-main">
      {/* Dynamic Visual Sandbox */}
      <div className="w-full bg-slate-50 border-4 border-slate-800 rounded-3xl p-4 md:p-6 cartoon-shadow relative overflow-hidden min-h-[380px] flex flex-col justify-between">
        
        {/* Soundtrack / Controls inside sandbox */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button 
            id="toggle-mute-btn"
            onClick={toggleMute}
            className="p-2 bg-white hover:bg-slate-100 rounded-full border-2 border-slate-800 cartoon-shadow-sm transition-transform active:scale-95"
            title={isMuted ? "开启声音" : "关闭声音"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-600" /> : <Volume2 className="w-5 h-5 text-brand-purple" />}
          </button>
        </div>

        {/* Dynamic Scene Content Container */}
        <div className="flex-grow flex flex-col justify-center items-center py-4 relative">
          
          {/* ========================================== */}
          {/* SCENE 1: SPLIT MAGIC (分裂乘以10和乘以1)   */}
          {/* ========================================== */}
          {sceneId === 'split-magic' && (
            <div className="w-full flex flex-col items-center justify-around gap-2" id="scene-split-magic">
              
              {/* Wizard Twins Area */}
              <div className="flex justify-between w-full max-w-lg px-4 mb-4">
                {/* Twin 10 */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: splitStep >= 1 ? 1 : 0.4, scale: splitStep === 1 ? 1.1 : 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <span className="absolute -top-6 -left-1 text-2xl rotate-12">🎩</span>
                    <div className="w-12 h-12 bg-indigo-100 border-4 border-slate-800 rounded-full flex items-center justify-center font-display font-bold text-slate-800 text-lg shadow-sm">
                      10
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 mt-1">
                    {magicMode === 'multiply-9-magic' ? '乘10老大' : '魔法老大 (×10)'}
                  </span>
                </motion.div>

                {/* Spell symbol */}
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={splitStep === 1 ? { rotate: 360 } : {}}
                    transition={{ repeat: splitStep === 1 ? Infinity : 0, duration: 2, ease: "linear" }}
                    className="w-10 h-10 bg-brand-yellow border-4 border-slate-800 rounded-full flex items-center justify-center"
                  >
                    <Sparkles className="w-5 h-5 text-amber-700" />
                  </motion.div>
                </div>

                {/* Twin 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: splitStep >= 1 ? 1 : 0.4, scale: splitStep === 1 ? 1.1 : 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <span className="absolute -top-6 -right-1 text-2xl -rotate-12">🧙‍♂️</span>
                    <div className="w-12 h-12 bg-pink-100 border-4 border-slate-800 rounded-full flex items-center justify-center font-display font-bold text-slate-800 text-lg shadow-sm">
                      {magicMode === 'multiply-9-magic' ? '-1' : '1'}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 mt-1">
                    {magicMode === 'multiply-9-magic' ? '减法老二 (➖1)' : '魔术老二 (×1)'}
                  </span>
                </motion.div>
              </div>

              {/* Rails and Trains representation */}
              <div className="w-full space-y-4">
                {/* Track A: N * 10 */}
                <div className="relative w-full">
                  <div className="absolute inset-x-0 bottom-4">
                    <TrainTrack />
                  </div>
                  <div className="h-20 flex items-end justify-center">
                    <AnimatePresence>
                      {splitStep === 2 && (
                        <motion.div 
                          initial={{ opacity: 0, x: -100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-end select-none animate-fade-in"
                        >
                          <RenderCar digit="" index={0} isEngine={true} />
                          <Coupling />
                          {digits.map((digit, idx) => (
                            <React.Fragment key={`t10-${idx}`}>
                              <RenderCar digit={digit} index={idx} />
                              <Coupling />
                            </React.Fragment>
                          ))}
                          {/* Zero balloon car attached */}
                          <motion.div
                            initial={{ scale: 0, y: -50 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: 'spring', delay: 0.5 }}
                          >
                            <RenderCar digit={0} index={99} isSpecial={true} />
                          </motion.div>
                          <span className="ml-2 font-display text-xs text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            已变身 {inputNumber}0
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Track B: Original train / Splitting action */}
                <div className="relative w-full">
                  <div className="absolute inset-x-0 bottom-4">
                    <TrainTrack />
                  </div>
                  <div className="h-20 flex items-end justify-center">
                    <AnimatePresence>
                      {splitStep < 2 ? (
                        <motion.div 
                          layoutId="main-train"
                          className="flex items-end select-none"
                        >
                          <RenderCar digit="" index={0} isEngine={true} />
                          <Coupling />
                          {digits.map((digit, idx) => (
                            <React.Fragment key={`torg-${idx}`}>
                              <RenderCar digit={digit} index={idx} />
                              <Coupling />
                            </React.Fragment>
                          ))}
                          {/* Magical operator badge */}
                          <div className="ml-3 self-center bg-slate-800 text-brand-yellow font-display font-bold px-3 py-1 rounded-full border-2 border-slate-950 flex items-center gap-1 text-sm cartoon-shadow-sm animate-pulse">
                            × {magicMode === 'multiply-9-magic' ? '9' : '11'}
                          </div>
                        </motion.div>
                      ) : (
                        // After splitting, bottom is N * 1
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-end select-none"
                        >
                          <RenderCar digit="" index={0} isEngine={true} />
                          <Coupling />
                          {digits.map((digit, idx) => (
                            <React.Fragment key={`t1-${idx}`}>
                              <RenderCar digit={digit} index={idx} />
                              <Coupling />
                            </React.Fragment>
                          ))}
                          <span className="ml-2 font-display text-xs text-rose-800 font-bold bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                            {magicMode === 'multiply-9-magic' ? `减去自己 ${inputNumber}` : `还是自己 ${inputNumber}`}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Action Prompts for Kid */}
              <div className="mt-4 flex flex-col items-center">
                {splitStep === 0 && (
                  <button
                    id="trigger-split-step-1"
                    onClick={handleSplitMagic}
                    className="px-6 py-3 bg-brand-yellow hover:bg-amber-400 text-slate-900 font-display font-bold rounded-2xl cartoon-border cartoon-shadow transition-transform active:scale-95 flex items-center gap-2 animate-bounce"
                  >
                    <Sparkles className="w-5 h-5 text-amber-700" />
                    召唤魔法兄弟！
                  </button>
                )}
                {splitStep === 1 && (
                  <button
                    id="trigger-split-step-2"
                    onClick={handleSplitMagic}
                    className="px-6 py-3 bg-brand-pink hover:bg-rose-500 text-white font-display font-bold rounded-2xl cartoon-border cartoon-shadow transition-transform active:scale-95 flex items-center gap-2 animate-bounce"
                  >
                    🪄 释放分裂魔法 ({magicMode === 'multiply-9-magic' ? '×10 减去 ×1' : '×10 和 ×1'})
                  </button>
                )}
                {splitStep === 2 && (
                  <div className="text-center bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-3 text-emerald-800 font-bold max-w-md">
                    🎉 魔法完成！数字火车成功分裂成了两列！
                    <div className="text-xs text-emerald-600 mt-1">
                      {magicMode === 'multiply-9-magic' ? (
                        '老大火车在末尾挂上了“0”；我们要用它减去老二代表的自己火车哦！'
                      ) : (
                        '乘以10的火车末尾多了一个金灿灿的“0”车厢；乘以1的火车还是它自己。'
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* SCENE 2: ADDITION / SUBTRACTION SLIDE     */}
          {/* ========================================== */}
          {sceneId === 'addition-slide' && (
            <div className="w-full flex flex-col items-center justify-center animate-fade-in" id="scene-addition-slide">
              
              {/* Column Math Slate Chalkboard */}
              <div className="w-full max-w-lg bg-slate-800 rounded-2xl border-4 border-slate-950 p-4 font-mono text-white relative shadow-inner">
                {/* Title Badge */}
                <div className="absolute top-2 left-2 bg-slate-700 text-brand-yellow font-sans text-xs px-2 py-0.5 rounded border border-slate-600">
                  {magicMode === 'multiply-9-magic' ? '数字火车减法叠叠乐' : '数字火车叠叠乐加法'}
                </div>

                {/* Column lists */}
                <div className="flex flex-col items-end pr-8 pt-5 pb-2 space-y-4 text-xl sm:text-2xl select-none">
                  
                  {/* Top Row: N * 10 (e.g. 1 2 3 4 5 0) */}
                  <div className="flex items-center gap-1.5 relative">
                    <span className="text-slate-400 text-[10px] font-sans mr-2">(×10 火车)</span>
                    {activeMultiplier10.map((digit, idx) => {
                      const reversedIdxFromRight = activeColSums.length - 1 - idx;
                      const isHighlighted = additionStep >= 0 && additionStep === reversedIdxFromRight;

                      // For multiply-11-carry: check if there is a carry in entering this column
                      const hasCarryIn = magicMode === 'multiply-11-carry' && activeCarriesIn[idx] > 0;
                      // For multiply-9-magic: check if there is a borrow in entering this column
                      const hasBorrowIn = magicMode === 'multiply-9-magic' && activeBorrowsIn[idx] > 0;

                      return (
                        <div key={`col10-${idx}`} className="relative">
                          {/* Carry Sprite indicator above the column */}
                          {hasCarryIn && additionStep >= reversedIdxFromRight && (
                            <motion.div 
                              initial={{ scale: 0, y: 15 }}
                              animate={{ scale: 1, y: 0 }}
                              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 border border-slate-950 font-display font-black text-[9px] px-1 rounded-full flex items-center gap-0.5 z-10"
                            >
                              🧚‍♂️<span className="text-[8px]">+1</span>
                            </motion.div>
                          )}

                          {/* Borrow Sprite indicator above the column */}
                          {hasBorrowIn && additionStep >= reversedIdxFromRight && (
                            <motion.div 
                              initial={{ scale: 0, y: 15 }}
                              animate={{ scale: 1, y: 0 }}
                              className="absolute -top-6 left-1/2 -translate-x-1/2 bg-rose-500 text-white border border-slate-950 font-display font-black text-[9px] px-1 rounded-full flex items-center gap-0.5 z-10"
                            >
                              🎈<span className="text-[8px]">-1</span>
                            </motion.div>
                          )}

                          <motion.div 
                            animate={isHighlighted ? { scale: 1.25, y: [0, -4, 0] } : {}}
                            transition={{ repeat: isHighlighted ? Infinity : 0, duration: 1 }}
                            className={`w-8 h-8 rounded flex items-center justify-center font-bold text-base sm:text-lg border-2 ${
                              isHighlighted ? 'bg-brand-yellow text-slate-900 border-amber-600 font-black' : 'bg-slate-700 border-slate-600 text-slate-100'
                            }`}
                          >
                            {digit}
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Row: N (shifted right) */}
                  <div className="flex items-center gap-1.5 relative">
                    <span className="absolute -left-8 font-black text-brand-pink text-3xl">
                      {magicMode === 'multiply-9-magic' ? '−' : '+'}
                    </span>
                    <span className="text-slate-400 text-[10px] font-sans mr-2">
                      {magicMode === 'multiply-9-magic' ? '(自己火车)' : '(×1 火车)'}
                    </span>
                    {activeMultiplier1.map((digit, idx) => {
                      const reversedIdxFromRight = activeColSums.length - 1 - idx;
                      const isHighlighted = additionStep >= 0 && additionStep === reversedIdxFromRight;
                      return (
                        <motion.div 
                          key={`col1-${idx}`}
                          animate={isHighlighted ? { scale: 1.25, y: [0, -4, 0] } : {}}
                          transition={{ repeat: isHighlighted ? Infinity : 0, duration: 1 }}
                          className={`w-8 h-8 rounded flex items-center justify-center font-bold text-base sm:text-lg border-2 ${
                            isHighlighted ? 'bg-brand-pink text-white border-rose-600 font-black' : 'bg-slate-700 border-slate-600 text-slate-100'
                          }`}
                        >
                          {digit}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Addition/Subtraction Line Separator */}
                  <div className="w-full h-1 bg-slate-400 rounded-full"></div>

                  {/* Combined Math Row Result */}
                  <div className="flex items-center gap-1.5 min-h-[36px]">
                    <span className="text-slate-400 text-[10px] font-sans mr-2">
                      {magicMode === 'multiply-9-magic' ? '(减法答案)' : '(加法答案)'}
                    </span>
                    {activeColSums.map((val, idx) => {
                      const reversedIdxFromLeft = idx;
                      const stepThreshold = activeColSums.length - 1 - reversedIdxFromLeft;
                      
                      const hasResultValue = additionStep >= stepThreshold;
                      const isNewlyAdded = additionStep === stepThreshold;

                      return (
                        <motion.div 
                          key={`colsum-${idx}`}
                          initial={{ scale: 0 }}
                          animate={hasResultValue ? { scale: 1, y: 0 } : { scale: 1 }}
                          className={`w-8 h-8 rounded flex items-center justify-center font-bold text-base sm:text-lg border-2 ${
                            hasResultValue 
                              ? isNewlyAdded 
                                ? 'bg-brand-green text-white border-emerald-600 animate-bounce' 
                                : 'bg-slate-600 border-slate-500 text-brand-yellow' 
                              : 'bg-transparent border-dashed border-slate-600 text-slate-500'
                          }`}
                        >
                          {hasResultValue ? val : '?'}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step indicator and button controls */}
              <div className="mt-4 flex flex-col items-center">
                {additionStep < activeColSums.length ? (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      id="addition-next-step-btn"
                      onClick={handleAdditionStep}
                      className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white font-display font-bold rounded-2xl cartoon-border cartoon-shadow transition-transform active:scale-95 flex items-center gap-1"
                    >
                      <span>
                        {additionStep === -1 
                          ? (magicMode === 'multiply-9-magic' ? '🚂 开始叠叠乐相减' : '🚂 开始叠叠乐相加') 
                          : '👉 算下一位数位'}
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {additionStep >= 0 && (
                      <p className="text-xs font-bold text-slate-600 mt-1">
                        正在计算：
                        {(() => {
                          const colIdx = activeColSums.length - 1 - additionStep;
                          const m10Val = activeMultiplier10[colIdx] || 0;
                          const m1Val = activeMultiplier1[colIdx] || 0;

                          if (magicMode === 'multiply-9-magic') {
                            const borrowIn = activeBorrowsIn[colIdx] || 0;
                            const explanation = borrowIn > 0 
                              ? `原本是 ${m10Val}，借走1后变 ${m10Val - 1}。所以是 ${m10Val - 1} ➖ ${m1Val}`
                              : `${m10Val} ➖ ${m1Val}`;

                            if (m10Val - borrowIn < m1Val) {
                              return `${explanation} 不够减啦！向左边车厢借 1 当 10，算出来是: 10 ➕ ${m10Val - borrowIn} ➖ ${m1Val} = ${activeColSums[colIdx]}`;
                            }
                            return `${explanation} = ${activeColSums[colIdx]}`;
                          } else {
                            const carryIn = activeCarriesIn[colIdx] || 0;
                            const carryText = carryIn > 0 ? ` ➕ (进位的1)` : '';
                            const totalSumText = `${m10Val} ➕ ${m1Val}${carryText}`;
                            
                            if (m10Val + m1Val + carryIn >= 10) {
                              return `${totalSumText} = ${m10Val + m1Val + carryIn}。满十了，写 ${(m10Val + m1Val + carryIn) % 10} 并往左边进 1！`;
                            }
                            return `${totalSumText} = ${activeColSums[colIdx]}`;
                          }
                        })()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-3 text-emerald-800 font-bold max-w-md animate-fade-in">
                    🎉 太棒了！全部对齐算好啦！
                    <div className="text-sm text-emerald-700 mt-1 font-display">
                      结果是：{activeColSums.join('')}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* SCENE 3: SHORTCUT DERIVATION (魔法口诀)    */}
          {/* ========================================== */}
          {sceneId === 'shortcut-derivation' && (
            <div className="w-full flex flex-col items-center animate-fade-in" id="scene-shortcut-derivation">
              
              {/* Multiply-9 Mnemonic Render Block */}
              {magicMode === 'multiply-9-magic' ? (
                <div className="w-full flex flex-col items-center">
                  
                  {/* Shortcut Visual Showcase */}
                  <div className="flex flex-col items-center gap-4 my-2 w-full">
                    
                    {/* Stage A: Original Train */}
                    {shortcutStep >= 0 && (
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-slate-500 mb-0.5">原本的小火车</span>
                        <div className="flex items-end scale-90 justify-center">
                          <RenderCar digit="" index={0} isEngine={true} />
                          <Coupling />
                          {digits.map((digit, idx) => (
                            <React.Fragment key={`orig-9-${idx}`}>
                              <RenderCar digit={digit} index={idx} />
                              <Coupling />
                            </React.Fragment>
                          ))}
                          <div className="ml-2 bg-slate-800 text-white px-2 py-0.5 rounded-md font-bold text-xs self-center">
                            N = {inputNumber}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stage B: Append 0 train */}
                    {shortcutStep >= 1 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-[10px] font-black text-brand-purple mb-0.5">第一步：末尾挂上“0”车厢（扩大10倍）</span>
                        <div className="flex items-end scale-95 justify-center">
                          <RenderCar digit="" index={0} isEngine={true} />
                          <Coupling />
                          {digits.map((digit, idx) => (
                            <React.Fragment key={`orig-9-s1-${idx}`}>
                              <RenderCar digit={digit} index={idx} />
                              <Coupling />
                            </React.Fragment>
                          ))}
                          {/* Attached golden zero */}
                          <RenderCar digit={0} index={99} isSpecial={true} />
                          <div className="ml-2 bg-indigo-600 text-white px-2 py-0.5 rounded-md font-bold text-xs self-center animate-pulse">
                            10倍 = {inputNumber}0
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Stage C: Math Subtract Formula display */}
                    {shortcutStep >= 2 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-sm bg-violet-50/50 border-3 border-brand-purple/20 rounded-2xl p-3 relative flex flex-col items-center font-mono font-bold"
                      >
                        <span className="text-[10px] text-brand-purple font-display font-black mb-1">第二步：减去原来的自己</span>
                        <div className="text-slate-800 text-base space-y-1 w-full text-right pr-12">
                          <div>{inputNumber}0 <span className="text-xs text-slate-400 font-sans">(10倍列车)</span></div>
                          <div className="border-b-2 border-slate-800 pb-0.5">
                            <span className="text-brand-pink mr-1 font-sans text-lg">➖</span>
                            {inputNumber} <span className="text-xs text-slate-400 font-sans">(自己本身)</span>
                          </div>
                          <div className="text-brand-green font-display font-black text-lg pt-1">
                            {shortcutStep >= 3 ? inputNumber * 9 : '? ? ?'}
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </div>

                  {/* Explanation Bubble */}
                  <div className="w-full max-w-xl bg-sky-50 border-4 border-brand-sky rounded-3xl p-4 my-2 relative text-center">
                    <AnimatePresence mode="wait">
                      {shortcutStep === 0 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-slate-700">
                          🚂 乘 9 变身第一步：点下面的按钮，帮火车套上扩10倍的“魔法外衣”吧！
                        </motion.p>
                      )}
                      {shortcutStep === 1 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-indigo-800">
                          🌟 成功挂0！现在火车变成了 {inputNumber}0。下一步，我们要像小兔子拔萝卜一样，减去自己本身！
                        </motion.p>
                      )}
                      {shortcutStep === 2 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-pink-800">
                          🎉 让我们按下红魔法键，扣除原来的自己，看看最终算出的乘9成果吧！
                        </motion.p>
                      )}
                      {shortcutStep === 3 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-emerald-800">
                          💖 口诀妙算大功告成！{inputNumber} × 9 的最终答案就是：
                          <span className="text-lg text-brand-coral underline ml-1 font-display font-black">{inputNumber * 9}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              ) : (
                /* Multiply-11 Mnemonic Render Block */
                <div className="w-full flex flex-col items-center">
                  
                  {/* Original Train Row */}
                  <div className="w-full flex flex-col items-center my-1.5">
                    <span className="text-xs font-bold text-slate-500 mb-1">原来的数字火车</span>
                    <div className="flex items-end justify-center select-none scale-90 sm:scale-100">
                      <RenderCar digit="" index={0} isEngine={true} />
                      <Coupling />
                      {digits.map((digit, idx) => {
                        const isLeftEnd = idx === 0;
                        const isRightEnd = idx === digits.length - 1;
                        const isHugging = huggedIndex !== -1 && (idx === huggedIndex || idx === huggedIndex + 1);

                        return (
                          <React.Fragment key={`orig-${idx}`}>
                            <motion.div
                              animate={
                                isHugging 
                                  ? { scale: 1.15, y: -6, borderColor: '#9047FF' } 
                                  : isLeftEnd && shortcutStep >= 1 
                                    ? { x: -16, scale: 1.05 } 
                                    : isRightEnd && shortcutStep >= 1 
                                      ? { x: 16, scale: 1.05 } 
                                      : {}
                              }
                              className="relative"
                            >
                              <RenderCar digit={digit} index={idx} />
                              {/* Top arch pairing indicators */}
                              {idx === huggedIndex && (
                                <div className="absolute -top-12 left-6 w-14 h-10 border-t-4 border-x-4 border-dashed border-brand-purple rounded-t-2xl flex items-center justify-center z-10 pointer-events-none">
                                  <span className="bg-brand-purple text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 -mt-12 animate-pulse">
                                    {digits[idx]} + {digits[idx+1]}
                                  </span>
                                </div>
                              )}
                            </motion.div>
                            <Coupling />
                          </React.Fragment>
                        );
                      })}
                      {/* Operator card */}
                      <div className="bg-slate-800 text-brand-yellow font-display font-bold px-2.5 py-1 rounded-full border-2 border-slate-950 text-xs shadow-sm ml-2 shrink-0">
                        × 11
                      </div>
                    </div>
                  </div>

                  {/* Magic Mnemonic visual derivation output */}
                  <div className="w-full max-w-xl bg-violet-50/50 border-4 border-brand-purple/30 rounded-3xl p-4 my-3 relative">
                    
                    <div className="text-center font-display font-bold text-brand-purple text-xs sm:text-sm mb-3">
                      🌟 口诀魔法阵：两头一拉，中间相加 {magicMode === 'multiply-11-carry' && '，满十进一'} 🌟
                    </div>

                    <div className="flex items-center justify-center gap-2 h-20 text-lg sm:text-xl font-bold font-display select-none">
                      {/* Left End */}
                      <motion.div 
                        animate={shortcutStep >= 1 ? { scale: [1, 1.2, 1], rotate: [0, -5, 0] } : {}}
                        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border-3 border-slate-800 cartoon-shadow-sm ${
                          shortcutStep >= 1 ? getColorClass(0) : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {shortcutStep >= 1 ? (
                          <>
                            <span>{activeColSums[0]}</span>
                            {magicMode === 'multiply-11-carry' && activeColSums[0] !== digits[0] && (
                              <span className="text-[7px] text-yellow-300 bg-slate-900 px-0.5 rounded leading-none">({digits[0]}+1)</span>
                            )}
                          </>
                        ) : '_'}
                      </motion.div>

                      {/* Middle Sums */}
                      {intermediateSums.map((sum, idx) => {
                        const isRevealed = shortcutStep === 3 || (shortcutStep === 2 && idx < huggedIndex) || (shortcutStep === 2 && idx === huggedIndex);
                        const isCurrentlyRevealing = shortcutStep === 2 && idx === huggedIndex;

                        return (
                          <React.Fragment key={`inter-${idx}`}>
                            <div className="text-slate-400 text-xs self-center">,</div>
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={isRevealed ? { scale: 1, y: 0 } : { scale: 0.8 }}
                              className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border-3 border-slate-800 cartoon-shadow-sm transition-colors ${
                                isRevealed 
                                  ? isCurrentlyRevealing 
                                    ? 'bg-brand-yellow text-slate-900 border-amber-600 animate-bounce' 
                                    : 'bg-white text-slate-800' 
                                  : 'bg-slate-100/30 text-transparent border-dashed border-slate-300'
                              }`}
                            >
                              {isRevealed ? (
                                <>
                                  <span className="text-xs sm:text-sm font-bold">
                                    {magicMode === 'multiply-11-carry' ? sum % 10 : sum}
                                  </span>
                                  <span className="text-[8px] text-slate-500 leading-none">
                                    ({digits[idx]}+{digits[idx+1]})
                                  </span>
                                </>
                              ) : '?'}
                            </motion.div>
                          </React.Fragment>
                        );
                      })}

                      {/* Right End */}
                      <div className="text-slate-400 text-xs self-center">,</div>
                      <motion.div 
                        animate={shortcutStep >= 1 ? { scale: [1, 1.2, 1], rotate: [0, 5, 0] } : {}}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border-3 border-slate-800 cartoon-shadow-sm ${
                          shortcutStep >= 1 ? getColorClass(digits.length - 1) : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {shortcutStep >= 1 ? digits[digits.length - 1] : '_'}
                      </motion.div>
                    </div>

                    {/* Annotation captions */}
                    <div className="text-center mt-2 min-h-[32px]">
                      <AnimatePresence mode="wait">
                        {shortcutStep === 1 && (
                          <motion.p 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs font-bold text-amber-700"
                          >
                            👈👉 两头一拉：把首位的 {digits[0]} 和末位的 {digits[digits.length - 1]} 放到两端！
                          </motion.p>
                        )}
                        {shortcutStep === 2 && (
                          <motion.p 
                            key={`explain-hug-${huggedIndex}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs font-bold text-brand-purple"
                          >
                            🤗 中间相加：把 {digits[huggedIndex]} 和 {digits[huggedIndex + 1]} 加起来，得到 {digits[huggedIndex] + digits[huggedIndex + 1]}！
                            {magicMode === 'multiply-11-carry' && (digits[huggedIndex] + digits[huggedIndex + 1]) >= 10 && (
                              <span className="block text-[10px] text-pink-600">
                                🧚‍♂️ 超过 10 啦！个位数留在原位，十位 1 作为“进位小精灵”加到左边哦！
                              </span>
                            )}
                          </motion.p>
                        )}
                        {shortcutStep === 3 && (
                          <motion.p 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs font-bold text-emerald-700"
                          >
                            🎉 哇！口诀大功告成！合并在一起后，最终数字答案是：
                            <span className="text-sm sm:text-base text-brand-pink underline ml-1 font-display font-black">
                              {activeColSums.join('')}
                            </span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </div>
              )}

              {/* Control Trigger Button */}
              <div className="flex flex-col items-center">
                <button
                  id="shortcut-next-step-btn"
                  onClick={handleShortcutStep}
                  className="px-6 py-2.5 bg-brand-purple hover:bg-brand-purple/90 text-white font-display font-bold rounded-2xl cartoon-border cartoon-shadow transition-transform active:scale-95 flex items-center gap-2 animate-bounce"
                >
                  <Sparkles className="w-5 h-5 text-brand-yellow" />
                  <span>
                    {magicMode === 'multiply-9-magic' ? (
                      <>
                        {shortcutStep === 0 && '🪄 第一步：末尾挂 0'}
                        {shortcutStep === 1 && '➖ 第二步：减去原来的自己'}
                        {shortcutStep === 2 && '🚂 拼合数字！'}
                        {shortcutStep === 3 && '🔁 重新体验口诀'}
                      </>
                    ) : (
                      <>
                        {shortcutStep === 0 && '🪄 第一步：两头一拉'}
                        {shortcutStep === 1 && '🤗 第二步：中间相加'}
                        {shortcutStep === 2 && (huggedIndex < digits.length - 2 ? '👉 继续相加下一个' : '🚂 拼合数字！')}
                        {shortcutStep === 3 && '🔁 重新体验口诀'}
                      </>
                    )}
                  </span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Interactive Board Tracks background */}
        <div className="w-full border-t border-slate-200 pt-2 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-bold gap-2">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping"></span>
            <span>当前挑战数字：</span>
            <span className="font-display text-slate-800 text-sm">
              {inputNumber} × {magicMode === 'multiply-9-magic' ? '9' : '11'}
            </span>
          </div>
          <div className="text-right">
            {magicMode === 'multiply-9-magic' ? (
              '乘9口诀：挂上金色0尾巴，减去原来的自己！'
            ) : magicMode === 'multiply-11-carry' ? (
              '乘11口诀进阶版：两头一拉，中间相加，满十进一！'
            ) : (
              '乘11口诀基础版：两头一拉，中间相加！'
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
