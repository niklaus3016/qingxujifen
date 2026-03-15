export interface Player {
  id: string;
  name: string;
  isReferee: boolean;
}

export interface Round {
  id: string;
  roundNumber: number;
  timestamp: number;
  scores: Record<string, number>; // playerId -> score
}

export interface Game {
  id: string;
  startTime: number;
  endTime?: number;
  players: Player[];
  rounds: Round[];
}

export type AppState = 'PRIVACY' | 'MAIN';
export type Tab = 'HOME' | 'HISTORY';
