/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus,
  History, 
  Home, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Check, 
  X,
  User,
  ShieldCheck,
  AlertCircle,
  Trophy
} from 'lucide-react';
import { Game, Round, Player, AppState, Tab } from './types';

// --- Constants ---
const STORAGE_KEY_CURRENT = 'qx_current_game';
const STORAGE_KEY_HISTORY = 'qx_history_games';
const STORAGE_KEY_PRIVACY = 'qx_privacy_accepted';

// --- Components ---

const PrivacyModal = ({ onAccept, onDecline, showAgreementModal, onOpenAgreement, onOpenPrivacy }: { 
  onAccept: () => void, 
  onDecline: () => void,
  showAgreementModal: 'user-agreement' | 'privacy-policy' | null,
  onOpenAgreement: () => void,
  onOpenPrivacy: () => void
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100 p-4">
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white w-full max-w-sm shadow-2xl max-h-[80vh] overflow-y-auto rounded-[28px]"
    >
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#1D1D1F] mb-6 text-center pt-4">
          用户协议与隐私政策
        </h3>
        <div className="mb-6">
          <p className="text-base text-[#1D1D1F] mb-3">(1)《隐私政策》中关于个人设备用户信息的收集和使用的说明。</p>
          <p className="text-base text-[#1D1D1F]">(2)《隐私政策》中与第三方SDK类服务商数据共享、相关信息收集和使用说明。</p>
        </div>
        <div className="mb-6">
          <p className="text-sm text-[#86868B] mb-2">用户协议和隐私政策说明：</p>
          <p className="text-sm text-[#424245]">
            阅读完整的
            <span 
              onClick={onOpenAgreement}
              className="text-[#0071E3] hover:underline cursor-pointer font-medium"
            >
              《用户服务协议》
            </span>
            和
            <span 
              onClick={onOpenPrivacy}
              className="text-[#0071E3] hover:underline cursor-pointer font-medium"
            >
              《隐私政策》
            </span>
            了解详细内容。
          </p>
        </div>
      </div>
      <div className="flex border-t border-gray-200">
        <button 
          onClick={onDecline}
          className="flex-1 py-4 text-base font-medium text-[#1D1D1F] bg-white border-r border-gray-200 rounded-bl-[28px] hover:bg-gray-50 transition-colors"
        >
          不同意
        </button>
        <button 
          onClick={onAccept}
          className="flex-1 py-4 text-base font-medium text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-br-[28px] transition-colors"
        >
          同意并继续
        </button>
      </div>
    </motion.div>
  </div>
);

const AgreementModal = ({ onClose, title, content }: { onClose: () => void, title: string, content: any }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-110">
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-white rounded-[28px] w-full max-w-3xl h-[85vh] overflow-hidden shadow-2xl border border-black/5 flex flex-col"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-[#0071E3] rounded-xl flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <h2 className="text-xl font-bold text-[#1D1D1F]">{title}</h2>
        </div>
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[#86868B] active:scale-90 transition-transform hover:bg-gray-200"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-[#F5F5F7] p-6">
        {content}
      </div>
    </motion.div>
  </div>
);

const PrivacyPolicyContent = () => (
  <div className="max-w-none">
    <h1 className="text-2xl font-bold text-[#0071E3] text-center mb-2">🔒 隐私政策</h1>
    <p className="text-center text-gray-500 mb-6"><strong>生效日期</strong>：2026年03月15日</p>

    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-[#0071E3] mb-6">
      <p className="text-gray-700">欢迎使用「轻序计分」（以下简称"本应用"）。本应用由<strong>光年跃迁（温州）科技有限公司</strong>（以下简称"我们"）开发并运营。我们深知个人信息对您的重要性，将严格遵守《中华人民共和国个人信息保护法》等相关法律法规，保护您的个人信息安全。</p>
    </div>

    <p className="mb-6 text-gray-700">本隐私政策旨在说明我们如何收集、使用、存储和保护您在使用本应用过程中提供的个人信息，以及您对这些信息所享有的权利。请您在使用本应用前仔细阅读并充分理解本政策的全部内容，尤其是加粗的条款。如您对本政策有任何疑问、意见或建议，可通过本政策末尾提供的联系方式与我们联系。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2">一、我们收集的信息</h2>
    <p className="mb-4 text-gray-700">在您使用本应用的过程中，我们会收集以下信息，以提供、维护和改进我们的服务：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-gray-700"><strong>计分数据</strong>：您在使用本应用过程中主动录入的所有<strong>对局信息、玩家姓名、各轮次分数及相关计分数据</strong>。这些数据是本应用的核心功能内容，用于为您提供多人计分、分数统计和历史记录服务。</li>
      <li className="mb-3 text-gray-700"><strong>设备信息</strong>：为了保障应用的稳定运行和优化用户体验，我们会自动收集您的设备相关信息，包括但不限于<strong>设备型号、操作系统版本、设备标识符（如IMEI/Android ID）、IP地址</strong>等。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2">二、我们如何使用收集的信息</h2>
    <p className="mb-4 text-gray-700">我们仅会在以下合法、正当、必要的范围内使用您的个人信息：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-gray-700"><strong>提供和改进服务</strong>：使用您的计分数据来实现多人计分、分数统计、历史记录等核心功能；通过分析设备信息和使用数据，优化应用性能，修复已知问题，提升用户体验。</li>
      <li className="mb-3 text-gray-700"><strong>数据分析和统计</strong>：在对您的个人信息进行匿名化或去标识化处理后，进行内部数据分析和统计，以了解用户群体的使用习惯和需求，从而更好地规划和改进产品功能。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2">三、我们如何共享、转让和公开披露信息</h2>
    <p className="mb-4 text-gray-700">我们郑重承诺，严格保护您的个人信息，不会在以下情形之外向任何第三方共享、转让或公开披露您的信息：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-gray-700"><strong>法定情形</strong>：根据法律法规的规定、行政或司法机关的强制性要求，我们可能会向有关部门披露您的相关信息。</li>
      <li className="mb-3 text-gray-700"><strong>获得明确同意</strong>：在获得您的明确书面同意后，我们才会向第三方共享您的个人信息。</li>
      <li className="mb-3 text-gray-700"><strong>业务必要且合规</strong>：为了实现本政策第二条所述的目的，我们可能会与提供技术支持、支付服务或其他必要服务的合作伙伴共享必要的信息，但我们会要求其严格遵守本政策及相关法律法规，并对您的信息承担保密义务。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2">四、我们如何存储和保护信息</h2>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-gray-700"><strong>存储地点和期限</strong>：您的个人信息将存储于中华人民共和国境内的安全服务器上。我们会在实现本政策所述目的所必需的最短时间内保留您的信息，超出此期限后，我们将对您的信息进行删除或匿名化处理。</li>
      <li className="mb-3 text-gray-700"><strong>安全措施</strong>：我们采用符合行业标准的技术手段和安全管理措施来保护您的个人信息，包括但不限于数据加密、访问控制、安全审计等，以防止信息泄露、丢失、篡改或被未经授权的访问。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2">五、您的权利</h2>
    <p className="mb-4 text-gray-700">根据相关法律法规，您对您的个人信息享有以下权利：</p>
    <ol className="list-decimal pl-6 mb-6">
      <li className="mb-3 text-gray-700"><strong>访问权</strong>：您可以随时在本应用中查看和管理您的计分数据及历史记录。</li>
      <li className="mb-3 text-gray-700"><strong>更正权</strong>：如您发现您的计分数据存在错误，您可以在应用内进行修改和更正。</li>
      <li className="mb-3 text-gray-700"><strong>删除权</strong>：您可以随时删除单条计分记录或整个对局记录，应用将立即删除相关数据。</li>
      <li className="mb-3 text-gray-700"><strong>数据导出</strong>：本应用所有数据存储在您的设备本地，您可以通过设备备份等方式导出您的数据。</li>
    </ol>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2">六、未成年人保护</h2>
    <p className="mb-6 text-gray-700">我们非常重视对未成年人个人信息的保护。如您是未满14周岁的未成年人，在使用本应用前，应在监护人的指导下仔细阅读本政策，并征得监护人的同意。如我们发现自己在未事先获得监护人可验证同意的情况下收集了未成年人的个人信息，将立即删除相关数据。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2">七、本政策的更新</h2>
    <p className="mb-6 text-gray-700">我们可能会根据法律法规的更新、业务的调整或技术的发展，适时对本隐私政策进行修订。修订后的政策将在本应用内显著位置公示，并在生效前通过合理方式通知您。如您继续使用本应用，即表示您同意接受修订后的政策。</p>

    <h2 className="text-xl font-semibold mt-8 mb-4 border-b-2 border-gray-200 pb-2">八、联系我们</h2>
    <p className="mb-4 text-gray-700">如您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式与我们联系：</p>
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <p className="mb-2 text-gray-700"><strong>电子邮箱</strong>：Jp112022@163.com</p>
    </div>

    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
      <p className="mb-2 text-gray-500">感谢您使用轻序计分！</p>
      <p className="mb-4 text-gray-500">我们致力于为您提供安全、便捷的计分服务。</p>
      <p className="text-sm text-gray-400">© 2026 光年跃迁（温州）科技有限公司 版权所有</p>
    </div>
  </div>
);

const UserAgreementContent = () => (
  <div className="prose max-w-none">
    <h1 className="text-2xl font-bold text-[#0071E3] text-center mb-4">用户服务协议</h1>
    <p className="text-center text-gray-500 mb-8">更新日期：2026年3月20日</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4">1. 协议的接受</h2>
    <p>欢迎使用「轻序计分」应用（以下简称「本应用」）。</p>
    <p>本协议是您与光年跃迁（温州）科技有限公司（以下简称「我们」）之间关于使用本应用的法律协议。</p>
    <p>通过下载、安装或使用本应用，您表示同意接受本协议的全部条款和条件。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4">2. 服务内容</h2>
    <p>本应用提供以下服务：</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>创建和管理计分游戏</li>
      <li>记录和计算游戏分数</li>
      <li>查看游戏历史记录</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4">3. 用户义务</h2>
    <p>作为本应用的用户，您同意：</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>遵守本协议的所有条款</li>
      <li>不使用本应用进行任何非法活动</li>
      <li>不干扰本应用的正常运行</li>
      <li>保护您的设备安全，防止未授权访问</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4">4. 知识产权</h2>
    <p>本应用的所有内容，包括但不限于文字、图像、音频、视频、软件等，均受知识产权法律保护。</p>
    <p>未经我们的书面许可，您不得复制、修改、分发或商业使用本应用的任何内容。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4">5. 免责声明</h2>
    <p>本应用按「原样」提供，不做任何形式的保证。</p>
    <p>我们不保证：</p>
    <ul className="list-disc pl-6 space-y-2">
      <li>本应用将符合您的要求</li>
      <li>本应用将无中断、及时、安全或无错误地运行</li>
      <li>本应用的使用结果将是准确或可靠的</li>
    </ul>
    
    <h2 className="text-xl font-semibold mt-8 mb-4">6. 终止</h2>
    <p>我们有权在任何时候，出于任何原因，终止或暂停您对本应用的访问。</p>
    <p>您也可以随时停止使用本应用。</p>
    
    <h2 className="text-xl font-semibold mt-8 mb-4">7. 适用法律</h2>
    <p>本协议受中华人民共和国法律管辖。</p>
    <p>任何与本协议相关的争议，应通过友好协商解决；协商不成的，应提交至温州市有管辖权的人民法院诉讼解决。</p>
  </div>
);

const PrivacyPolicyModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="bg-white rounded-[28px] w-full max-w-3xl h-[85vh] overflow-hidden shadow-2xl border border-black/5 flex flex-col"
    >
      <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 text-[#0071E3] rounded-xl flex items-center justify-center">
            <ShieldCheck size={22} />
          </div>
          <h2 className="text-xl font-bold text-[#1D1D1F]">隐私政策</h2>
        </div>
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[#86868B] active:scale-90 transition-transform hover:bg-gray-200"
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-[#F5F5F7] p-6">
        <PrivacyPolicyContent />
      </div>
    </motion.div>
  </div>
);

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    const accepted = localStorage.getItem(STORAGE_KEY_PRIVACY);
    return accepted ? 'MAIN' : 'PRIVACY';
  });
  const [activeTab, setActiveTab] = useState<Tab>('HOME');
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [history, setHistory] = useState<Game[]>([]);
  
  // Modal States
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showAddRoundModal, setShowAddRoundModal] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showPrivacyManual, setShowPrivacyManual] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState<'user-agreement' | 'privacy-policy' | null>(null);

  // --- Initialization ---
  useEffect(() => {
    // Load Data
    const savedCurrent = localStorage.getItem(STORAGE_KEY_CURRENT);
    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (savedCurrent) setCurrentGame(JSON.parse(savedCurrent));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // --- Persistence with Debounce ---
  const currentGameRef = useRef(currentGame);
  const historyRef = useRef(history);
  
  useEffect(() => {
    currentGameRef.current = currentGame;
  }, [currentGame]);
  
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentGameRef.current) {
        localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(currentGameRef.current));
      } else {
        localStorage.removeItem(STORAGE_KEY_CURRENT);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [currentGame]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyRef.current));
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [history]);

  const handleAcceptPrivacy = useCallback(() => {
    localStorage.setItem(STORAGE_KEY_PRIVACY, 'true');
    setAppState('MAIN');
  }, []);

  const [showDeclineModal, setShowDeclineModal] = useState(false);

  const handleDeclinePrivacy = useCallback(() => {
    setShowDeclineModal(true);
  }, []);

  const handleDeclineConfirm = useCallback(() => {
    setShowDeclineModal(false);
    alert('由于您拒绝了隐私政策，我们无法为您提供服务。');
  }, []);

  const handleDeclineCancel = useCallback(() => {
    setShowDeclineModal(false);
  }, []);

  const handleOpenAgreement = useCallback(() => {
    setShowAgreementModal('user-agreement');
  }, []);

  const handleOpenPrivacy = useCallback(() => {
    setShowAgreementModal('privacy-policy');
  }, []);

  const handleCloseAgreement = useCallback(() => {
    setShowAgreementModal(null);
  }, []);

  const startNewGame = useCallback((players: Player[]) => {
    const newGame: Game = {
      id: Date.now().toString(),
      startTime: Date.now(),
      players,
      rounds: []
    };
    setCurrentGame(newGame);
    setShowConfigModal(false);
  }, []);

  const addRound = useCallback((scores: Record<string, number>) => {
    if (!currentGame) return;
    const newRound: Round = {
      id: Date.now().toString(),
      roundNumber: currentGame.rounds.length + 1,
      timestamp: Date.now(),
      scores
    };
    setCurrentGame({
      ...currentGame,
      rounds: [...currentGame.rounds, newRound]
    });
    setShowAddRoundModal(false);
  }, [currentGame]);

  const endGame = useCallback(() => {
    if (!currentGame) return;
    const finishedGame = { ...currentGame, endTime: Date.now() };
    setHistory([finishedGame, ...history]);
    setCurrentGame(null);
    setShowEndConfirm(false);
    setActiveTab('HISTORY');
  }, [currentGame, history]);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(history.filter(g => g.id !== id));
  }, [history]);

  if (appState === 'PRIVACY') return (
    <>
      <PrivacyModal 
        onAccept={handleAcceptPrivacy}
        onDecline={handleDeclinePrivacy}
        showAgreementModal={showAgreementModal}
        onOpenAgreement={handleOpenAgreement}
        onOpenPrivacy={handleOpenPrivacy}
      />
      {showAgreementModal === 'user-agreement' && (
        <AgreementModal 
          onClose={handleCloseAgreement}
          title="用户服务协议"
          content={<UserAgreementContent />}
        />
      )}
      {showAgreementModal === 'privacy-policy' && (
        <AgreementModal 
          onClose={handleCloseAgreement}
          title="隐私政策"
          content={<PrivacyPolicyContent />}
        />
      )}

      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-110">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-[28px] w-full max-w-md overflow-hidden shadow-2xl border border-black/5 flex flex-col"
          >
            <div className="flex-1 p-6">
              <h2 className="text-xl font-bold text-[#1D1D1F] mb-4">确认拒绝</h2>
              <p className="text-gray-600 mb-6">您确定要拒绝隐私政策吗？拒绝后将无法使用我们的服务。</p>
            </div>
            <div className="flex border-t border-black/5">
              <button 
                onClick={handleDeclineCancel}
                className="flex-1 py-4 text-center text-gray-600 font-medium hover:bg-gray-50"
              >
                取消
              </button>
              <div className="w-px bg-black/5"></div>
              <button 
                onClick={handleDeclineConfirm}
                className="flex-1 py-4 text-center text-[#0071E3] font-medium hover:bg-gray-50"
              >
                确定
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col font-sans text-[#1D1D1F] select-none">
      {/* Header */}
      <header className="glass px-6 py-8 pt-12 sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-linear-to-br from-[#0071E3] to-[#00C7FF] rounded-[10px] flex items-center justify-center shadow-sm">
              <Trophy size={20} className="text-white" />
            </div>
            <h1 className="text-[22px] font-bold tracking-tight">轻序计分</h1>
          </div>
          <button 
            onClick={() => setShowPrivacyManual(true)}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#0071E3] active:scale-90 transition-transform"
            title="隐私政策"
          >
            <ShieldCheck size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 flex flex-col">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          {activeTab === 'HOME' ? (
            <HomeView 
              game={currentGame} 
              onStart={() => setShowConfigModal(true)}
              onAddRound={() => setShowAddRoundModal(true)}
              onEnd={() => setShowEndConfirm(true)}
            />
          ) : (
            <HistoryView 
              history={history} 
              onDelete={deleteHistoryItem}
            />
          )}
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t-0 py-4 px-8 pb-10 z-30">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button 
            onClick={() => setActiveTab('HOME')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'HOME' ? 'text-[#0071E3] scale-110' : 'text-[#86868B]'}`}
          >
            <Home size={22} strokeWidth={activeTab === 'HOME' ? 2.5 : 2} />
            <span className="text-[11px] font-semibold">首页</span>
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'HISTORY' ? 'text-[#0071E3] scale-110' : 'text-[#86868B]'}`}
          >
            <History size={22} strokeWidth={activeTab === 'HISTORY' ? 2.5 : 2} />
            <span className="text-[11px] font-semibold">历史</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {showConfigModal && (
          <ConfigModal 
            onClose={() => setShowConfigModal(false)} 
            onConfirm={startNewGame} 
          />
        )}
        {showAddRoundModal && currentGame && (
          <AddRoundModal 
            game={currentGame}
            onClose={() => setShowAddRoundModal(false)}
            onConfirm={addRound}
          />
        )}
        {showEndConfirm && (
          <ConfirmModal 
            title="结束本局"
            message="是否结束当前局计分？结束后记录将移入历史。"
            onClose={() => setShowEndConfirm(false)}
            onConfirm={endGame}
          />
        )}
        {showPrivacyManual && (
          <PrivacyPolicyModal onClose={() => setShowPrivacyManual(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Views ---

function HomeView({ game, onStart, onAddRound, onEnd }: { 
  game: Game | null, 
  onStart: () => void, 
  onAddRound: () => void, 
  onEnd: () => void 
}) {
  const totalScores = useMemo(() => {
    if (!game) return {};
    return game.players.reduce((acc, p) => {
      acc[p.id] = game.rounds.reduce((sum, r) => sum + (r.scores[p.id] || 0), 0);
      return acc;
    }, {} as Record<string, number>);
  }, [game]);

  if (!game) {
    return (
      <div className="flex-1 px-8 flex flex-col items-center justify-center">
        <motion.button 
          whileHover={{ scale: 1.05, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={onStart}
          className="w-64 h-64 rounded-full bg-linear-to-br from-[#0071E3] to-[#00C7FF] shadow-[0_20px_60px_rgba(0,113,227,0.35)] flex flex-col items-center justify-center gap-3 text-white relative overflow-hidden group border-4 border-white/20 hardware-accelerated"
        >
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
            className="absolute inset-0 bg-white rounded-full will-change-transform will-change-opacity"
          />
          
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-1 backdrop-blur-sm">
              <Plus size={40} strokeWidth={3} />
            </div>
            <div className="text-xl font-black tracking-tight">开始新对局</div>
            <div className="text-[11px] font-bold uppercase tracking-widest opacity-70">Quick Start</div>
          </div>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 space-y-6">
      {/* Game Info Card */}
      <div className="apple-card p-4 sm:p-7">
        <div className="flex justify-between items-start mb-6 px-2 sm:px-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[11px] font-bold text-[#86868B] uppercase tracking-wider">正在进行</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1D1D1F]">
              {game.players.filter(p => !p.isReferee).length}人局
            </h2>
          </div>
          <button 
            onClick={onEnd}
            disabled={game.rounds.length === 0}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${game.rounds.length === 0 ? 'bg-gray-50 text-gray-300' : 'bg-red-50 text-red-500 active:bg-red-100'}`}
          >
            结束
          </button>
        </div>

        {/* Rounds List moved here */}
        {game.rounds.length > 0 && (
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[13px] font-bold text-[#1D1D1F]">最近记录</span>
              <span className="text-[10px] font-medium text-[#86868B]">共 {game.rounds.length} 轮</span>
            </div>
            
            {/* Total Row */}
            <div className="bg-[#F5F5F7] rounded-[18px] px-2 py-3 border border-black/5 flex items-center gap-2">
              <div className="flex flex-col items-center shrink-0 min-w-[28px]">
                <div className="text-[#1D1D1F] font-black text-[10px] leading-none">总计</div>
              </div>
              <div className="flex-1 flex items-center justify-between gap-0.5 min-w-0">
                {game.players.map(p => (
                  <div key={p.id} className="flex-1 flex flex-col items-center min-w-0">
                    <span className="text-[9px] font-bold text-[#1D1D1F] truncate w-full text-center mb-0.5">
                      {p.name}
                    </span>
                    <span className={`text-[13px] font-black ${totalScores[p.id] > 0 ? 'text-[#FF3B30]' : totalScores[p.id] < 0 ? 'text-[#34C759]' : 'text-[#1D1D1F]'}`}>
                      {totalScores[p.id]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
              {[...game.rounds].reverse().map(round => (
                <RoundCard key={round.id} round={round} players={game.players} />
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={onAddRound}
          className="w-full mt-8 py-4 apple-button-primary flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
        >
          <Plus size={20} strokeWidth={2.5} />
          录入本轮分数
        </button>
      </div>
    </div>
  );
}

function HistoryView({ history, onDelete }: { history: Game[], onDelete: (id: string) => void }) {
  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
          <History size={48} />
        </div>
        <p className="text-gray-400 font-medium tracking-tight">暂无历史记录</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {history.map((game, index) => (
        <HistoryCard 
          key={game.id} 
          game={game} 
          onDelete={() => onDelete(game.id)}
        />
      ))}
    </div>
  );
}

// --- Card Components ---

function RoundCard({ round, players }: { round: Round, players: Player[], key?: string }) {
  const dateStr = new Date(round.timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });

  return (
    <div className="bg-white rounded-[18px] px-2 py-2.5 border border-black/2 shadow-sm flex items-center gap-2">
      <div className="flex flex-col items-center gap-0.5 shrink-0 min-w-[28px]">
        <div className="w-7 h-7 bg-[#F5F5F7] rounded-lg flex items-center justify-center text-[#1D1D1F] font-bold text-[11px]">
          {round.roundNumber}
        </div>
        <span className="text-[7px] font-medium text-[#C1C1C6] leading-none">{dateStr}</span>
      </div>
      <div className="flex-1 flex items-center justify-between gap-0.5 min-w-0">
        {players.map(p => (
          <div key={p.id} className="flex-1 flex flex-col items-center min-w-0">
            <span className="text-[9px] font-medium text-[#86868B] truncate w-full text-center mb-0.5">
              {p.name}
            </span>
            <span className={`text-[12px] font-bold ${round.scores[p.id] > 0 ? 'text-[#FF3B30]' : round.scores[p.id] < 0 ? 'text-[#34C759]' : 'text-[#1D1D1F]'}`}>
              {round.scores[p.id]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryCard({ game, onDelete }: { game: Game, onDelete: () => void, key?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  
  const dateStr = useMemo(() => new Date(game.endTime || game.startTime).toLocaleDateString('zh-CN', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
  }).replace(/\//g, '-'), [game.endTime, game.startTime]);

  const totalScores = useMemo(() => game.players.reduce((acc, p) => {
    acc[p.id] = game.rounds.reduce((sum, r) => sum + (r.scores[p.id] || 0), 0);
    return acc;
  }, {} as Record<string, number>), [game.players, game.rounds]);

  return (
    <div 
      className="apple-card overflow-hidden relative"
      onContextMenu={(e) => { e.preventDefault(); setShowDelete(true); }}
      onTouchStart={() => {
        const timer = setTimeout(() => setShowDelete(true), 800);
        const cancel = () => clearTimeout(timer);
        window.addEventListener('touchend', cancel, { once: true });
        window.addEventListener('touchmove', cancel, { once: true });
      }}
    >
      <div className="p-6" onClick={() => setExpanded(!expanded)}>
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F5F5F7] rounded-[16px] flex items-center justify-center text-[#86868B]">
              <History size={24} />
            </div>
            <div>
              <div className="text-[16px] font-bold text-[#1D1D1F]">已结束局</div>
              <div className="text-[11px] font-medium text-[#86868B]">{dateStr}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[13px] font-bold text-[#0071E3]">{game.players.filter(p => !p.isReferee).length} 人</div>
            <div className="text-[11px] font-medium text-[#86868B]">{game.rounds.length} 轮</div>
          </div>
        </div>

        {/* Summary Row (Total Scores) */}
        <div className="bg-[#F5F5F7] rounded-[18px] px-2 py-3 border border-black/5 flex items-center gap-2">
          <div className="flex flex-col items-center shrink-0 min-w-[28px]">
            <div className="text-[#1D1D1F] font-black text-[10px] leading-none">总计</div>
          </div>
          <div className="flex-1 flex items-center justify-between gap-0.5 min-w-0">
            {game.players.map(p => (
              <div key={p.id} className="flex-1 flex flex-col items-center min-w-0">
                <span className="text-[9px] font-bold text-[#1D1D1F] truncate w-full text-center mb-0.5">
                  {p.name}
                </span>
                <span className={`text-[13px] font-black ${totalScores[p.id] > 0 ? 'text-[#FF3B30]' : totalScores[p.id] < 0 ? 'text-[#34C759]' : 'text-[#1D1D1F]'}`}>
                  {totalScores[p.id]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#FAFAFC] border-t border-black/2"
          >
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[11px] font-bold text-[#1D1D1F]">对局详情</span>
                <span className="text-[10px] font-medium text-[#86868B]">共 {game.rounds.length} 轮</span>
              </div>
              {[...game.rounds].reverse().map(round => (
                <RoundCard key={round.id} round={round} players={game.players} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Overlay */}
      <AnimatePresence>
        {showDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center gap-6 z-20"
          >
            <button 
              onClick={() => setShowDelete(false)}
              className="w-14 h-14 bg-[#F5F5F7] text-[#1D1D1F] rounded-full flex items-center justify-center transition-transform active:scale-90"
            >
              <X size={24} />
            </button>
            <button 
              onClick={() => { onDelete(); setShowDelete(false); }}
              className="w-14 h-14 bg-[#FF3B30] text-white rounded-full flex items-center justify-center shadow-xl shadow-red-200 transition-transform active:scale-90"
            >
              <Trash2 size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Modals ---

function ConfigModal({ onClose, onConfirm }: { onClose: () => void, onConfirm: (players: Player[]) => void }) {
  const [count, setCount] = useState(4);
  const [names, setNames] = useState<string[]>(Array(10).fill(''));
  const [hasReferee, setHasReferee] = useState(false);
  const [refereeName, setRefereeName] = useState('');

  const handleConfirm = () => {
    const players: Player[] = [];
    // Add regular players
    for (let i = 0; i < count; i++) {
      players.push({
        id: `p${i}`,
        name: names[i].trim() || `玩家${i + 1}`,
        isReferee: false
      });
    }
    // Add referee if enabled
    if (hasReferee) {
      players.push({
        id: `referee`,
        name: refereeName.trim() || '裁判',
        isReferee: true
      });
    }
    onConfirm(players);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-8 shadow-2xl overflow-hidden"
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 sm:hidden" />
        <h2 className="text-2xl font-bold text-[#1D1D1F] mb-8 text-center">本局设置</h2>
        
        <div className="space-y-8">
          {/* Player Count */}
          <div>
            <label className="text-[13px] font-bold text-[#86868B] uppercase tracking-wider mb-4 block">玩家人数</label>
            <div className="flex bg-[#F5F5F7] p-1.5 rounded-[16px] gap-1">
              {[2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => setCount(num)}
                  className={`flex-1 py-2.5 rounded-[12px] text-[15px] font-bold transition-all ${count === num ? 'bg-white text-[#0071E3] shadow-sm' : 'text-[#86868B]'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Referee Toggle */}
          <div className="flex items-center justify-between bg-[#F5F5F7] p-5 rounded-[22px]">
            <div>
              <div className="text-[16px] font-bold text-[#1D1D1F]">包含裁判</div>
              <div className="text-[12px] text-[#86868B]">裁判也将参与计分</div>
            </div>
            <button 
              onClick={() => setHasReferee(!hasReferee)}
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${hasReferee ? 'bg-[#34C759]' : 'bg-gray-200'}`}
            >
              <motion.div 
                animate={{ x: hasReferee ? 24 : 0 }}
                className="w-6 h-6 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>

          {/* Player Names */}
          <div className="space-y-3">
            <label className="text-[13px] font-bold text-[#86868B] uppercase tracking-wider block">玩家名称</label>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C1C1C6]" />
                  <input
                    value={names[i]}
                    onChange={(e) => {
                      const next = [...names];
                      next[i] = e.target.value;
                      setNames(next);
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] border-0 rounded-[16px] text-[15px] font-medium focus:ring-2 focus:ring-[#0071E3] transition-all"
                    placeholder={`玩家 ${i + 1}`}
                  />
                </div>
              ))}
              {hasReferee && (
                <div className="relative col-span-2">
                  <ShieldCheck size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0071E3]" />
                  <input
                    value={refereeName}
                    onChange={(e) => setRefereeName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-blue-50/50 border border-blue-100 rounded-[16px] text-[15px] font-bold text-[#0071E3] focus:ring-2 focus:ring-[#0071E3] transition-all"
                    placeholder="裁判名称"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 py-4 apple-button-secondary"
            >
              取消
            </button>
            <button 
              onClick={handleConfirm}
              className="flex-1 py-4 apple-button-primary shadow-lg shadow-blue-100"
            >
              开始
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AddRoundModal({ game, onClose, onConfirm }: { 
  game: Game, 
  onClose: () => void, 
  onConfirm: (scores: Record<string, number>) => void 
}) {
  const [inputs, setInputs] = useState<Record<string, { sign: number, value: string }>>(() => {
    const initial: Record<string, { sign: number, value: string }> = {};
    game.players.forEach(p => initial[p.id] = { sign: 1, value: '' });
    return initial;
  });
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    const numericScores: Record<string, number> = {};
    let sum = 0;
    
    for (const player of game.players) {
      const input = inputs[player.id];
      const val = (parseInt(input.value) || 0) * input.sign;
      numericScores[player.id] = val;
      sum += val;
    }

    if (sum !== 0) {
      setError('总和需为0');
      return;
    }

    onConfirm(numericScores);
  };

  const currentSum: number = (Object.values(inputs) as { sign: number, value: string }[]).reduce((acc: number, input) => {
    return acc + (parseInt(input.value) || 0) * input.sign;
  }, 0);
  const isValid = currentSum === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        className="relative w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl"
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6 sm:hidden" />
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1D1D1F]">录入分数</h2>
          <div className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${isValid ? 'bg-[#34C759]/10 text-[#34C759]' : 'bg-[#FF3B30]/10 text-[#FF3B30]'}`}>
            总和: {currentSum > 0 ? `+${currentSum}` : currentSum}
          </div>
        </div>

        <div className="space-y-2.5 mb-8">
          {game.players.map(player => (
            <div key={player.id} className="flex items-center gap-3 bg-[#F5F5F7] p-2.5 rounded-[20px] border border-black/2">
              <div className="flex-1 min-w-0 pl-1">
                <div className="text-[13px] font-bold text-[#1D1D1F] truncate">{player.name}</div>
                {player.isReferee && player.name === '裁判' && <div className="text-[9px] text-[#86868B] font-medium leading-none mt-0.5">裁判</div>}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Sign Toggle Switch */}
                <div className="flex bg-white rounded-[12px] p-0.5 shadow-sm border border-black/3">
                  <button 
                    onClick={() => {
                      setInputs({ ...inputs, [player.id]: { ...inputs[player.id], sign: 1 } });
                      setError(null);
                    }}
                    className={`w-7 h-7 rounded-[10px] flex items-center justify-center text-[13px] font-black transition-all ${inputs[player.id].sign === 1 ? 'bg-[#FF3B30] text-white shadow-sm' : 'text-[#86868B]'}`}
                  >
                    +
                  </button>
                  <button 
                    onClick={() => {
                      setInputs({ ...inputs, [player.id]: { ...inputs[player.id], sign: -1 } });
                      setError(null);
                    }}
                    className={`w-7 h-7 rounded-[10px] flex items-center justify-center text-[13px] font-black transition-all ${inputs[player.id].sign === -1 ? 'bg-[#34C759] text-white shadow-sm' : 'text-[#86868B]'}`}
                  >
                    -
                  </button>
                </div>

                {/* Input */}
                <div className="relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    value={inputs[player.id].value}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setInputs({ ...inputs, [player.id]: { ...inputs[player.id], value: val } });
                      setError(null);
                    }}
                    className="w-14 h-9 bg-white border-0 rounded-[12px] text-center text-[15px] font-bold text-[#1D1D1F] focus:ring-2 focus:ring-[#0071E3] transition-all shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-[#FF3B30] text-[12px] font-bold mb-4"
          >
            {error}
          </motion.div>
        )}

        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3.5 rounded-[18px] text-[15px] font-bold text-[#86868B] bg-[#F5F5F7] active:scale-95 transition-all"
          >
            取消
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!isValid && currentSum !== 0}
            className={`flex-1 py-3.5 rounded-[18px] text-[15px] font-bold text-white shadow-lg transition-all active:scale-95 ${isValid ? 'bg-[#0071E3] shadow-blue-100' : 'bg-[#1D1D1F] opacity-50'}`}
          >
            确认录入
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ConfirmModal({ title, message, onClose, onConfirm }: { 
  title: string, 
  message: string, 
  onClose: () => void, 
  onConfirm: () => void 
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white rounded-[24px] w-full max-w-[280px] overflow-hidden shadow-2xl p-6 text-center"
      >
        <div className="w-12 h-12 bg-red-50 text-[#FF3B30] rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-lg font-bold text-[#1D1D1F] mb-1.5">{title}</h2>
        <p className="text-[13px] text-[#86868B] mb-6 leading-relaxed px-2">{message}</p>
        
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-[#F5F5F7] text-[#1D1D1F] rounded-xl font-bold text-[14px] active:scale-95 transition-all"
          >
            取消
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 bg-[#FF3B30] text-white rounded-xl font-bold text-[14px] shadow-lg shadow-red-100 active:scale-95 transition-all"
          >
            确认
          </button>
        </div>
      </motion.div>
    </div>
  );
}
