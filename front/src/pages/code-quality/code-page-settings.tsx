import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { AiFillBug } from "react-icons/ai";
import { FaRadiationAlt } from "react-icons/fa";
import { GiCheckedShield, GiPadlock } from "react-icons/gi";
import { ISonarBranch, ISonarMeasure } from "../../model/sonar";


export function renderBranchStatus(branch: ISonarBranch, className?: string) {

    if (!branch)
        return <Status {...Statuses.Canceled} className={className} size={StatusSize.l} />;

    if (branch.status.qualityGateStatus === "ERROR")
        return <Status {...Statuses.Failed} className={className} size={StatusSize.l} />;
    else
        return <Status {...Statuses.Success} className={className} size={StatusSize.l} />;

};

export function configureMeasure(measure: ISonarMeasure, measures: ISonarMeasure[]): any {

    var status: string = "";
    var ratings: ISonarMeasure[] = [];
    
    switch (measure.metric) {

        case "vulnerabilities":
            ratings = measures.filter(d => d.metric === "security_rating");
            if (ratings.length > 0)
                status = ratings[0].value.replace(".0", "");
            return {
                label: "Vulnerabilities",
                value: measure.value,
                status: status,
                icon: <GiPadlock className="icon-tools" />
            };

        case "bugs":
            ratings = measures.filter(d => d.metric === "reliability_rating");
            if (ratings.length > 0)
                status = ratings[0].value.replace(".0", "");
            return {
                label: "Bugs",
                value: measure.value,
                status: status,
                icon: <AiFillBug className="icon-tools" />
            };

        case "security_hotspots_reviewed":
            ratings = measures.filter(d => d.metric === "security_review_rating");
            if (ratings.length > 0)
                status = ratings[0].value.replace(".0", "");
            return {
                label: "Hotspots",
                value: measure.value + "%",
                status: status,
                icon: <GiCheckedShield className="icon-tools" />
            };

        case "code_smells":
            ratings = measures.filter(d => d.metric === "sqale_rating");
            if (ratings.length > 0)
                status = ratings[0].value.replace(".0", "");
            return {
                label: "Code Smells",
                value: measure.value,
                status: status,
                icon: <FaRadiationAlt className="icon-tools" />
            };

        case "coverage":
            return {
                label: "Coverage",
                value: measure.value + "%",
            };


        case "duplicated_lines_density":
            return {
                label: "Duplications",
                value: measure.value + "%",
            };

        default:
            return null;
    }
};