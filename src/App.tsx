/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Smile, 
  BookOpen, 
  Award,
  Flame,
  ArrowRight
} from 'lucide-react';
import { audioEngine } from './components/AudioEngine';
import { MagicTrain } from './components/MagicTrain';
import { InteractiveChallenge } from './components/InteractiveChallenge';
import { SceneId, SceneDefinition } from './types';

const SCENES: SceneDefinition[] = [
  {
    id: 'intro',
    title: '📖 故事开始：奇妙的数字王国',
    subtitle: '认识我们的数学小车和魔术师兄弟',
    description: '今天，数字火车12345要穿过一个写着乘11的神奇传送门，快来帮他发现变大的秘密吧！'
  },
  {
    id: 'split-magic',
    title: '🪄 第一幕：神奇的“分裂”魔法',
    subtitle: '乘以 11 究竟是什么意思呢？',
    description: '乘号精灵把火车复制成了两列！一列去找乘10的老大，一列去找乘1的老二，最后把他们加起来！'
  },
  {
    id: 'addition-slide',
    title: '🚂 第二幕：数字小火车叠叠乐',
    subtitle: '直观呈现竖式计算过程',
    description: '把两排火车像玩滑滑梯一样重叠对齐，从右往左手拉手加起来！'
  },
  {
    id: 'shortcut-derivation',
    title: '🌟 第三幕：发现魔法简便口诀',
    subtitle: '「两头一拉，中间相加」的奥秘',
    description: '其实不用列竖式，首尾两个数拉开，中间相邻的数相加，就能直接写出答案！'
  },
  {
    id: 'challenge-playground',
    title: '🎯 第四幕：魔法森林大挑战',
    subtitle: '用学到的口诀变出你自己的火车吧！',
    description: '你可以输入任意 2~5 位的数字，看看你能不能用最快的速度写出它乘以11的正确答案！'
  }
];

export default function App() {
  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [currentNumber, setCurrentNumber] = useState<number>(12345);
  const [isMuted, setIsMuted] = useState(false);

  const activeScene = SCENES[activeSceneIdx];

  // Navigate scenes
  const goToNextScene = () => {
    if (activeSceneIdx < SCENES.length - 1) {
      audioEngine.playTrainWhistle();
      setActiveSceneIdx(prev => prev + 1);
    }
  };

  const goToPrevScene = () => {
    if (activeSceneIdx > 0) {
      audioEngine.playSlide();
      setActiveSceneIdx(prev => prev - 1);
    }
  };

  const jumpToScene = (idx: number) => {
    audioEngine.playPop();
    setActiveSceneIdx(idx);
  };

  const handleSetNumber = (num: number) => {
    setCurrentNumber(num);
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioEngine.setMute(nextMute);
  };

  // Dialogue bubble explanation based on current scene & number
  const getWizardTip = () => {
    const digits = String(currentNumber).split('').map(Number);
    const first = digits[0];
    const last = digits[digits.length - 1];

    switch (activeScene.id) {
      case 'intro':
        return {
          title: "数字魔法双胞胎 11 说道：",
          text: "嘿！小朋友！我是魔法兄弟中的老大，我戴着‘10’帽子；这是我弟弟，他戴着‘1’帽子。我们加起来就是 11！任意数乘以 11，其实就是‘先乘10加上乘1自己’哦。快点击下方黄色按钮，来看看我们的分裂魔法吧！"
        };
      case 'split-magic':
        return {
          title: "帽子老大和老二大喊：",
          text: `看好啦！数字火车 ${currentNumber} 被我们的魔法【分裂】成了两列！老大这边乘以10，火车车尾挂上了一个金光闪闪的“0”车厢，变成了 ${currentNumber}0；老二这边乘以1，火车还是原本的 ${currentNumber}。接下来要把两列火车相加！`
        };
      case 'addition-slide':
        return {
          title: "乘号精灵在一旁指引：",
          text: `我们把两列火车对齐：上面是 ${currentNumber}0，下面是 ${currentNumber}。瞧，末位是对齐的！从右边开始，最右边 0 + ${last} = ${last}，再往左边 ${last} + ${digits[digits.length - 2] || 0} = ... 像玩叠叠乐一样把每一列手拉手加起来！`
        };
      case 'shortcut-derivation':
        return {
          title: "魔法双胞胎公布终极口诀：",
          text: `其实有一个超级方便的口诀，叫「两头一拉，中间相加」！你看：把原来的数 ${currentNumber} 的首位 ${first} 和末位 ${last} 往两边一拉。中间的空位，就把原来相邻的数字两两相加放进去：${digits.slice(0, -1).map((d, i) => `${d}+${digits[i+1]}`).join('，')}。直接就得到答案啦！是不是超神奇？`
        };
      case 'challenge-playground':
        return {
          title: "数字火车拉响了汽笛：",
          text: `现在轮到你来当小魔法师啦！你可以在左侧选择不同的预设火车，或者输入你自己喜欢的任何数字，试着用我们的神奇口诀‘两头一拉，中间相加’在心里算出答案，然后输入在框里进行魔法检验吧！`
        };
      default:
        return { title: "", text: "" };
    }
  };

  const wizardTip = getWizardTip();

  return (
    <div className="min-h-screen bg-brand-cream bg-grid-pattern py-6 px-4 font-sans select-none" id="app-container">
      
      {/* Playful Top Header in Artistic Flair theme */}
      <header className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-coral rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 border-4 border-white shrink-0">
            <span className="text-white text-3xl font-black italic">11</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-charcoal mb-0.5 flex items-center gap-2">
              数字小火车 <span className="text-brand-coral">×11</span> 魔法之旅
            </h1>
            <p className="text-xs sm:text-sm font-medium text-brand-gray">跟二年级的伙伴们一起探索简便算法的秘密</p>
          </div>
        </div>

        {/* Global Action Tools with gold branding */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-white border-4 border-brand-gold rounded-full shadow-md text-xs sm:text-sm font-bold text-brand-charcoal flex items-center gap-1.5">
            <span>当前小火车数字:</span>
            <span className="font-display text-base text-brand-coral font-black underline">{currentNumber}</span>
          </div>

          <button 
            id="global-mute-btn"
            onClick={toggleMute}
            className="p-2.5 bg-white hover:bg-slate-50 rounded-full border-2 border-brand-charcoal shadow-md transition-transform active:scale-95 shrink-0"
            title={isMuted ? "开启声音" : "关闭声音"}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-brand-gray" /> : <Volume2 className="w-5 h-5 text-brand-purple" />}
          </button>
        </div>
      </header>

      {/* Main Container: Book Frame Layout */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Main Area: Interactive Story Stage (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Whimsical Railway Track Navigation Steps */}
          <nav className="bg-white border-4 border-slate-800 p-4 rounded-2xl cartoon-shadow" id="story-progress-rail">
            <div className="text-xs font-bold text-slate-500 mb-2.5 flex items-center gap-1 justify-between">
              <span>🛤️ 魔法铁路列车时刻表：</span>
              <span className="text-slate-400">点击车站即可穿梭时空</span>
            </div>
            
            {/* Playful Station Track Line */}
            <div className="relative flex justify-between items-center px-4 py-2">
              {/* Train track background line */}
              <div className="absolute inset-x-8 top-1/2 h-2 bg-slate-200 cartoon-border border-slate-300 -translate-y-1/2 rounded-full z-0"></div>
              
              {SCENES.map((scene, idx) => {
                const isActive = activeSceneIdx === idx;
                const isPassed = activeSceneIdx > idx;
                
                return (
                  <button
                    key={scene.id}
                    id={`station-btn-${scene.id}`}
                    onClick={() => jumpToScene(idx)}
                    className="relative z-10 flex flex-col items-center group focus:outline-none"
                  >
                    {/* Station Node Visual */}
                    <motion.div 
                      whileHover={{ scale: 1.15 }}
                      className={`w-10 h-10 rounded-full border-4 flex items-center justify-center font-display font-black text-sm transition-all shadow-sm ${
                        isActive 
                          ? 'bg-brand-yellow border-slate-800 text-slate-800 scale-110 ring-4 ring-amber-200' 
                          : isPassed 
                            ? 'bg-brand-green border-slate-800 text-white' 
                            : 'bg-slate-100 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isActive ? '🚂' : idx + 1}
                    </motion.div>
                    
                    {/* Station label */}
                    <span className={`text-[10px] font-bold mt-1.5 transition-colors hidden sm:inline ${
                      isActive ? 'text-slate-800 font-black' : 'text-slate-500'
                    }`}>
                      {scene.id === 'intro' ? '起点站' : scene.id === 'challenge-playground' ? '终点挑战' : `第${idx}幕`}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Active Storyboard Box with sky blue frame and radial background */}
          <div className="bg-white border-8 border-brand-sky p-5 sm:p-6 rounded-[40px] shadow-2xl min-h-[460px] flex flex-col justify-between relative overflow-visible" id="active-storyboard">
            
            {/* Ambient background pattern */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4FACFE_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none z-0 rounded-[32px]"></div>

            <div className="relative z-10 flex flex-col justify-between h-full flex-grow">
              {/* Header Title inside story */}
              <div className="border-b-2 border-slate-100 pb-3 mb-4">
                <span className="text-xs text-brand-pink font-extrabold uppercase tracking-wider font-display">
                  第 {activeSceneIdx + 1} 章 / 共 {SCENES.length} 章
                </span>
                <h2 className="font-display font-black text-xl text-slate-800 mt-1">
                  {activeScene.title}
                </h2>
                <p className="text-xs text-slate-500 font-bold mt-0.5">
                  {activeScene.subtitle}
                </p>
              </div>

            {/* Stage content rendering based on scene */}
            <div className="flex-grow flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScene.id + '-' + currentNumber}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex justify-center"
                >
                  {activeScene.id === 'intro' ? (
                    /* ILLUSTRATED INTRO COMIC SCREEN */
                    <div className="w-full space-y-6" id="scene-intro-view">
                      <div className="bg-amber-50/50 border-3 border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-slate-700">
                        <div className="text-5xl select-none">📖</div>
                        <div className="space-y-1 text-center sm:text-left">
                          <p className="font-bold text-slate-800 text-sm">
                            在神奇的数字王国里，开着一列快乐的数字小火车：<strong className="text-brand-pink font-display">12345</strong>。
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed font-bold">
                            这天，火车在路上遇到了高高瘦瘦的乘11魔术师双胞胎。双胞胎一挥魔术棒，天空中出现了一个神奇的“乘法传送门”。
                            他们想要看看，数字小火车穿过传送门后，会变成一辆多么长、多么威风的数字火车！
                          </p>
                        </div>
                      </div>

                      {/* Character Cards Showcase */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Card 1: Train 12345 */}
                        <div className="border-2 border-slate-800 rounded-xl p-3 bg-rose-50 flex flex-col items-center text-center">
                          <span className="text-3xl mb-1">🚂</span>
                          <span className="font-display font-bold text-slate-800 text-sm">数字火车 12345</span>
                          <span className="text-[10px] text-slate-500 font-bold mt-1">
                            由5节五彩斑斓的车厢组成，乘客分别是 1, 2, 3, 4, 5
                          </span>
                        </div>

                        {/* Card 2: Multiplication Genie */}
                        <div className="border-2 border-slate-800 rounded-xl p-3 bg-sky-50 flex flex-col items-center text-center">
                          <span className="text-3xl mb-1">✂️</span>
                          <span className="font-display font-bold text-slate-800 text-sm">乘号精灵 ×</span>
                          <span className="text-[10px] text-slate-500 font-bold mt-1">
                            像一把小剪刀，一拍手就能把小火车复制变多！
                          </span>
                        </div>

                        {/* Card 3: Twins 11 */}
                        <div className="border-2 border-slate-800 rounded-xl p-3 bg-purple-50 flex flex-col items-center text-center">
                          <span className="text-3xl mb-1">🧙‍♂️🧙‍♂️</span>
                          <span className="font-display font-bold text-slate-800 text-sm">双胞胎兄弟 11</span>
                          <span className="text-[10px] text-slate-500 font-bold mt-1">
                            长得高高瘦瘦。老大代表 10，老二代表 1。
                          </span>
                        </div>
                      </div>

                      {/* Call to action */}
                      <div className="flex justify-center pt-2">
                        <button
                          id="start-magic-journey-btn"
                          onClick={goToNextScene}
                          className="px-8 py-3 bg-brand-yellow hover:bg-amber-400 text-slate-900 font-display font-black rounded-2xl cartoon-border cartoon-shadow transition-transform active:scale-95 flex items-center gap-1.5 animate-bounce"
                        >
                          <span>🚀 开始魔法旅程！</span>
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : activeScene.id === 'challenge-playground' ? (
                    /* PLAYGROUND PRACTICE SCREEN */
                    <InteractiveChallenge 
                      currentNumber={currentNumber} 
                      onSetNumber={handleSetNumber} 
                      onGoToScene={(scene) => {
                        const idx = SCENES.findIndex(s => s.id === scene);
                        if (idx !== -1) setActiveSceneIdx(idx);
                      }}
                    />
                  ) : (
                    /* INTERACTIVE ANIMATION SCREENS */
                    <MagicTrain 
                      sceneId={activeScene.id as any} 
                      inputNumber={currentNumber}
                      onSceneComplete={() => {
                        // Optional auto-prompt or feedback
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Buttons to navigate story pages */}
            <div className="border-t-2 border-slate-100 pt-4 mt-6 flex justify-between items-center">
              <button
                id="story-prev-btn"
                onClick={goToPrevScene}
                disabled={activeSceneIdx === 0}
                className={`px-4 py-2 border-2 border-slate-800 font-display font-bold text-xs rounded-xl flex items-center gap-1 transition-colors ${
                  activeSceneIdx === 0 
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-300 text-slate-400' 
                    : 'bg-white hover:bg-slate-50 text-slate-800 cartoon-shadow-sm'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>上一幕</span>
              </button>

              {/* Page dot indicator */}
              <div className="flex gap-1.5">
                {SCENES.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeSceneIdx === i ? 'bg-brand-pink w-4' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {activeSceneIdx < SCENES.length - 1 ? (
                <button
                  id="story-next-btn"
                  onClick={goToNextScene}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-display font-bold text-xs rounded-xl border-2 border-slate-950 flex items-center gap-1 cartoon-shadow-sm transition-transform active:scale-95"
                >
                  <span>下一幕</span>
                  <ChevronRight className="w-4 h-4 text-brand-yellow" />
                </button>
              ) : (
                <button
                  id="story-replay-btn"
                  onClick={() => jumpToScene(0)}
                  className="px-4 py-2 bg-brand-green hover:bg-emerald-600 text-white font-display font-bold text-xs rounded-xl border-2 border-slate-950 flex items-center gap-1 cartoon-shadow-sm transition-transform active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>重新阅读</span>
                </button>
              )}
            </div>

          </div>
          </div>
        </div>

        {/* Right Area in Artistic Flair: Role Design & Wizard twins Speech (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Card A: Role/Character Showcase */}
          <div className="bg-[#FFEAA7] p-5 rounded-[32px] border-4 border-white shadow-lg text-brand-charcoal">
            <h3 className="text-sm font-black mb-3 flex items-center gap-1.5 font-display text-brand-charcoal">
              <span className="text-xl">🎨</span> 数学小火车角色档案
            </h3>
            <ul className="space-y-2 font-medium">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs border border-slate-200 shrink-0 mt-0.5">🚂</span>
                <span className="text-[11px] leading-tight text-[#4A4A4A]"><b>数字火车 {currentNumber}</b>：载着彩虹数字前行</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs border border-slate-200 shrink-0 mt-0.5">✂️</span>
                <span className="text-[11px] leading-tight text-[#4A4A4A]"><b>乘号精灵 ×</b>：像传送门一样好玩的神奇符号</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs border border-slate-200 shrink-0 mt-0.5">🧙‍♂️</span>
                <span className="text-[11px] leading-tight text-[#4A4A4A]"><b>魔术师双胞胎 11</b>：老大代表10，弟弟代表1</span>
              </li>
            </ul>
          </div>

          {/* Card B: Wizard Twins Guidance */}
          <div className="bg-white border-4 border-brand-peach rounded-[32px] p-5 shadow-lg flex-grow flex flex-col justify-between">
            <div>
              {/* Header bar */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                <span className="text-xl">🧙‍♂️</span>
                <div>
                  <h4 className="font-display font-bold text-brand-charcoal text-xs">魔法师修行秘籍</h4>
                  <p className="text-[10px] text-brand-gray font-bold">乘11魔法师正在细心讲解</p>
                </div>
              </div>

              {/* Speech bubble dialogue */}
              <div className="relative bg-[#FFF9E6] border border-amber-100 rounded-2xl p-4 my-2 text-xs text-slate-700 shadow-inner">
                <h5 className="font-display font-black text-brand-purple mb-1.5 flex items-center gap-1">
                  <Smile className="w-4 h-4 text-brand-pink" />
                  <span>{wizardTip.title}</span>
                </h5>
                <p className="leading-relaxed text-slate-600 font-bold text-justify whitespace-pre-line text-[11px]">
                  {wizardTip.text}
                </p>
              </div>
            </div>

            {/* Practical three steps formula */}
            <div className="space-y-3 pt-3 border-t border-dashed border-slate-100 mt-4">
              <span className="font-display text-brand-orange text-xs block font-bold">💡 记住魔法口诀：</span>
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-[#FAB1A0] rounded-lg flex shrink-0 items-center justify-center font-black text-white text-[10px]">1</div>
                <p className="text-[11px] font-bold text-slate-600">首尾两数分开站，两头一拉最威风。</p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-[#FAD390] rounded-lg flex shrink-0 items-center justify-center font-black text-white text-[10px]">2</div>
                <p className="text-[11px] font-bold text-slate-600">相邻数字手拉手，两两相加往里填。</p>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 bg-[#81ECEC] rounded-lg flex shrink-0 items-center justify-center font-black text-white text-[10px]">3</div>
                <p className="text-[11px] font-bold text-slate-600">合体变身长火车，神奇答案瞬间得！</p>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Decorative footer & Pedagogical callout inside Artistic Flair frame */}
      <footer className="max-w-5xl mx-auto mt-8 flex flex-col sm:flex-row items-center gap-4 bg-white/50 p-4 rounded-3xl border-2 border-white shadow-xs">
        <div className="text-4xl">💡</div>
        <div className="text-xs sm:text-sm font-bold text-brand-gray leading-relaxed text-center sm:text-left">
          二年级进阶思考：如果中间相加超过了 10 怎么办？别担心，那是下一趟“进位小精灵”小火车课程哦！
        </div>
      </footer>

    </div>
  );
}
