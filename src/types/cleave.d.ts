declare module "cleave.js/react" {
    import * as React from "react";

    interface CleaveOptions {
        delimiters?: string[];
        blocks?: number[];
        numericOnly?: boolean;
        [key: string]: any;
    }

    interface CleaveProps extends React.InputHTMLAttributes<HTMLInputElement> {
        options: CleaveOptions;
        value?: string;
        onChange?: React.ChangeEventHandler<HTMLInputElement>;
    }

    export default class Cleave extends React.Component<CleaveProps> {}
}