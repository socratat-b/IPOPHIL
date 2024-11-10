/**
 * Extends JSX namespace to add type definitions for the `lottie-player` custom element.
 * 
 * The `lottie-player` element is a web component commonly used to render Lottie animations.
 * This type definition ensures TypeScript recognizes the element and its properties
 * without throwing errors for missing types, providing better type safety and
 * developer experience within React and TypeScript projects.
 */

declare namespace JSX {
    interface IntrinsicElements {
        /**
         * `lottie-player`: A custom HTML element for rendering Lottie animations.
         *
         * Props:
         * - `autoplay` (boolean): If true, the animation starts playing automatically.
         * - `controls` (boolean): If true, displays playback controls on the player.
         * - `loop` (boolean): If true, the animation will loop when it reaches the end.
         * - `mode` (string): Defines the rendering mode of the animation (e.g., "normal", "bounce").
         * - `src` (string): URL or path to the Lottie JSON animation file.
         * - `title` (string): Title for accessibility; provides a text alternative.
         * - `className` (string): Allows styling with custom CSS classes.
         *
         * Example usage:
         * ```tsx
         * <lottie-player
         *    id="animation"
         *    autoplay
         *    controls={false}
         *    loop
         *    mode="normal"
         *    src="path/to/animation.json"
         *    className="w-1/2 mx-auto"
         *    title="Sample Animation"
         * />
         * ```
         */
        "lottie-player": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            autoplay?: boolean;
            controls?: boolean;
            loop?: boolean;
            mode?: string;
            src?: string;
            title?: string;
            className?: string;
        };
    }
}
