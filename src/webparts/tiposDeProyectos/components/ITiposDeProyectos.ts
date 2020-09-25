export interface ITiposDeProyectosState {
    items: ITiposDeProyectosItems[];
    disabled?: boolean;
    selectionDetails: string;
}

export interface ITiposDeProyectosItems {
    key: number;
    id: number;
    title: string;
}