import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { AiFillBug } from "react-icons/ai";
import { FaRadiationAlt } from "react-icons/fa";
import { GiCheckedShield, GiPadlock } from "react-icons/gi";
import { ISonarBranch,  ISonarMeasure } from "../../model/sonar";


export const projectsMock =
    [
        {
            Title: "Eleven.Service.Mail",
            status: "passed",
            Props: [
                {
                    label: "Bugs",
                    value: 1,
                    status: "C",
                    icon: <AiFillBug className="icon-tools" />

                },
                {
                    label: "Vulnerabilities",
                    value: 0,
                    status: "A",
                    icon: <GiPadlock className="icon-tools" />
                },
                {
                    label: "Hotspots",
                    value: "0.0%",
                    status: "E",
                    icon: <GiCheckedShield className="icon-tools" />
                },
                {
                    label: "Code Smells",
                    value: 14,
                    status: "A",
                    icon: <FaRadiationAlt className="icon-tools" />
                },
                {
                    label: "Coverage",
                    value: "0.0%"
                },
                {
                    label: "Duplications",
                    value: "2.7%"
                },
                {
                    label: "Lines",
                    value: "1.1k",
                    status: "S"
                }
            ]
        }
    ]

export function renderBranchStatus(branch: ISonarBranch, className?: string) {

    if(!branch)
        return <Status {...Statuses.Canceled} className={className} size={StatusSize.l} />;

    if (branch.status.qualityGateStatus === "ERROR")
        return <Status {...Statuses.Failed} className={className} size={StatusSize.l} />;
    else
        return <Status {...Statuses.Success} className={className} size={StatusSize.l} />;

};

export function configureMeasure(measure: ISonarMeasure): any {

    switch (measure.metric) {
        case "vulnerabilities":
            return {
                label: "Vulnerabilities",
                value: measure.value,
                status: "A",
                icon: <GiPadlock className="icon-tools" />
            };

        case "bugs":
            return {
                label: "Bugs",
                value: measure.value,
                status: "C",
                icon: <AiFillBug className="icon-tools" />
            };

        case "security_hotspots_reviewed":
            return {
                label: "Hotspots",
                value: measure.value + "%",
                status: "E",
                icon: <GiCheckedShield className="icon-tools" />
            };

        case "code_smells":
            return {
                label: "Code Smells",
                value: measure.value,
                status: "A",
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