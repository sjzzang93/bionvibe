'use client';

import { useState, useEffect } from 'react';
import AppFooter from '@/app/components/AppFooter';
import Link from 'next/link';
import { getBrowserSupabase } from '@/lib/supabase';

// ★ 브라우저 전용 싱글톤 클라이언트 사용
const supabase = getBrowserSupabase();

interface Player {
  id: number;
  player_name: string;
  role: string | null;
  is_alive: boolean;
  player_order: number;
  is_ai?: boolean;
  votes?: number;
}

interface Game {
  id: number;
  room_code: string;
  host_name: string;
  status: 'waiting' | 'assigning' | 'playing' | 'finished';
  phase: 'night' | 'day';
  round: number;
  player_count: number;
  game_log: string[];
}

type AIDifficulty = 'easy' | 'normal' | 'hard';

export default function MafiaGamePage() {
  const [mode, setMode] = useState<'menu' | 'selectMode' | 'selectAI' | 'create' | 'join' | 'waiting' | 'game'>('menu');
  const [gameMode, setGameMode] = useState<'multiplayer' | 'ai'>('multiplayer');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('normal');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerCount, setPlayerCount] = useState(6);
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [votingMode, setVotingMode] = useState(false);
  const [votes, setVotes] = useState<Record<number, number>>({});
  
  // AI 게임 전용 상태
  const [aiPlayers, setAiPlayers] = useState<Player[]>([]);
  const [aiPhase, setAiPhase] = useState<'night' | 'day'>('night');
  const [aiRound, setAiRound] = useState(1);
  const [aiGameLog, setAiGameLog] = useState<string[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [actionUsed, setActionUsed] = useState(false);

  // AI 이름 풀
  const aiNames = ['지민', '서준', '하은', '도윤', '서연', '예준', '수아', '민준', '지우'];

  // 역할 정보
  const roleInfo = {
    mafia: {
      name: '마피아',
      emoji: '🔪',
      color: 'from-red-600 to-rose-600',
      description: '밤에 시민을 제거할 수 있습니다',
      goal: '시민 수를 마피아 수 이하로 만들어 승리하세요'
    },
    doctor: {
      name: '의사',
      emoji: '💊',
      color: 'from-green-600 to-emerald-600',
      description: '밤에 한 명을 보호할 수 있습니다',
      goal: '마피아를 모두 찾아내 시민을 승리로 이끄세요'
    },
    police: {
      name: '경찰',
      emoji: '👮',
      color: 'from-blue-600 to-cyan-600',
      description: '밤에 한 명을 조사할 수 있습니다',
      goal: '마피아를 찾아내고 낮에 투표로 제거하세요'
    },
    citizen: {
      name: '시민',
      emoji: '👤',
      color: 'from-gray-600 to-slate-600',
      description: '특별한 능력은 없지만 투표권이 있습니다',
      goal: '토론에 참여하고 마피아를 찾아내세요'
    }
  };

  // 실시간 게임 상태 구독 (멀티플레이어 모드)
  useEffect(() => {
    if (!game || gameMode !== 'multiplayer') return;

    const gameChannel = supabase
      .channel(`game:${game.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mafia_games',
        filter: `id=eq.${game.id}`
      }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setGame(payload.new as Game);
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mafia_game_players',
        filter: `game_id=eq.${game.id}`
      }, () => {
        loadPlayers(game.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
    };
  }, [game?.id, gameMode]);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // ===== AI 모드 시작 =====
  const startAIGame = () => {
    if (!playerName.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }

    // AI 플레이어 생성
    const totalPlayers = playerCount;
    const aiPlayerCount = totalPlayers - 1;
    
    const shuffledAiNames = [...aiNames].sort(() => Math.random() - 0.5);
    
    const newPlayers: Player[] = [
      {
        id: 1,
        player_name: playerName,
        role: null,
        is_alive: true,
        player_order: 1,
        is_ai: false
      },
      ...Array.from({ length: aiPlayerCount }, (_, i) => ({
        id: i + 2,
        player_name: shuffledAiNames[i] || `AI ${i + 1}`,
        role: null,
        is_alive: true,
        player_order: i + 2,
        is_ai: true
      }))
    ];

    // 역할 배정
    const roles = ['mafia', 'mafia', 'doctor', 'police', 'citizen', 'citizen', 'citizen', 'citizen', 'citizen', 'citizen'];
    const shuffledRoles = roles.slice(0, totalPlayers).sort(() => Math.random() - 0.5);
    
    newPlayers.forEach((player, index) => {
      player.role = shuffledRoles[index];
    });

    setAiPlayers(newPlayers);
    setMyRole(newPlayers[0].role);
    setAiGameLog([
      '🎮 게임이 시작되었습니다!',
      `🎭 총 ${totalPlayers}명 중 마피아 2명, 의사 1명, 경찰 1명`,
      '🌙 1번째 밤이 되었습니다.'
    ]);
    setAiPhase('night');
    setAiRound(1);
    setActionUsed(false);
    setSelectedTarget(null);
    setMode('game');
  };

  // AI 행동 로직 (개선됨)
  const getAIAction = (aiPlayer: Player, alivePlayers: Player[]): Player | null => {
    const otherPlayers = alivePlayers.filter(p => p.id !== aiPlayer.id);
    
    if (otherPlayers.length === 0) return null;

    // 난이도별 전략
    if (aiDifficulty === 'easy') {
      // 쉬움: 완전 랜덤
      return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    } else if (aiDifficulty === 'normal') {
      // 보통: 마피아면 비마피아 타겟, 그 외는 랜덤
      if (aiPlayer.role === 'mafia') {
        const nonMafia = otherPlayers.filter(p => p.role !== 'mafia');
        if (nonMafia.length > 0) {
          return nonMafia[Math.floor(Math.random() * nonMafia.length)];
        }
      }
      return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    } else {
      // 어려움: 전략적 타겟팅
      if (aiPlayer.role === 'mafia') {
        const nonMafia = otherPlayers.filter(p => p.role !== 'mafia');
        if (nonMafia.length > 0) {
          // 특수 직업 우선 제거
          const special = nonMafia.filter(p => p.role === 'doctor' || p.role === 'police');
          if (special.length > 0) {
            return special[0]; // 첫 번째 특수 직업
          }
          // 사용자 우선
          const user = nonMafia.find(p => !p.is_ai);
          if (user) return user;
          
          return nonMafia[0];
        }
      }
      // 의사/경찰은 랜덤하게 보호/조사
      return otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    }
  };

  const performNightAction = () => {
    if (!selectedTarget || actionUsed) return;

    const me = aiPlayers.find(p => p.player_name === playerName);
    if (!me || !me.is_alive) return;

    const target = aiPlayers.find(p => p.id === selectedTarget);
    if (!target) return;

    let actionLog = '';
    
    if (me.role === 'doctor') {
      actionLog = `💊 ${target.player_name}님을 보호했습니다.`;
    } else if (me.role === 'police') {
      const result = target.role === 'mafia' ? '마피아입니다! 🚨' : '마피아가 아닙니다. ✅';
      actionLog = `👮 ${target.player_name}님을 조사했습니다. → ${result}`;
    } else if (me.role === 'mafia') {
      actionLog = `🔪 ${target.player_name}님을 공격 대상으로 지목했습니다.`;
    }

    setAiGameLog(prev => [...prev, actionLog]);
    setActionUsed(true);
    setSelectedTarget(null);
  };

  const aiNextPhase = () => {
    if (aiPhase === 'night') {
      // 밤 → 낮: AI들의 행동 처리
      const alivePlayers = aiPlayers.filter(p => p.is_alive);
      const aiAlivePlayers = alivePlayers.filter(p => p.is_ai);
      
      let killed: Player | null = null;
      const protectedPlayers: Player[] = [];
      const newLogs: string[] = [];

      // AI 의사 행동
      const aiDoctors = aiAlivePlayers.filter(p => p.role === 'doctor');
      aiDoctors.forEach(doctor => {
        const target = getAIAction(doctor, alivePlayers);
        if (target) {
          protectedPlayers.push(target);
          newLogs.push(`💊 AI 의사가 누군가를 보호했습니다...`);
        }
      });

      // AI 경찰 행동
      const aiPolice = aiAlivePlayers.filter(p => p.role === 'police');
      aiPolice.forEach(police => {
        const target = getAIAction(police, alivePlayers);
        if (target) {
          newLogs.push(`👮 AI 경찰이 조사를 진행했습니다...`);
        }
      });

      // AI 마피아 행동
      const aiMafias = aiAlivePlayers.filter(p => p.role === 'mafia');
      if (aiMafias.length > 0) {
        const mafia = aiMafias[0];
        const target = getAIAction(mafia, alivePlayers);
        
        if (target && !protectedPlayers.some(p => p.id === target.id)) {
          killed = target;
        }
        newLogs.push(`🔪 마피아가 움직였습니다...`);
      }

      // 결과 적용
      let updatedPlayers = [...aiPlayers];
      
      if (killed) {
        updatedPlayers = updatedPlayers.map(p =>
          p.id === killed!.id ? { ...p, is_alive: false } : p
        );
        
        const roleName = roleInfo[killed.role as keyof typeof roleInfo]?.name || '시민';
        newLogs.push(`☀️ ${aiRound}번째 낮이 되었습니다.`);
        newLogs.push(`💀 ${killed.player_name}(${roleName})님이 밤에 제거되었습니다.`);
      } else {
        newLogs.push(`☀️ ${aiRound}번째 낮이 되었습니다.`);
        newLogs.push(`✨ 다행히도 아무도 죽지 않았습니다!`);
      }

      setAiPlayers(updatedPlayers);
      setAiGameLog(prev => [...prev, ...newLogs]);
      setAiPhase('day');
      setActionUsed(false);
      setVotingMode(true);
      setVotes({});
      
      checkAIWinCondition(updatedPlayers);
    } else {
      // 낮 → 밤
      setAiRound(aiRound + 1);
      setAiPhase('night');
      setAiGameLog(prev => [...prev, `🌙 ${aiRound + 1}번째 밤이 되었습니다.`]);
      setActionUsed(false);
      setVotingMode(false);
    }
  };

  const votePlayer = (targetId: number) => {
    const newVotes = { ...votes };
    newVotes[targetId] = (newVotes[targetId] || 0) + 1;
    setVotes(newVotes);

    // AI들도 투표
    const alivePlayers = aiPlayers.filter(p => p.is_alive);
    const aiAlivePlayers = alivePlayers.filter(p => p.is_ai);
    
    aiAlivePlayers.forEach(ai => {
      const target = getAIAction(ai, alivePlayers);
      if (target) {
        newVotes[target.id] = (newVotes[target.id] || 0) + 1;
      }
    });

    // 최다 득표자 찾기
    let maxVotes = 0;
    let eliminated: number | null = null;
    
    Object.entries(newVotes).forEach(([playerId, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        eliminated = parseInt(playerId);
      }
    });

    if (eliminated) {
      eliminateAIPlayer(eliminated);
    }
    
    setVotingMode(false);
  };

  const eliminateAIPlayer = (playerId: number) => {
    const player = aiPlayers.find(p => p.id === playerId);
    if (!player) return;

    const updatedPlayers = aiPlayers.map(p =>
      p.id === playerId ? { ...p, is_alive: false } : p
    );
    setAiPlayers(updatedPlayers);

    const roleName = roleInfo[player.role as keyof typeof roleInfo]?.name || '시민';

    setAiGameLog(prev => [
      ...prev, 
      `🗳️ 투표 결과: ${player.player_name}(${roleName})님이 제거되었습니다.`
    ]);
    
    checkAIWinCondition(updatedPlayers);
  };

  const checkAIWinCondition = (currentPlayers: Player[]) => {
    const alivePlayers = currentPlayers.filter(p => p.is_alive);
    const aliveMafia = alivePlayers.filter(p => p.role === 'mafia').length;
    const aliveCitizens = alivePlayers.filter(p => p.role !== 'mafia').length;

    if (aliveMafia === 0) {
      setAiGameLog(prev => [...prev, '🎉 시민팀 승리! 모든 마피아를 찾아냈습니다!']);
      setTimeout(() => {
        if (confirm('🎉 시민팀 승리!\n\n다시 플레이하시겠습니까?')) {
          resetGame();
        }
      }, 500);
    } else if (aliveMafia >= aliveCitizens) {
      setAiGameLog(prev => [...prev, '😈 마피아팀 승리! 마피아가 시민을 지배했습니다!']);
      setTimeout(() => {
        if (confirm('😈 마피아팀 승리!\n\n다시 플레이하시겠습니까?')) {
          resetGame();
        }
      }, 500);
    }
  };

  // ===== 멀티플레이어 모드 =====
  const createRoom = async () => {
    if (!playerName.trim()) {
      alert('이름을 입력해주세요!');
      return;
    }

    const code = generateRoomCode();
    
    const { data: gameData, error: gameError } = await supabase
      .from('mafia_games')
      .insert({
        room_code: code,
        host_name: playerName,
        player_count: playerCount,
        status: 'waiting'
      })
      .select()
      .single();

    if (gameError) {
      alert('방 생성 실패: ' + gameError.message);
      return;
    }

    const { error: playerError } = await supabase
      .from('mafia_game_players')
      .insert({
        game_id: gameData.id,
        player_name: playerName,
        player_order: 1
      });

    if (playerError) {
      alert('플레이어 추가 실패: ' + playerError.message);
      return;
    }

    setGame(gameData);
    setRoomCode(code);
    setIsHost(true);
    setMode('waiting');
    await loadPlayers(gameData.id);
  };

  const joinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
      alert('이름과 방 코드를 입력해주세요!');
      return;
    }

    const { data: gameData, error: gameError } = await supabase
      .from('mafia_games')
      .select()
      .eq('room_code', roomCode.toUpperCase())
      .single();

    if (gameError || !gameData) {
      alert('방을 찾을 수 없습니다!');
      return;
    }

    if (gameData.status !== 'waiting') {
      alert('이미 시작된 게임입니다!');
      return;
    }

    const { data: existingPlayers } = await supabase
      .from('mafia_game_players')
      .select()
      .eq('game_id', gameData.id);

    if (existingPlayers && existingPlayers.length >= gameData.player_count) {
      alert('방이 가득 찼습니다!');
      return;
    }

    const { error: playerError } = await supabase
      .from('mafia_game_players')
      .insert({
        game_id: gameData.id,
        player_name: playerName,
        player_order: (existingPlayers?.length || 0) + 1
      });

    if (playerError) {
      alert('참가 실패: ' + playerError.message);
      return;
    }

    setGame(gameData);
    setIsHost(false);
    setMode('waiting');
    await loadPlayers(gameData.id);
  };

  const loadPlayers = async (gameId: number) => {
    const { data, error } = await supabase
      .from('mafia_game_players')
      .select()
      .eq('game_id', gameId)
      .order('player_order', { ascending: true });

    if (error) {
      console.error('플레이어 로드 실패:', error);
      return;
    }

    setPlayers(data || []);
    
    const myPlayer = data?.find(p => p.player_name === playerName);
    if (myPlayer && myPlayer.role) {
      setMyRole(myPlayer.role);
    }
  };

  const startGame = async () => {
    if (!game || !isHost) return;

    const roles = ['mafia', 'mafia', 'doctor', 'police', 'citizen', 'citizen', 'citizen', 'citizen', 'citizen', 'citizen'];
    const shuffledRoles = roles.slice(0, game.player_count).sort(() => Math.random() - 0.5);

    for (let i = 0; i < players.length; i++) {
      await supabase
        .from('mafia_game_players')
        .update({ role: shuffledRoles[i] })
        .eq('id', players[i].id);
    }

    await supabase
      .from('mafia_games')
      .update({
        status: 'playing',
        game_log: ['🎮 게임이 시작되었습니다!', '🌙 1번째 밤이 되었습니다.']
      })
      .eq('id', game.id);

    await loadPlayers(game.id);
  };

  const nextPhase = async () => {
    if (!game || !isHost) return;

    const newPhase = game.phase === 'night' ? 'day' : 'night';
    const newRound = newPhase === 'night' ? game.round + 1 : game.round;
    const newLog = [
      ...game.game_log,
      newPhase === 'day' 
        ? `☀️ ${game.round}번째 낮이 되었습니다.`
        : `🌙 ${newRound}번째 밤이 되었습니다.`
    ];

    await supabase
      .from('mafia_games')
      .update({
        phase: newPhase,
        round: newRound,
        game_log: newLog
      })
      .eq('id', game.id);
  };

  const eliminatePlayer = async (playerId: number) => {
    if (!game || !isHost) return;

    const player = players.find(p => p.id === playerId);
    if (!player) return;

    await supabase
      .from('mafia_game_players')
      .update({ is_alive: false })
      .eq('id', playerId);

    const roleName = roleInfo[player.role as keyof typeof roleInfo]?.name || '시민';

    await supabase
      .from('mafia_games')
      .update({
        game_log: [...game.game_log, `💀 ${player.player_name}(${roleName})님이 제거되었습니다.`]
      })
      .eq('id', game.id);

    await loadPlayers(game.id);
  };

  useEffect(() => {
    if (game && game.status === 'playing' && gameMode === 'multiplayer') {
      setMode('game');
    }
  }, [game?.status, gameMode]);

  const resetGame = () => {
    setMode('menu');
    setGameMode('multiplayer');
    setGame(null);
    setPlayers([]);
    setAiPlayers([]);
    setMyRole(null);
    setIsHost(false);
    setAiPhase('night');
    setAiRound(1);
    setAiGameLog([]);
    setVotingMode(false);
    setVotes({});
    setActionUsed(false);
    setSelectedTarget(null);
  };

  const currentPlayers = gameMode === 'ai' ? aiPlayers : players;
  const currentPhase = gameMode === 'ai' ? aiPhase : game?.phase;
  const currentRound = gameMode === 'ai' ? aiRound : game?.round;
  const currentGameLog = gameMode === 'ai' ? aiGameLog : game?.game_log || [];

  const alivePlayers = currentPlayers.filter(p => p.is_alive);
  const aliveMafia = alivePlayers.filter(p => p.role === 'mafia').length;
  const aliveCitizens = alivePlayers.filter(p => p.role !== 'mafia').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-black py-8 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            🕵️ 마피아 게임
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            친구들과 함께 또는 AI와 대결
          </p>
        </div>

        {/* 메인 메뉴 */}
        {mode === 'menu' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🎮 게임 모드 선택
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setGameMode('multiplayer');
                    setMode('selectMode');
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-6 rounded-xl font-bold text-xl transition-all shadow-lg hover:scale-105"
                >
                  👥 친구와 플레이 (온라인)
                </button>

                <button
                  onClick={() => {
                    setGameMode('ai');
                    setMode('selectAI');
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-6 rounded-xl font-bold text-xl transition-all shadow-lg hover:scale-105"
                >
                  🤖 AI와 플레이 (혼자서)
                </button>
              </div>

              <div className="mt-8 bg-gray-900/50 rounded-xl p-4">
                <h3 className="text-white font-bold mb-3 text-sm">📚 게임 규칙</h3>
                <ul className="text-gray-400 text-xs md:text-sm space-y-2">
                  <li>• <span className="text-red-400">마피아</span>는 밤에 시민을 제거합니다</li>
                  <li>• <span className="text-green-400">의사</span>는 밤에 한 명을 보호합니다</li>
                  <li>• <span className="text-blue-400">경찰</span>은 밤에 한 명을 조사합니다</li>
                  <li>• <span className="text-gray-300">시민</span>은 낮에 토론하고 투표합니다</li>
                  <li>• 마피아를 모두 찾으면 <span className="text-yellow-400">시민팀 승리!</span></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* AI 난이도 선택 */}
        {mode === 'selectAI' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🤖 AI 난이도 선택
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => setAiDifficulty('easy')}
                  className={`w-full px-6 py-6 rounded-xl font-bold text-xl transition-all shadow-lg hover:scale-105 ${
                    aiDifficulty === 'easy'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white ring-4 ring-green-300'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">😊</div>
                  쉬움
                  <div className="text-sm mt-2 opacity-80">AI가 랜덤하게 행동합니다</div>
                </button>

                <button
                  onClick={() => setAiDifficulty('normal')}
                  className={`w-full px-6 py-6 rounded-xl font-bold text-xl transition-all shadow-lg hover:scale-105 ${
                    aiDifficulty === 'normal'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white ring-4 ring-yellow-300'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">🤔</div>
                  보통
                  <div className="text-sm mt-2 opacity-80">AI가 기본 전략을 사용합니다</div>
                </button>

                <button
                  onClick={() => setAiDifficulty('hard')}
                  className={`w-full px-6 py-6 rounded-xl font-bold text-xl transition-all shadow-lg hover:scale-105 ${
                    aiDifficulty === 'hard'
                      ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white ring-4 ring-red-300'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">😈</div>
                  어려움
                  <div className="text-sm mt-2 opacity-80">AI가 전략적으로 플레이합니다</div>
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-white font-bold mb-2 block">닉네임</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="닉네임 입력"
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="text-white font-bold mb-2 block">
                    총 인원: {playerCount}명 (나 + AI {playerCount - 1}명)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5명</span>
                    <span>10명</span>
                  </div>
                </div>

                <button
                  onClick={startAIGame}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:scale-105"
                >
                  🎮 게임 시작
                </button>

                <button
                  onClick={() => setMode('menu')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  ← 뒤로
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 멀티플레이어 선택 */}
        {mode === 'selectMode' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                👥 온라인 모드
              </h2>

              <div className="space-y-4">
                <button
                  onClick={() => setMode('create')}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-6 rounded-xl font-bold text-xl transition-all shadow-lg hover:scale-105"
                >
                  🏠 방 만들기
                </button>

                <button
                  onClick={() => setMode('join')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-6 rounded-xl font-bold text-xl transition-all shadow-lg hover:scale-105"
                >
                  🚪 방 참가하기
                </button>

                <button
                  onClick={() => setMode('menu')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  ← 뒤로
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 방 만들기 */}
        {mode === 'create' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🏠 방 만들기
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-white font-bold mb-2 block">닉네임</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="닉네임 입력"
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="text-white font-bold mb-2 block">
                    최대 인원: {playerCount}명
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="10"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5명</span>
                    <span>10명</span>
                  </div>
                </div>

                <button
                  onClick={createRoom}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:scale-105"
                >
                  🎮 방 만들기
                </button>

                <button
                  onClick={() => setMode('selectMode')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  ← 뒤로
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 방 참가하기 */}
        {mode === 'join' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🚪 방 참가하기
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-white font-bold mb-2 block">닉네임</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="닉네임 입력"
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="text-white font-bold mb-2 block">방 코드</label>
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="6자리 코드 입력"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-center text-2xl font-bold tracking-widest"
                    style={{ fontSize: '24px' }}
                  />
                </div>

                <button
                  onClick={joinRoom}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:scale-105"
                >
                  🚪 참가하기
                </button>

                <button
                  onClick={() => setMode('selectMode')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
                >
                  ← 뒤로
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 대기실 (멀티플레이어 전용) */}
        {mode === 'waiting' && game && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                🏠 대기실
              </h2>

              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-center mb-6">
                <p className="text-white/80 text-sm mb-2">방 코드</p>
                <p className="text-4xl font-black text-white tracking-widest">
                  {game.room_code}
                </p>
                <p className="text-white/80 text-xs mt-2">친구들에게 이 코드를 알려주세요!</p>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
                <h3 className="text-white font-bold mb-3">
                  👥 참가자 ({players.length}/{game.player_count})
                </h3>
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <div
                      key={player.id}
                      className="bg-gray-800 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-white font-bold">
                        {index === 0 && '👑 '}
                        {player.player_name}
                      </span>
                      {player.player_name === playerName && (
                        <span className="text-green-400 text-sm font-bold">나</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {isHost ? (
                <button
                  onClick={startGame}
                  disabled={players.length < 5}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                >
                  🎮 게임 시작 {players.length < 5 && `(최소 5명 필요)`}
                </button>
              ) : (
                <div className="text-center text-gray-400 py-4 bg-gray-900/30 rounded-xl">
                  ⏳ 방장이 게임을 시작하길 기다리는 중...
                </div>
              )}
            </div>
          </div>
        )}

        {/* 게임 화면 (공통) */}
        {mode === 'game' && (
          <div className="space-y-6">
            {/* 상단 정보 바 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 난이도 표시 (AI 모드일 때만) */}
              {gameMode === 'ai' && (
                <div className={`rounded-xl p-4 text-center col-span-2 ${
                  aiDifficulty === 'easy' ? 'bg-green-900/30 border-2 border-green-500' :
                  aiDifficulty === 'normal' ? 'bg-yellow-900/30 border-2 border-yellow-500' :
                  'bg-red-900/30 border-2 border-red-500'
                }`}>
                  <p className="text-white font-bold">
                    AI 난이도: {
                      aiDifficulty === 'easy' ? '😊 쉬움' :
                      aiDifficulty === 'normal' ? '🤔 보통' :
                      '😈 어려움'
                    }
                  </p>
                </div>
              )}

              {/* 승리 조건 */}
              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-4 border-2 border-blue-500">
                <p className="text-blue-300 text-xs mb-1">시민팀</p>
                <p className="text-white font-bold text-2xl">{aliveCitizens}명</p>
              </div>
              <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 rounded-xl p-4 border-2 border-red-500">
                <p className="text-red-300 text-xs mb-1">마피아팀</p>
                <p className="text-white font-bold text-2xl">{aliveMafia}명</p>
              </div>
            </div>

            {/* 내 역할 */}
            {myRole && (
              <div className={`bg-gradient-to-br ${roleInfo[myRole as keyof typeof roleInfo]?.color} rounded-2xl p-6 text-center border-2 border-white/30 shadow-2xl`}>
                <p className="text-white/80 text-sm mb-2">내 역할</p>
                <div className="text-6xl mb-3">
                  {roleInfo[myRole as keyof typeof roleInfo]?.emoji}
                </div>
                <p className="text-2xl font-black text-white mb-2">
                  {roleInfo[myRole as keyof typeof roleInfo]?.name}
                </p>
                <p className="text-white/90 text-sm mb-3">
                  {roleInfo[myRole as keyof typeof roleInfo]?.description}
                </p>
                <button
                  onClick={() => setShowRoleInfo(!showRoleInfo)}
                  className="text-white/70 text-xs hover:text-white transition-colors underline"
                >
                  {showRoleInfo ? '숨기기 ▲' : '목표 보기 ▼'}
                </button>
                {showRoleInfo && (
                  <div className="mt-3 bg-black/20 rounded-lg p-3">
                    <p className="text-white/90 text-sm">
                      {roleInfo[myRole as keyof typeof roleInfo]?.goal}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 현재 페이즈 */}
            <div className={`rounded-2xl p-6 text-center ${
              currentPhase === 'night' 
                ? 'bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500' 
                : 'bg-gradient-to-br from-yellow-600 to-orange-600 border-2 border-yellow-300'
            }`}>
              <div className="text-6xl mb-3">{currentPhase === 'night' ? '🌙' : '☀️'}</div>
              <h2 className="text-3xl font-black text-white mb-2">
                {currentPhase === 'night' ? `${currentRound}번째 밤` : `${currentRound}번째 낮`}
              </h2>
              <p className="text-white/80 text-sm">
                {currentPhase === 'night' ? '특수 직업은 행동하세요' : '토론하고 투표하세요'}
              </p>
            </div>

            {/* 밤 행동 (AI 모드 + 특수 직업) */}
            {gameMode === 'ai' && currentPhase === 'night' && myRole && myRole !== 'citizen' && !actionUsed && (
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border-2 border-purple-500">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  {roleInfo[myRole as keyof typeof roleInfo]?.emoji} 밤 행동
                </h3>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  {myRole === 'mafia' && '제거할 대상을 선택하세요'}
                  {myRole === 'doctor' && '보호할 대상을 선택하세요'}
                  {myRole === 'police' && '조사할 대상을 선택하세요'}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {alivePlayers
                    .filter(p => p.player_name !== playerName)
                    .map(player => (
                      <button
                        key={player.id}
                        onClick={() => setSelectedTarget(player.id)}
                        className={`rounded-lg px-4 py-3 text-center font-bold transition-all ${
                          selectedTarget === player.id
                            ? 'bg-purple-600 text-white ring-2 ring-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {player.is_ai && '🤖 '}
                        {player.player_name}
                      </button>
                    ))}
                </div>
                <button
                  onClick={performNightAction}
                  disabled={!selectedTarget}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✅ 행동 확정
                </button>
              </div>
            )}

            {/* 투표 (AI 모드 + 낮) */}
            {gameMode === 'ai' && votingMode && (
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl p-6 border-2 border-orange-500">
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  🗳️ 투표 시간
                </h3>
                <p className="text-gray-300 text-sm mb-4 text-center">
                  제거할 사람을 선택하세요
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {alivePlayers.map(player => (
                    <button
                      key={player.id}
                      onClick={() => votePlayer(player.id)}
                      className="rounded-lg px-4 py-3 text-center font-bold bg-gray-700 text-white hover:bg-red-600 transition-all"
                    >
                      {player.is_ai && '🤖 '}
                      {player.player_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 플레이어 목록 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">
                👥 생존자 ({alivePlayers.length}명)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {alivePlayers.map(player => (
                  <div
                    key={player.id}
                    className={`rounded-lg px-4 py-3 text-center font-bold flex items-center justify-between ${
                      player.player_name === playerName
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white ring-2 ring-green-300'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <span className="flex-1">
                      {player.is_ai && '🤖 '}
                      {player.player_name}
                    </span>
                    {(isHost || gameMode === 'ai') && !votingMode && (
                      <button
                        onClick={() => {
                          if (gameMode === 'ai') {
                            eliminateAIPlayer(player.id);
                          } else {
                            eliminatePlayer(player.id);
                          }
                        }}
                        className="ml-2 text-xs text-red-300 hover:text-red-100 hover:scale-110 transition-transform"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 죽은 플레이어 */}
              {currentPlayers.filter(p => !p.is_alive).length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h4 className="text-sm font-bold text-gray-400 mb-3">
                    ⚰️ 제거됨 ({currentPlayers.filter(p => !p.is_alive).length}명)
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {currentPlayers.filter(p => !p.is_alive).map(player => (
                      <div
                        key={player.id}
                        className="rounded-lg px-4 py-2 text-center bg-gray-900 text-gray-500 opacity-50"
                      >
                        {player.is_ai && '🤖 '}
                        {player.player_name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 게임 로그 */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">📜 게임 로그</h3>
              <div className="bg-black/30 rounded-xl p-4 max-h-60 overflow-y-auto space-y-2">
                {currentGameLog.length === 0 ? (
                  <p className="text-gray-500 text-center">아직 기록이 없습니다</p>
                ) : (
                  currentGameLog.map((log, index) => (
                    <div key={index} className="text-gray-300 text-sm py-1 border-b border-gray-800 last:border-0">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 컨트롤 */}
            <div className="flex gap-3">
              <button
                onClick={resetGame}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                🏠 나가기
              </button>
              {(isHost || gameMode === 'ai') && !votingMode && (
                <button
                  onClick={gameMode === 'ai' ? aiNextPhase : nextPhase}
                  className="flex-[2] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:scale-105"
                >
                  {currentPhase === 'night' ? '☀️ 낮으로 →' : '🌙 밤으로 →'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* 돌아가기 */}
        {mode !== 'game' && (
          <div className="text-center mt-8">
            <Link href="/" className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-bold transition-all border border-gray-700 hover:scale-105">
              메인으로 돌아가기
            </Link>
          </div>
        )}

      {/* 제작자 서명 */}
      <AppFooter />
      </div>
    </div>
  );
}
