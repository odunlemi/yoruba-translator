import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AppStatus } from "../../App";

export function useTranslation({
  setStatus,
  setYoruba,
  setAudio,
  onComplete,
}: {
  setStatus: (s: AppStatus) => void;
  setYoruba: (t: string) => void;
  setAudio: (a: string) => void;
  onComplete: (en: string, yo: string, audio: string) => void;
}) {
  const runPipelineAction = useMutation(api.transcribeTranslate.run);

  const runPipeline = async (englishText: string) => {
    try {
      setStatus("translating");
      const { yorubaText, audioB64 } = await runPipelineAction({ englishText });
      setYoruba(yorubaText);
      setStatus("synthesising");
      setAudio(audioB64);
      setStatus("ready");
      onComplete(englishText, yorubaText, audioB64);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return { runPipeline };
}
