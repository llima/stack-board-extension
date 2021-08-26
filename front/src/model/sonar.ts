export interface ISonarComponent {
    key: string;
    name: string;
    branches: ISonarBranch[];
}

export interface ISonarBranch {
    name: string;
    isMain: boolean;
    type: string;
    analysisDate: Date;
    status: any;
    measures: ISonarMeasure[]
    isShow: boolean;
    link: string;
}

export interface ISonarMeasure {
    metric: string;
    value: string;
}



 