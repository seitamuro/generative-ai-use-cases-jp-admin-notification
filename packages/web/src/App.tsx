import '@aws-amplify/ui-react/styles.css';
import React, { useEffect, useMemo, useState } from 'react';
import {
  PiChatCircleText,
  PiChatsCircle,
  PiFlowArrow,
  PiGear,
  PiGlobe,
  PiHouse,
  PiImages,
  PiList,
  PiMagicWand,
  PiMagnifyingGlass,
  PiNote,
  PiPencil,
  PiPenNib,
  PiRobot,
  PiSpeakerHighBold,
  PiTranslate,
  PiVideoCamera,
  PiX,
} from 'react-icons/pi';
import { Outlet, useLocation } from 'react-router-dom';
import ButtonIcon from './components/ButtonIcon';
import Drawer, { ItemProps } from './components/Drawer';
import PopupInterUseCasesDemo from './components/PopupInterUseCasesDemo';
import useChatList from './hooks/useChatList';
import useDrawer from './hooks/useDrawer';
import useInterUseCases from './hooks/useInterUseCases';
import { MODELS } from './hooks/useModel';
import { optimizePromptEnabled } from './hooks/useOptimizePrompt';
import useScreen from './hooks/useScreen';

const ragEnabled: boolean = import.meta.env.VITE_APP_RAG_ENABLED === 'true';
const ragKnowledgeBaseEnabled: boolean =
  import.meta.env.VITE_APP_RAG_KNOWLEDGE_BASE_ENABLED === 'true';
const agentEnabled: boolean = import.meta.env.VITE_APP_AGENT_ENABLED === 'true';
const { multiModalModelIds } = MODELS;
const multiModalEnabled: boolean = multiModalModelIds.length > 0;
const getPromptFlows = () => {
  try {
    return JSON.parse(import.meta.env.VITE_APP_PROMPT_FLOWS);
  } catch (e) {
    return [];
  }
};
const promptFlows = getPromptFlows();
const promptFlowChatEnabled: boolean = promptFlows.length > 0;

const items: ItemProps[] = [
  {
    label: 'ホーム',
    to: '/',
    icon: <PiHouse />,
    display: 'usecase' as const,
  },
  {
    label: '設定情報',
    to: '/setting',
    icon: <PiGear />,
    display: 'none' as const,
  },
  {
    label: 'チャット',
    to: '/chat',
    icon: <PiChatsCircle />,
    display: 'usecase' as const,
  },
  ragEnabled
    ? {
      label: 'RAG チャット',
      to: '/rag',
      icon: <PiChatCircleText />,
      display: 'usecase' as const,
      sub: 'Amazon Kendra',
    }
    : null,
  ragKnowledgeBaseEnabled
    ? {
      label: 'RAG チャット',
      to: '/rag-knowledge-base',
      icon: <PiChatCircleText />,
      display: 'usecase' as const,
      sub: 'Knowledge Base',
    }
    : null,
  agentEnabled
    ? {
      label: 'Agent チャット',
      to: '/agent',
      icon: <PiRobot />,
      display: 'usecase' as const,
    }
    : null,
  promptFlowChatEnabled
    ? {
      label: 'Prompt Flow チャット',
      to: '/prompt-flow-chat',
      icon: <PiFlowArrow />,
      display: 'usecase' as const,
    }
    : null,
  {
    label: '文章生成',
    to: '/generate',
    icon: <PiPencil />,
    display: 'usecase' as const,
  },
  {
    label: '要約',
    to: '/summarize',
    icon: <PiNote />,
    display: 'usecase' as const,
  },
  {
    label: '校正',
    to: '/editorial',
    icon: <PiPenNib />,
    display: 'usecase' as const,
  },
  {
    label: '翻訳',
    to: '/translate',
    icon: <PiTranslate />,
    display: 'usecase' as const,
  },
  {
    label: 'Web コンテンツ抽出',
    to: '/web-content',
    icon: <PiGlobe />,
    display: 'usecase' as const,
  },
  {
    label: '画像生成',
    to: '/image',
    icon: <PiImages />,
    display: 'usecase' as const,
  },
  multiModalEnabled
    ? {
      label: '映像分析',
      to: '/video',
      icon: <PiVideoCamera />,
      display: 'usecase' as const,
    }
    : null,
  {
    label: '音声認識',
    to: '/transcribe',
    icon: <PiSpeakerHighBold />,
    display: 'tool' as const,
  },
  optimizePromptEnabled
    ? {
      label: 'プロンプト最適化',
      to: '/optimize',
      icon: <PiMagicWand />,
      display: 'tool' as const,
    }
    : null,
  ragEnabled
    ? {
      label: 'Kendra 検索',
      to: '/kendra',
      icon: <PiMagnifyingGlass />,
      display: 'tool' as const,
    }
    : null,
].flatMap((i) => (i !== null ? [i] : []));

// /chat/:chatId の形式から :chatId を返す
// path が別の形式の場合は null を返す
const extractChatId = (path: string): string | null => {
  const pattern = /\/chat\/(.+)/;
  const match = path.match(pattern);

  return match ? match[1] : null;
};

const App: React.FC = () => {
  const { switchOpen: switchDrawer, opened: isOpenDrawer } = useDrawer();
  const { pathname } = useLocation();
  const { getChatTitle } = useChatList();
  const { isShow } = useInterUseCases();
  const { screen, notifyScreen, scrollTopAnchorRef, scrollBottomAnchorRef } =
    useScreen();
  const [isShowNotification, setIsShowNotification] = useState<boolean>(false);

  const label = useMemo(() => {
    const chatId = extractChatId(pathname);

    if (chatId) {
      return getChatTitle(chatId) || '';
    } else {
      return items.find((i) => i.to === pathname)?.label || '';
    }
  }, [pathname, getChatTitle]);

  // 画面間遷移時にスクロールイベントが発火しない場合 (ページ最上部からページ最上部への移動など)
  // 最上部/最下部の判定がされないので、pathname の変化に応じて再判定する
  useEffect(() => {
    if (screen.current) {
      notifyScreen(screen.current);
    }
  }, [pathname, screen, notifyScreen]);

  return (
    <div
      className="screen:w-screen screen:h-screen overflow-x-hidden overflow-y-scroll"
      ref={screen}>
      <main className="flex-1">
        <div ref={scrollTopAnchorRef}></div>
        <header className="bg-aws-squid-ink visible flex h-12 w-full items-center justify-between text-lg text-white lg:invisible lg:h-0 print:hidden">
          <div className="flex w-10 items-center justify-start">
            <button
              className="focus:ring-aws-sky mr-2 rounded-full  p-2 hover:opacity-50 focus:outline-none focus:ring-1"
              onClick={() => {
                switchDrawer();
              }}>
              <PiList />
            </button>
          </div>

          {label}

          {/* label を真ん中にするためのダミーのブロック */}
          <div className="w-10" />
        </header>

        <div
          className={`fixed -left-64 top-0 z-50 transition-all lg:left-0 lg:z-0 ${isOpenDrawer ? 'left-0' : '-left-64'
            }`}>
          <Drawer items={items} />
        </div>

        <div
          id="smallDrawerFiller"
          className={`${isOpenDrawer ? 'visible' : 'invisible'} lg:invisible`}>
          <div
            className="screen:h-screen fixed top-0 z-40 w-screen bg-gray-900/90"
            onClick={switchDrawer}></div>
          <ButtonIcon
            className="fixed left-64 top-0 z-40 text-white"
            onClick={switchDrawer}>
            <PiX />
          </ButtonIcon>
        </div>
        <div className="text-aws-font-color lg:ml-64">
          {/* ユースケース間連携時に表示 */}
          {isShow && <PopupInterUseCasesDemo />}
          {isShowNotification && (
            <div
              style={{
                position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1000, display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }} onClick={() => setIsShowNotification(false)}>
              <div
                style={{
                  backgroundColor: "white",
                  width: "80vw",
                  height: "80vh",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                通知
              </div>
            </div>)}
          <Outlet />
        </div>
        <div ref={scrollBottomAnchorRef}></div>
      </main >
      {/* 右下に固定されたボタン */}
      <button
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg z-50"
        onClick={() => {
          // ボタンがクリックされたときの処理をここに追加
          setIsShowNotification(prev => !prev);
        }}
      >
        事務局からのお知らせ一覧
      </button >
    </div >
  );
};

export default App;
