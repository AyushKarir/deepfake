import { create } from "zustand";

interface videogenImageState {
    key: string;
    init_image: string;
    target_image: string;
    reference_image: string;
    webhook: string | null;
    track_id: string | null;
    eta: number;
    results: string[];
}

const useDeepfakeImageSingle = create<{
    state: videogenImageState;
    updateKey: (key: string) => void;
    updateInitImage: (init_image: string) => void;
    updateTargetImage: (target_image: string) => void;
    updateReferenceImage: (reference_image: string) => void;
    updateWebhook: (webhook: string | null) => void;
    updateTrackId: (track_id: string | null) => void;

    updateResults: (results: string[]) => void;
    updateEta: (eta: number) => void;
}>((set) => ({
    state: {
        key: "",
        init_image: "",
        target_image: "",
        reference_image: "",
        webhook: null,
        track_id: null,
        eta: 20,

        results: [],
    },
    updateKey: (key) => set((state) => ({ state: { ...state.state, key } })),
    updateInitImage: (init_image) =>
        set((state) => ({ state: { ...state.state, init_image } })),
    updateTargetImage: (target_image) =>
        set((state) => ({ state: { ...state.state, target_image } })),
    updateReferenceImage: (reference_image) =>
        set((state) => ({ state: { ...state.state, reference_image } })),
    updateWebhook: (webhook) =>
        set((state) => ({ state: { ...state.state, webhook } })),
    updateTrackId: (track_id) =>
        set((state) => ({ state: { ...state.state, track_id } })),

    updateResults: (results) =>
        set((state) => ({ state: { ...state.state, results } })),
    updateEta: (eta) => set((state) => ({ state: { ...state.state, eta } })),
}));

export default useDeepfakeImageSingle;
