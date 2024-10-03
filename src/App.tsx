import styled from "@emotion/styled";
import { FilesetResolver, LlmInference } from "@mediapipe/tasks-genai";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import logo from "./assets/gemma.svg";

const AppContainer = styled.main({
  display: "flex",
  height: "100%",
  marginTop: -40,
  flexDirection: "column",
  rowGap: 40,
  justifyContent: "center",
  alignItems: "center",
});

const ChatContainer = styled.section({
  display: "flex",
  width: 820,
  flexDirection: "column",
});

const ChatOutput = styled.div({
  minHeight: 200,
  padding: "1em",
  border: "1px solid #000",
  borderBottom: 0,
  borderRadius: "10px 10px 0 0",
  boxSizing: "border-box",
});

const ChatInputContainer = styled.div({
  display: "flex",
  flexDirection: "row",
  borderRadius: "0 0 10px 10px",
  overflow: "hidden",
  border: "1px solid #000000",
});

const ChatInput = styled.input({
  flex: 1,
  outline: "none",
  fontSize: 18,
  padding: "0.4em 1em",
  boxSizing: "border-box",
  border: 0,
});

const ChatInputButton = styled.button({
  cursor: "pointer",
  height: "4em",
  backgroundColor: "#000000",
  color: "#ffffff",
  boxSizing: "border-box",
  "&:hover": {
    backgroundColor: "#333333",
  },
});

function App() {
  const modelFileName = "gemma-1.1-2b-it-gpu-int4.bin";
  const [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  const [submitDisplayText, setSubmitDisplayText] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);
  const [outputText, setOutputText] = useState<string>("");
  const [llmInference, setLlmInference] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const displayPartialResults = useCallback(
    (partialResults: any, complete: boolean) => {
      setOutputText((outputText) => outputText + partialResults);

      if (complete) {
        if (outputRef.current && !outputRef.current.textContent) {
          setOutputText("Result is empty");
        }
        setDisableSubmit(false);
      }
    },
    [outputText, setOutputText]
  );

  const handleOnClick = useCallback(() => {
    if (disableSubmit) return;
    setOutputText("");
    setDisableSubmit(true);
    if (inputRef.current && llmInference) {
      llmInference?.generateResponse(
        inputRef.current.value,
        displayPartialResults
      );
      inputRef.current.value = "";
    }
  }, [setDisableSubmit, disableSubmit, llmInference, inputRef, setOutputText]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        if (disableSubmit || isComposing) return;
        setOutputText("");
        setDisableSubmit(true);
        if (inputRef.current)
          if (inputRef.current && inputRef.current.value && llmInference) {
            llmInference?.generateResponse(
              inputRef.current.value,
              displayPartialResults
            );
            inputRef.current.value = "";
          }
      }
    },
    [
      setDisableSubmit,
      disableSubmit,
      isComposing,
      llmInference,
      inputRef,
      setOutputText,
    ]
  );

  useEffect(() => {
    const initMediapipeLLM = async () => {
      const genaiFileset = await FilesetResolver.forGenAiTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/wasm"
      );

      setSubmitDisplayText("Loading the model...");
      LlmInference.createFromOptions(genaiFileset, {
        baseOptions: { modelAssetPath: modelFileName },
        // maxTokens: 512,  // The maximum number of tokens (input tokens + output
        //                  // tokens) the model handles.
        // randomSeed: 1,   // The random seed used during text generation.
        // topK: 1,  // The number of tokens the model considers at each step of
        //           // generation. Limits predictions to the top k most-probable
        //           // tokens. Setting randomSeed is required for this to make
        //           // effects.
        // temperature:
        //     1.0,  // The amount of randomness introduced during generation.
        //           // Setting randomSeed is required for this to make effects.
      })
        .then((llm) => {
          setLlmInference(llm);
          setDisableSubmit(false);
          setSubmitDisplayText("Get Response");
        })
        .catch(() => {
          alert("Failed to initialize the task.");
        });
    };
    initMediapipeLLM();
  }, [setLlmInference, setDisableSubmit, setSubmitDisplayText]);

  return (
    <AppContainer>
      <img src={logo} width={300} alt="logo" />
      <ChatContainer>
        <ChatOutput ref={outputRef}>
          <Markdown>{outputText}</Markdown>
        </ChatOutput>
        <ChatInputContainer>
          <ChatInput
            ref={inputRef}
            onCompositionEnd={() => setIsComposing(false)}
            onCompositionStart={() => setIsComposing(true)}
            onKeyDown={handleKeyDown}
          />
          <ChatInputButton onClick={handleOnClick}>
            {submitDisplayText}
          </ChatInputButton>
        </ChatInputContainer>
      </ChatContainer>
    </AppContainer>
  );
}

export default App;
