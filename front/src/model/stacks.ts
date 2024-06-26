import { TestImages } from "@fluentui/example-data";
import { IChoiceGroupOption } from "@fluentui/react";

export interface IStack {
    id: number;
    text: string;
}

export const StackValues: IStack[] = [
    {
        id: 1,
        text: "C#"
    },
    {
        id: 2,
        text: "API"
    },
    {
        id: 3,
        text: "React"
    },
    {
        id: 4,
        text: "Type Script"
    },
    {
        id: 5,
        text: "Java"
    },
    {
        id: 6,
        text: "Kotlin"
    },
    {
        id: 7,
        text: "NLayer"
    },
    {
        id: 8,
        text: "VSA"
    }
];

export const DatabaseValues: IChoiceGroupOption[] = [
    {
        key: 'bar',
        imageSrc: TestImages.choiceGroupBarUnselected,
        imageAlt: 'Bar chart icon',
        selectedImageSrc: TestImages.choiceGroupBarSelected,
        imageSize: { width: 32, height: 32 },
        text: 'MongoDB',
    },
    {
        key: 'pie',
        imageSrc: TestImages.choiceGroupBarUnselected,
        selectedImageSrc: TestImages.choiceGroupBarSelected,
        imageSize: { width: 32, height: 32 },
        text: 'SQLServer',
    },
];