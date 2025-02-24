export interface Game {
    id: string;
    players: Player[];
    finished: boolean;
    round: number;
    isPrivate: boolean;
}

export interface Player {
    name: string;
    currentWord?: string;
    history?: string[]
}

