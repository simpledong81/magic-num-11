import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, HelpCircle, ArrowRight, CornerDownRight, ThumbsUp, Send } from 'lucide-react';
import { audioEngine } from './AudioEngine';
import { MagicMode } from '../types';

interface InteractiveChallengeProps {
  currentNumber: number;
  onSetNumber: (num: number) => void;
  magicMode: MagicMode;
  onGoToScene: (scene: 'split-magic' | 'addition-slide' | 'shortcut-derivation') => void;
}

export const InteractiveChallenge: React.FC<InteractiveChallengeProps> = ({ 
  currentNumber, 
  onSetNumber, 
  magicMode,
  onGoToScene 
}) => {
  const [customInput, setCustomInput] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [showResult, setShowResult] = useState<boolean | null>(null); // true: correct, false: incorrect, null: not checked
  const [attempts, setAttempts] = useState(0);

  // Clear guess and result when currentNumber or magicMode changes
  useEffect(() => {
    setUserGuess('');
    setShowResult(null);
    setAttempts(0);
  }, [currentNumber, magicMode]);

  // Determine multiplier based on selected mode
  const multiplierFactor = magicMode === 'multiply-9-magic' ? 9 : 11;
  const correctAnswer = currentNumber * multiplierFactor;

  // Determine Presets dynamically based on the active MagicMode
  const presetsForMode = magicMode === 'multiply-11-carry' ? [
    { number: 78, label: '⚡ 闪电精灵 78' },
    { number: 59, label: '🍉 西瓜精灵 59' },
    { number: 486, label: '⭐ 星空精灵 486' },
    { number: 999, label: '🔥 终极烈火 999' },
  ] : magicMode === 'multiply-9-magic' ? [
    { number: 15, label: '🍍 菠萝精灵 15' },
    { number: 34, label: '🍇 葡萄精灵 34' },
    { number: 125, label: '🚀 火箭飞飞 125' },
    { number: 2043, label: '👑 黄金皇冠 2043' },
  ] : [
    { number: 12, label: '🚂 初级火车 12' },
    { number: 35, label: '🍊 甜橙火车 35' },
    { number: 143, label: '🌟 闪耀新星 143' },
    { number: 2351, label: '🎈 飞天气球 2351' },
  ];

  // Analyze digits of the selected number for hints
  const numString = String(currentNumber);
  const digits = numString.split('').map(Number);
  const firstDigit = digits[0];
  const lastDigit = digits[digits.length - 1];
  const middleAdditions = digits.slice(0, -1).map((val, idx) => `${val} + ${digits[idx+1]} = ${val + digits[idx+1]}`);

  // Handle Preset click
  const handleSelectPreset = (num: number) => {
    onSetNumber(num);
    audioEngine.playPop();
  };

  // Handle Custom number submission
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = parseInt(customInput.replace(/\D/g, ''), 10);
    if (!isNaN(cleanNum) && cleanNum >= 10 && cleanNum <= 99999) {
      onSetNumber(cleanNum);
      setCustomInput('');
      audioEngine.playTrainWhistle();
    } else {
      audioEngine.playSlide();
      // Use friendly alert or state warning
      alert('请输入 10 到 99999 之间的整数哦！');
    }
  };

  // Check user answer guess
  const handleCheckAnswer = () => {
    const cleanGuess = parseInt(userGuess.replace(/\D/g, ''), 10);
    if (isNaN(cleanGuess)) {
      audioEngine.playSlide();
      return;
    }

    if (cleanGuess === correctAnswer) {
      audioEngine.playChime();
      setShowResult(true);
    } else {
      audioEngine.playPop();
      setShowResult(false);
      setAttempts(prev => prev + 1);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in" id="interactive-challenge-root">
      
      {/* 2-Column layout: Configuration / Try yourself */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Number Changer & Presets (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-white border-4 border-[#FAB1A0] rounded-[32px] p-5 pb-6 sm:p-6 sm:pb-8 shadow-lg">
            <h3 className="font-display font-black text-brand-charcoal mb-2 flex items-center gap-1.5 text-sm sm:text-base">
              <span>🎯 选一列数字火车</span>
            </h3>
            <p className="text-xs text-brand-gray font-bold mb-4 leading-relaxed">
              点击可直接切换当前的挑战火车，或输入任何 2~5 位数字：
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {presetsForMode.map((preset) => {
                const isSelected = currentNumber === preset.number;
                return (
                  <button
                    key={preset.number}
                    id={`preset-btn-${preset.number}`}
                    onClick={() => handleSelectPreset(preset.number)}
                    className={`p-2.5 rounded-2xl text-xs font-bold border-2 text-left transition-all flex flex-col gap-0.5 ${
                      isSelected 
                        ? 'bg-brand-coral border-[#2D3436] text-white cartoon-shadow-sm scale-[1.02]' 
                        : 'bg-[#FFF9E6]/40 border-slate-200 text-brand-charcoal hover:bg-[#FFF9E6]'
                    }`}
                  >
                    <span className="font-display">{preset.label}</span>
                    <span className="text-[10px] opacity-90 font-mono">
                      {preset.number} × {multiplierFactor}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Input Form */}
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
              <input
                id="custom-number-input"
                type="text"
                maxLength={5}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value.replace(/\D/g, ''))}
                placeholder="例如 123"
                className="flex-grow px-3 py-2 border-2 border-brand-charcoal rounded-xl font-display font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-coral bg-[#FFF9E6]/30"
              />
              <button
                id="custom-number-submit-btn"
                type="submit"
                className="px-4 py-2 bg-brand-pink hover:bg-rose-600 text-white font-display font-bold text-xs rounded-xl border-2 border-brand-charcoal cartoon-shadow-sm transition-all active:scale-95 flex items-center gap-1 shrink-0 whitespace-nowrap"
              >
                <span>变出来!</span>
              </button>
            </form>
          </div>

          {/* Drive train Back to Story block */}
          <div className="bg-brand-charcoal border-4 border-slate-900 rounded-[32px] p-5 text-white shadow-xl">
            <h4 className="font-display font-black text-brand-gold mb-1.5 text-sm flex items-center gap-1">
              <span>🚀 带着这列火车回故事里</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-bold mb-4">
              选好上面的数字后，可以点击下方按钮，重新在故事动画中演示该数字的奇妙变换！
            </p>

            <div className="flex flex-col gap-2">
              <button
                id="play-scene-1-with-custom-btn"
                onClick={() => onGoToScene('split-magic')}
                className="w-full py-2 bg-brand-gold hover:bg-amber-400 text-slate-900 font-display font-black text-xs rounded-xl border-2 border-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
              >
                🎥 1. 看分裂魔法 ({magicMode === 'multiply-9-magic' ? '×10 减 ×1' : '×10 和 ×1'})
              </button>
              <button
                id="play-scene-2-with-custom-btn"
                onClick={() => onGoToScene('addition-slide')}
                className="w-full py-2 bg-brand-sky hover:bg-blue-500 text-white font-display font-black text-xs rounded-xl border-2 border-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
              >
                🚂 2. 看叠叠乐{magicMode === 'multiply-9-magic' ? '减法' : '加法'} (竖式)
              </button>
              <button
                id="play-scene-3-with-custom-btn"
                onClick={() => onGoToScene('shortcut-derivation')}
                className="w-full py-2 bg-brand-purple hover:bg-purple-600 text-white font-display font-black text-xs rounded-xl border-2 border-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-98"
              >
                🪄 3. 看口诀的妙用 ({magicMode === 'multiply-9-magic' ? '减法' : '加法'}口诀)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Challenge Area (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white border-8 border-brand-peach rounded-[40px] p-6 shadow-2xl flex-grow flex flex-col justify-between min-h-[380px]">
            
            {/* Question Display */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-brand-orange text-white text-[10px] font-display font-black px-3 py-1 rounded-full border-2 border-[#2D3436] shadow-sm">
                  挑战进行中 📝
                </span>
                <span className="text-[10px] text-brand-gray font-bold font-mono">
                  {magicMode === 'multiply-9-magic' ? '乘9简算小测试' : '乘11口诀小测试'}
                </span>
              </div>

              <div className="text-center my-4">
                <h4 className="text-xl sm:text-2xl font-black text-[#2D3436] tracking-wide font-display">
                  请问： <span className="text-brand-pink underline font-extrabold">{currentNumber}</span> × {multiplierFactor} = ？
                </h4>
              </div>

              {/* Magical Wizard Tips */}
              <div className="bg-[#FFF9E6] border-2 border-dashed border-brand-peach rounded-2xl p-4 my-2 text-xs text-slate-700 space-y-2">
                <p className="font-display font-bold text-brand-purple flex items-center gap-1">
                  <span>🧙‍♂️ 魔法师给你的提示口诀：</span>
                </p>

                {magicMode === 'multiply-9-magic' ? (
                  <div className="pl-4 space-y-2 font-bold text-brand-charcoal">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                      <span className="text-[#FAB1A0] text-sm">❶</span>
                      <span><strong>末尾挂 0：</strong> 把火车放大10倍，变成：</span>
                      <span className="bg-[#FAB1A0]/20 text-[#D63031] px-1.5 py-0.5 rounded font-mono font-black">{currentNumber}0</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] sm:text-xs">
                      <span className="text-brand-pink text-sm">❷</span>
                      <div>
                        <span><strong>减去自己：</strong> 用得到的十倍数，减去原来的火车：</span>
                        <div className="mt-1 font-mono text-brand-pink font-black text-xs">
                          {currentNumber}0 ➖ {currentNumber} = ？
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pl-4 space-y-2 font-bold text-brand-charcoal">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                      <span className="text-[#FAB1A0] text-sm">❶</span>
                      <span><strong>两头一拉：</strong> 首尾放两边： </span>
                      <span className="bg-[#FAB1A0]/20 text-[#D63031] px-1.5 py-0.5 rounded font-mono font-black">{firstDigit}</span>
                      <span>和</span>
                      <span className="bg-[#FAB1A0]/20 text-[#D63031] px-1.5 py-0.5 rounded font-mono font-black">{lastDigit}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] sm:text-xs">
                      <span className="text-brand-pink text-sm">❷</span>
                      <div className="flex-grow">
                        <span><strong>中间相加：</strong> 把相邻的两位手拉手加起来：</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {middleAdditions.map((addition, i) => (
                            <span key={i} className="bg-white border border-brand-peach text-brand-pink px-2 py-0.5 rounded-full font-mono text-[11px] shadow-xs">
                              {addition}
                            </span>
                          ))}
                        </div>
                        {magicMode === 'multiply-11-carry' && (
                          <p className="text-[10px] text-indigo-700 font-extrabold mt-2 border-t border-indigo-100 pt-1">
                            🧚‍♂️ 注意进位：上面算出来的数字有超过 10 的哦！记得把进位的 1 加给左边的相邻乘客车厢哦！
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Answer submission interface */}
            <div className="mt-4">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    id="user-guess-input"
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value.replace(/\D/g, ''))}
                    placeholder="在这里写下你的算术答案..."
                    className="flex-grow px-4 py-3 border-3 border-brand-charcoal rounded-2xl font-display font-black text-sm sm:text-base focus:outline-none focus:ring-3 focus:ring-brand-purple bg-[#FFF9E6]/20 text-center"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheckAnswer();
                    }}
                  />
                  <button
                    id="verify-guess-btn"
                    onClick={handleCheckAnswer}
                    className="px-6 py-3 bg-brand-purple hover:bg-purple-700 text-white font-display font-black rounded-2xl border-3 border-brand-charcoal cartoon-shadow-sm transition-all active:scale-95 flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>验证</span>
                  </button>
                </div>

                {/* Validation feedbacks */}
                <div className="min-h-[50px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {showResult === true && (
                      <motion.div
                        key="correct-feedback"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-emerald-50 border-3 border-brand-mint rounded-2xl p-4 text-slate-700 font-bold text-center text-xs flex items-center gap-3 shadow-md"
                      >
                        <Trophy className="w-8 h-8 text-brand-gold flex-shrink-0 animate-bounce" />
                        <div className="text-left">
                          <span className="block text-brand-charcoal font-black text-sm mb-0.5">
                            答对啦！🎉 {currentNumber} × {multiplierFactor} = <strong className="text-brand-pink font-display underline">{correctAnswer}</strong>！你太棒了！
                          </span>
                          <span className="block text-[10px] text-brand-gray font-bold">
                            {magicMode === 'multiply-9-magic' ? (
                              `口诀思路：${currentNumber}0 ➖ ${currentNumber} 刚好等于 ${correctAnswer}！`
                            ) : (
                              `首位是 ${firstDigit}，末尾是 ${lastDigit}，经过口诀合并得到了完美的答案！`
                            )}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {showResult === false && (
                      <motion.div
                        key="incorrect-feedback"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-rose-50 border-3 border-brand-peach rounded-2xl p-3 text-rose-800 font-bold text-center text-xs flex flex-col items-center justify-center gap-0.5 shadow-md animate-shake"
                      >
                        <span className="font-bold flex items-center gap-1 text-rose-700">
                          <span>🧙‍♂️ 哎呀，数字小火车说答案好像不完全对哦！再算一算：</span>
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1">
                          {magicMode === 'multiply-9-magic' ? (
                            `试试：${currentNumber}0 ➖ ${currentNumber} 等于多少呢？`
                          ) : (
                            `试试：两头拉开是 ${firstDigit} 和 ${lastDigit}。中间加一加${magicMode === 'multiply-11-carry' ? '并处理满10进位' : ''}。`
                          )}
                        </span>
                      </motion.div>
                    )}

                    {showResult === null && (
                      <motion.p
                        key="normal-prompt"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-brand-gray font-bold text-center"
                      >
                        用魔法口诀算一算，然后写下答案验证一下吧！
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
