export interface ISonarProject {
    components: ISonarComponent[];
}

export interface ISonarComponent {
    key: string;
    name: string;
    qualifier: string;
    isFavorite: boolean;
    analysisDate: Date;
}

 