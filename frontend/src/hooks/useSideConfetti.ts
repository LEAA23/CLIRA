import confetti from "canvas-confetti";

export type sideConfettiType = {
    duration?: number;
    colors?: string[];
    particleCount?: number;
    spread?: number;
};

function useSideConfetti({
    duration = 100000,
    colors = ["#bb0000", "#ffffff"],
    particleCount = 2,
    spread = 55
}: sideConfettiType = {}) {

    const fire = () => {
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount,
                angle: 60,
                spread,
                origin: { x: 0 },
                colors
            });

            confetti({
                particleCount,
                angle: 120,
                spread,
                origin: { x: 1 },
                colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    };

    return fire;
}

export default useSideConfetti;