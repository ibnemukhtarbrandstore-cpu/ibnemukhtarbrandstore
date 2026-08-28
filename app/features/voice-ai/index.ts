// Voice AI module deactivated
export default function VoiceWidget() { return null; }
export function PageVoiceGuide() { return null; }
export function useNativeVoice() { return { isSpeaking: false, speak: () => {}, stop: () => {} }; }
export function usePageContext() { return {}; }
export function useAIVoice() { return {}; }
export function useCheckoutVoice() { return {}; }
export function usePaymentVoice() { return {}; }
