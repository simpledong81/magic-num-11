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
import { SceneId, SceneDefinition, MagicMode } from './types';

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
  const [magicMode, setMagicMode] = useState<MagicMode>('multiply-11-simple');

  // Dynamic storyboard scenes depending on magic mode
  const getDynamicScenes = (): SceneDefinition[] => {
    if (magicMode === 'multiply-9-magic') {
      return [
        {
          id: 'intro',
          title: '📖 故事开始：乘9魔术师的挑战',
          subtitle: '认识我们的减号精灵和乘9魔术师',
          description: '今天，数字火车要穿过一个写着乘9的神奇传送门，快来帮他发现变大的秘密吧！'
        },
        {
          id: 'split-magic',
          title: '🪄 第一幕：神奇的“分裂与变身”',
          subtitle: '乘以 9 究竟是什么意思呢？',
          description: '乘9魔术师把火车复制成了两列！一列去乘以10，一列去乘以1。然后用乘10的火车减去自己！'
        },
        {
          id: 'addition-slide',
          title: '🚂 第二幕：数字小火车“减法”叠叠乐',
          subtitle: '直观呈现列竖式减法过程',
          description: '把两排火车重叠对齐，用上面的 ×10 火车，从右往左减去下面的自己！'
        },
        {
          id: 'shortcut-derivation',
          title: '🌟 第三幕：发现乘9的终极口诀',
          subtitle: '「末尾挂0，减去自身」的奥秘',
          description: '其实不用列竖式，在数字后面挂一个0车厢，再减去原来的数字，就能瞬间得到乘以9的答案！'
        },
        {
          id: 'challenge-playground',
          title: '🎯 第四幕：乘9魔法大挑战',
          subtitle: '用学到的口诀算算你自己的火车吧！',
          description: '你可以输入任意 2~5 位的数字，看看你能不能用最快的速度算出它乘以9的正确答案！'
        }
      ];
    } else if (magicMode === 'multiply-11-carry') {
      return [
        {
          id: 'intro',
          title: '📖 故事开始：进位小精灵登场',
          subtitle: '当相邻数字相加超过 10 时的神奇魔法',
          description: '今天，大数字火车78要穿过乘11的传送门！7+8相加超过10了，进位精灵会出来帮我们哦！'
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
          subtitle: '直观呈现进位加法的竖式过程',
          description: '两排火车叠起来，相加满10的时候，进位小精灵 🧚‍♂️ 就会飞上去，把 1 悄悄加到左边一列！'
        },
        {
          id: 'shortcut-derivation',
          title: '🌟 第三幕：发现进位简便口诀',
          subtitle: '「两头一拉，中间相加，满十进一」',
          description: '两头拉开，中间相加。如果相加满了十，个位留在中间，十位加一到左边去！'
        },
        {
          id: 'challenge-playground',
          title: '🎯 第四幕：进位森林大挑战',
          subtitle: '用学到的进位口诀变出你自己的火车吧！',
          description: '你可以输入任意 2~5 位的数字，挑战一下需要多次进位的超级大数字火车吧！'
        }
      ];
    } else {
      return SCENES;
    }
  };

  const dynamicScenes = getDynamicScenes();
  const activeScene = dynamicScenes[activeSceneIdx];

  // Navigate scenes
  const goToNextScene = () => {
    if (activeSceneIdx < dynamicScenes.length - 1) {
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

  const handleModeChange = (mode: MagicMode) => {
    audioEngine.playTrainWhistle();
    setMagicMode(mode);
    setActiveSceneIdx(0); // Go back to start of story
    // Set a good educational starting number for that mode
    if (mode === 'multiply-11-simple') {
      setCurrentNumber(12345);
    } else if (mode === 'multiply-11-carry') {
      setCurrentNumber(78); // 7+8=15 causes carry
    } else if (mode === 'multiply-9-magic') {
      setCurrentNumber(35); // 35*10-35 subtraction with borrow
    }
  };

  // Dialogue bubble explanation based on current scene & number & mode
  const getWizardTip = () => {
    const digits = String(currentNumber).split('').map(Number);
    const first = digits[0];
    const last = digits[digits.length - 1];

    if (magicMode === 'multiply-11-simple') {
      switch (activeScene.id) {
        case 'intro':
          return {
            title: "数字魔法双胞胎 11 说道：",
            text: "嘿！小朋友！我是魔法兄弟中的老大，我戴着‘10’帽子；这是我弟弟，他戴着‘1’帽子。我们加起来就是 11！任意数乘以 11，其实就是‘先乘10加上乘1自己’哦。快点击下方黄色按钮，来看看我们的分裂魔法吧！"
          };
        case 'split-magic':
          return {
            title: "帽子老大 and 老二大喊：",
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
    } else if (magicMode === 'multiply-11-carry') {
      switch (activeScene.id) {
        case 'intro':
          return {
            title: "进位魔术师双胞胎 11 说道：",
            text: "哈哈！这次的挑战升级了！如果中间相邻数字加起来超过了 10（比如 7+8=15），‘进位小精灵’ 🧚‍♂️ 就会蹦出来帮忙！把 5 留在中间，1 飞过去加给左边的邻居。让我们开始冒险吧！"
          };
        case 'split-magic':
          return {
            title: "双胞胎老大和老二挥舞魔棒：",
            text: `看！大数火车 ${currentNumber} 同样分裂成两列！老大带领乘以10的 ${currentNumber}0（多一个0车厢），老二带领乘以1的 ${currentNumber}。接着，要把他们相加，看看进位怎么发生！`
          };
        case 'addition-slide':
          return {
            title: "进位小精灵在半空盘旋：",
            text: `仔细看！当某一列相加满 10 的时候，就会生成一个进位精灵 🧚‍♂️。它会把 +1 悄悄带去跟左边的数相加。快点击按钮看小精灵怎么干活的吧！`
          };
        case 'shortcut-derivation':
          return {
            title: "进位口诀大师大声宣布：",
            text: `口诀升级版：「两头一拉，中间相加，满十进一」！比如 ${currentNumber}：两头拉开是 ${first} 和 ${last}，中间相加得到 ${digits.slice(0, -1).map((d, i) => `${d}+${digits[i+1]}=${d+digits[i+1]}`).join('，')}。因为超过了10，把十位的1加给左边的邻居，就完美得到答案啦！`
          };
        case 'challenge-playground':
          return {
            title: "进位大火车轰鸣着说：",
            text: `进位小测试开始啦！试着在脑海里让‘进位小精灵’飞一飞，将进位 1 加给左侧，算一算大数字乘以 11 的答案，然后测一测吧！`
          };
        default:
          return { title: "", text: "" };
      }
    } else {
      // multiply-9-magic
      switch (activeScene.id) {
        case 'intro':
          return {
            title: "高傲的乘9魔术师说道：",
            text: "哼哼，乘9也是有魔法的哦！因为 9 = 10 - 1，所以乘以 9 就是乘以 10 之后再减去自己本身。这个魔法叫做「末尾挂0，减去自身」。快来看看我是怎么分裂和计算的吧！"
          };
        case 'split-magic':
          return {
            title: "乘9魔术师大喊：",
            text: `看好了！火车 ${currentNumber} 分裂成了老大乘10的 ${currentNumber}0 火车（挂了个0车厢），和老二乘1的 ${currentNumber} 火车（代表它自己）。这次不是相加，是要用【老大 减去 老二】哦！`
          };
        case 'addition-slide':
          return {
            title: "减法小精灵指着车厢说：",
            text: `把两排火车对齐：上面是 ${currentNumber}0，下面是 ${currentNumber}。末位对齐后，我们要开始列竖式减法啦！如果某一位不够减（比如 0 减 ${last}），就需要向左边的车厢“借 1 当 10”哦！`
          };
        case 'shortcut-derivation':
          return {
            title: "乘9口诀大师公布秘籍：",
            text: `终极口诀：「末尾挂0，减去自身」！所以要算 ${currentNumber} × 9，只需要在末尾写个 0 变成 ${currentNumber}0，然后直接口算减去原来的数 ${currentNumber}：${currentNumber}0 - ${currentNumber} = ${currentNumber * 9}。是不是极其简单？`
          };
        case 'challenge-playground':
          return {
            title: "乘9列车拉响汽笛：",
            text: `小魔术师，来试试看！自己输入任何数字，然后用‘末尾挂0减自己’的技巧，算算它乘以 9 的结果，再在这里输入验证一下，看看你掌握了没有！`
          };
        default:
          return { title: "", text: "" };
      }
    }
  };

  const wizardTip = getWizardTip();

  return (
    <div className="min-h-screen bg-brand-cream bg-grid-pattern py-6 px-4 font-sans select-none" id="app-container">
      
      {/* Playful Top Header in Artistic Flair theme */}
      <header className="max-w-5xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-brand-coral rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 border-4 border-white shrink-0 animate-pulse">
            <span className="text-white text-3xl font-black italic">
              {magicMode === 'multiply-9-magic' ? '9' : '11'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-charcoal mb-0.5 flex items-center gap-2">
              数字小火车 <span className="text-brand-coral">
                {magicMode === 'multiply-9-magic' ? '×9' : '×11'}
              </span> 魔法之旅
            </h1>
            <p className="text-xs sm:text-sm font-medium text-brand-gray">跟小伙伴们一起探索简便算法的秘密</p>
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

      {/* Ticket-style Playful Mode Switcher */}
      <div className="max-w-5xl mx-auto mb-6 bg-white border-4 border-slate-800 p-4 rounded-3xl cartoon-shadow flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🎟️</span>
          <div>
            <h3 className="font-display font-black text-brand-charcoal text-sm flex items-center gap-1">
              <span>选择你的数学魔法车站：</span>
            </h3>
            <p className="text-[10px] text-brand-gray font-bold">点击不同车票，切换我们要探索的数学口诀</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center">
          <button
            onClick={() => handleModeChange('multiply-11-simple')}
            className={`px-4 py-2 text-xs font-display font-black rounded-xl border-2 transition-all active:scale-95 cartoon-shadow-sm ${
              magicMode === 'multiply-11-simple'
                ? 'bg-brand-yellow border-slate-800 text-slate-800 scale-105'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-500'
            }`}
          >
            🚂 乘11基础 (不进位)
          </button>
          <button
            onClick={() => handleModeChange('multiply-11-carry')}
            className={`px-4 py-2 text-xs font-display font-black rounded-xl border-2 transition-all active:scale-95 cartoon-shadow-sm ${
              magicMode === 'multiply-11-carry'
                ? 'bg-brand-pink border-slate-800 text-white scale-105'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-500'
            }`}
          >
            ⚡ 乘11进阶 (进位小精灵)
          </button>
          <button
            onClick={() => handleModeChange('multiply-9-magic')}
            className={`px-4 py-2 text-xs font-display font-black rounded-xl border-2 transition-all active:scale-95 cartoon-shadow-sm ${
              magicMode === 'multiply-9-magic'
                ? 'bg-brand-sky border-slate-800 text-white scale-105'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-500'
            }`}
          >
            🔮 乘9魔法 (十倍减自己)
          </button>
        </div>
      </div>

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
              
              {dynamicScenes.map((scene, idx) => {
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
                  第 {activeSceneIdx + 1} 章 / 共 {dynamicScenes.length} 章
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
                  key={activeScene.id + '-' + currentNumber + '-' + magicMode}
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
                            {magicMode === 'multiply-9-magic' ? (
                              <>在神奇的数字王国里，有一列快乐的数字小火车：<strong className="text-brand-pink font-display">{currentNumber}</strong>。</>
                            ) : (
                              <>在神奇的数字王国里，开着一列快乐的数字小火车：<strong className="text-brand-pink font-display">{currentNumber}</strong>。</>
                            )}
                          </p>
                          <p className="text-xs text-slate-500 leading-relaxed font-bold">
                            {magicMode === 'multiply-9-magic' ? (
                              <>今天，这列火车遇到了喜欢出谜题的“乘9魔术师”。魔术师挥起减法法杖，在虚空中拉出了乘9的传送大门！据说用十倍减去自身的秘籍，就能瞬间帮小火车穿越过去！</>
                            ) : magicMode === 'multiply-11-carry' ? (
                              <>这次小火车要面对加法相加满10的大考验！幸好，魔法师派来了可爱的“进位小精灵” 🧚‍♂️。一旦车厢里的数字相加超过 10，小精灵就会把它悄悄带去跟左边的伙伴相加哦！</>
                            ) : (
                              <>这天，火车在路上遇到了高高瘦瘦的乘11魔术师双胞胎。双胞胎一挥魔术棒，天空中出现了一个神奇的“乘法传送门”。他们想要看看，数字小火车穿过传送门后，会变成一辆多么长、多么威风的数字火车！</>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Character Cards Showcase */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Card 1: Train */}
                        <div className="border-2 border-slate-800 rounded-xl p-3 bg-rose-50 flex flex-col items-center text-center">
                          <span className="text-3xl mb-1">🚂</span>
                          <span className="font-display font-bold text-slate-800 text-sm">数字火车 {currentNumber}</span>
                          <span className="text-[10px] text-slate-500 font-bold mt-1">
                            由多节彩色车厢组成，上面载着数字乘客们！
                          </span>
                        </div>

                        {/* Card 2: Operator Genie */}
                        <div className="border-2 border-slate-800 rounded-xl p-3 bg-sky-50 flex flex-col items-center text-center">
                          <span className="text-3xl mb-1">
                            {magicMode === 'multiply-9-magic' ? '➖' : '✂️'}
                          </span>
                          <span className="font-display font-bold text-slate-800 text-sm">
                            {magicMode === 'multiply-9-magic' ? '减号精灵 −' : '乘号精灵 ×'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold mt-1">
                            {magicMode === 'multiply-9-magic' ? '像小松鼠一样，把多出的车厢吃掉减一减！' : '像一把小剪刀，一拍手就能把小火车复制变多！'}
                          </span>
                        </div>

                        {/* Card 3: Wizard Twins */}
                        <div className="border-2 border-slate-800 rounded-xl p-3 bg-purple-50 flex flex-col items-center text-center">
                          <span className="text-3xl mb-1">
                            {magicMode === 'multiply-9-magic' ? '🧙‍♂️✨' : magicMode === 'multiply-11-carry' ? '🧚‍♂️🧙‍♂️' : '🧙‍♂️🧙‍♂️'}
                          </span>
                          <span className="font-display font-bold text-slate-800 text-sm">
                            {magicMode === 'multiply-9-magic' ? '乘9大魔术师' : magicMode === 'multiply-11-carry' ? '进位小精灵 & 魔术师' : '双胞胎兄弟 11'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold mt-1">
                            {magicMode === 'multiply-9-magic' ? '戴着“10-1”神奇帽子，最会变乘法魔术。' : magicMode === 'multiply-11-carry' ? '精灵在头上飞，专帮满十的车厢往前进一。' : '代表 10 和 1 的双胞胎。'}
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
                      magicMode={magicMode}
                      onGoToScene={(scene) => {
                        const idx = dynamicScenes.findIndex(s => s.id === scene);
                        if (idx !== -1) setActiveSceneIdx(idx);
                      }}
                    />
                  ) : (
                    /* INTERACTIVE ANIMATION SCREENS */
                    <MagicTrain 
                      sceneId={activeScene.id as any} 
                      inputNumber={currentNumber}
                      magicMode={magicMode}
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
                {dynamicScenes.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeSceneIdx === i ? 'bg-brand-pink w-4' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {activeSceneIdx < dynamicScenes.length - 1 ? (
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
                <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs border border-slate-200 shrink-0 mt-0.5">
                  {magicMode === 'multiply-9-magic' ? '➖' : '✂️'}
                </span>
                <span className="text-[11px] leading-tight text-[#4A4A4A]">
                  <b>{magicMode === 'multiply-9-magic' ? '减号精灵 −' : '乘号精灵 ×'}</b>：像传送门一样好玩的神奇符号
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[10px] font-black shadow-xs border border-slate-200 shrink-0 mt-0.5">🧙‍♂️</span>
                <span className="text-[11px] leading-tight text-[#4A4A4A]">
                  <b>{magicMode === 'multiply-9-magic' ? '乘9大魔术师' : magicMode === 'multiply-11-carry' ? '进位精灵 🧚‍♂️' : '魔术师双胞胎 11'}</b>：
                  {magicMode === 'multiply-9-magic' ? '负责讲解“十倍减去自己”' : magicMode === 'multiply-11-carry' ? '负责指导满十进一的秘密' : '老大代表10，弟弟代表1'}
                </span>
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
                  <p className="text-[10px] text-brand-gray font-bold">
                    {magicMode === 'multiply-9-magic' ? '乘9魔法师' : '乘11魔法师'} 正在细心讲解
                  </p>
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
              {magicMode === 'multiply-9-magic' ? (
                <>
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 bg-[#81ECEC] rounded-lg flex shrink-0 items-center justify-center font-black text-white text-[10px]">1</div>
                    <p className="text-[11px] font-bold text-slate-600">火车末尾挂个0，变成10倍大列车。</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 bg-[#FAD390] rounded-lg flex shrink-0 items-center justify-center font-black text-white text-[10px]">2</div>
                    <p className="text-[11px] font-bold text-slate-600">减法精灵来帮忙，减去火车自己本身。</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 bg-[#FAB1A0] rounded-lg flex shrink-0 items-center justify-center font-black text-white text-[10px]">3</div>
                    <p className="text-[11px] font-bold text-slate-600">口算减法秒得出，乘9魔法最神速！</p>
                  </div>
                </>
              ) : magicMode === 'multiply-11-carry' ? (
                <>
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 bg-[#FAB1A0] rounded-lg flex shrink-0 items-center justify-center font-black text-white text-[10px]">1</div>
                    <p className="text-[11px] font-bold text-slate-600">首尾两数分开站，遇到进位别慌张。</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 bg-[#FAD390] rounded-lg flex shrink-0 items-center justify-center font-black text-white text-[10px]">2</div>
                    <p className="text-[11px] font-bold text-slate-600">相邻相加满十了，留个位数在正中。</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="w-6 h-6 bg-[#81ECEC] rounded-lg flex shrink-0 items-center justify-center font-black text-white text-[10px]">3</div>
                    <p className="text-[11px] font-bold text-slate-600">精灵带着 1 飞去，加给左边的大高个！</p>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Decorative footer & Pedagogical callout inside Artistic Flair frame */}
      <footer className="max-w-5xl mx-auto mt-8 flex flex-col sm:flex-row items-center gap-4 bg-white/50 p-4 rounded-3xl border-2 border-white shadow-xs">
        <div className="text-4xl">💡</div>
        <div className="text-xs sm:text-sm font-bold text-brand-gray leading-relaxed text-center sm:text-left">
          {magicMode === 'multiply-11-simple' ? (
            <span>进阶思考：如果中间相加超过了 10 怎么办？别担心，快点击上方的「进位小精灵」开始学习进位大秘宝吧！</span>
          ) : magicMode === 'multiply-11-carry' ? (
            <span>高阶思考：如果是连续需要进位（例如 999 乘 11），你可以自己手写一个输入进去，看进位精灵怎么进行多重魔法飞跃哦！</span>
          ) : (
            <span>思考小奥秘：乘9其实就是把数字放大10倍（挂个0），再把多余的一个自己刨掉，这是一种非常棒的数形结合简便思路哦！</span>
          )}
        </div>
      </footer>

    </div>
  );
}
