// src\lib\lottie-player.d.ts
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'lottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src: string;
                autoplay?: boolean;
                loop?: boolean;
                mode?: string;
            };
        }
    }
}

export { };