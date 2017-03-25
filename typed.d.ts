declare module 'react-katex' {
    export function BlockMath(props: {math?: string}): JSX.Element;
    export function InlineMath(props: {math?: string}): JSX.Element;
}
declare module "*.png" {
    var x: string;
    export = x;
}