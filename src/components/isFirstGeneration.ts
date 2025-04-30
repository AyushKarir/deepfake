import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import confetti from "canvas-confetti";
import { toast } from "sonner";

interface FirstGenerationState {
  isFirstGeneration: boolean;
  setIsFirstGeneration: (value: boolean) => void;
  createConfettiCannons: () => void;
}

export const useFirstGenerationStore = create<FirstGenerationState>()(
  persist(
    (set) => ({
      isFirstGeneration: false, // Default to false

      setIsFirstGeneration: (value: boolean) => {
        set({ isFirstGeneration: value });
      },

      createConfettiCannons: () => {
        // First check if this is already not the first generation
        const state = useFirstGenerationStore.getState();
        if (state.isFirstGeneration) {
          return; // Skip confetti if it's already marked as not first generation
        }

        const end = Date.now() + 3 * 1000; // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

        const frame = () => {
          if (Date.now() > end) return;

          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors: colors,
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors: colors,
          });

          requestAnimationFrame(frame);
        };

        frame();

        toast.success("Congratulations! You've generated your first image!", {
          position: "top-center",
        });

        // Set isFirstGeneration to true when confetti is triggered
        set({ isFirstGeneration: true });
      },
    }),
    {
      name: "first-generation-storage", // name of the item in the storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
