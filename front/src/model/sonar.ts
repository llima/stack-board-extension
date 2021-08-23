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

export interface ISonarBranch {
    name: string;
    isMain: boolean;
    type: string;
    analysisDate: Date;
    status: any;
}

 