"use client";

import AvgGenTime from "@/components/avg-gen-time";
import { useFirstGenerationStore } from "@/components/isFirstGeneration";
// import Base64ImageView from "@/components/base64-image-view";
import { useResize } from "@/components/resize-context";
import ShowCodePanel from "@/components/show-code-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GenerationLoader from "@/components/ui/generation-loader";
import {
    ResizableHandle,
    // ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    // ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import VideoView from "@/components/video-view";

import ViewDemo from "@/components/view-demo";
// import convertToBase64 from "@/lib/convert-to-base-64";
import {
    DeepfakeVideoSingleResponseProps,
    DeepfakeVideoSingleRequestBodyProps,
} from "@/lib/types/deepfake-video-single";
// import uploadAndGetUrl from "@/lib/upload-and-get-url";
import { cn } from "@/lib/utils";
import useApiKeyStore from "@/lib/zustand-states/apikey-store";
import useDeepfakeVideoSingle from "@/lib/zustand-states/deepfake-video-single/store";
import { useShowCodeStore } from "@/lib/zustand-states/show-code-store";
import { CircleAlert, Waves } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const Content = () => {
    // const {
    //     state,
    //     updateKey,
    //     updateNegPrompt,
    //     updateOutputFile,
    //     updatePrompt1,
    //     updatePrompt2,
    //     updatePrompt3,
    //     updateEta,
    // } = useVideogenSceneCreatorStore();

    const {
        state,

        updateEta,

        updateResults,
    } = useDeepfakeVideoSingle();

    const { createConfettiCannons } = useFirstGenerationStore();

    const abortControllerRef = useRef<AbortController | null>(null);



    const { screenWidth } = useResize();
    const { apiKey } = useApiKeyStore();
    const { showCode } = useShowCodeStore();
    const [requestData, setRequestData] = useState("");
    const [responseData, setResponseData] = useState("");



    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);


    // const [resultHeight, setResultHeight] = useState("");
    // const [resultWidth, setResultWidth] = useState("");


    // const handleVideoSubmit = async (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();


    //     let videoUrl;
    //     if (ytLink.length <= 0) {
    //         const videoFile = (e.target as HTMLFormElement)["video-input"].files[0];
    //         const base64Video = await convertToBase64(videoFile);
    //         videoUrl = await uploadAndGetUrl(base64Video, true);
    //     } else {
    //         videoUrl = ytLink;
    //     }

    //     const referenceImageFile = (e.target as HTMLFormElement)[
    //         "reference-image-input"
    //     ].files[0];

    //     const base64ReferenceImage = await convertToBase64(referenceImageFile);

    //     const referenceImageUrl = await uploadAndGetUrl(base64ReferenceImage);

    //     let targetImageUrl;
    //     if (faceType === "single") {
    //         const targetImageFile = (e.target as HTMLFormElement)[
    //             "target-image-input"
    //         ].files[0];
    //         const base64TargetImage = await convertToBase64(targetImageFile);
    //         targetImageUrl = await uploadAndGetUrl(base64TargetImage);
    //     }

    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");

    //     let requestBody;

    //     if (faceType === "single") {
    //         requestBody = JSON.stringify({
    //             key: apiKey,
    //             init_video: videoUrl,
    //             init_image: targetImageUrl,
    //             reference_image: referenceImageUrl,
    //             output_format: "mp4",
    //             webhook: null,
    //             track_id: null,
    //         });
    //     } else {
    //         // single video swap (multi)
    //         requestBody = JSON.stringify({
    //             key: apiKey,
    //             init_image: referenceImageUrl,
    //             init_video: videoUrl,
    //             output_format: "mp4",
    //             webhook: null,
    //             track_id: null,
    //         });
    //     }

    //     const requestOptions = {
    //         method: "POST",
    //         headers: myHeaders,
    //         body: requestBody,
    //         redirect: "follow" as RequestRedirect,
    //     };

    //     try {
    //         const response = await fetch(
    //             faceType === "single"
    //                 ? "https://modelslab.com/api/v6/deepfake/specific_video_swap"
    //                 : "https://modelslab.com/api/v6/deepfake/single_video_swap",
    //             requestOptions
    //         );
    //         const result: ImageTo3dApiResponse = await response.json();

    //         if (result.status == "error") {
    //             toast(result.message, { type: "error" });
    //         }

    //         if (result.status === "processing" || result.status === "success") {
    //             setResult(result);
    //             setIsGeneratedImage(false);
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //         toast("Something Went wrong!", { type: "error" });
    //     } finally {
    //         setLoading(false);
    //     }
    // };





    useEffect(() => {
        if (apiKey) {
            setIsAuthenticated(true);
        }
    }, [apiKey]);

    useEffect(() => {
        const requestBody: DeepfakeVideoSingleRequestBodyProps = {
            key: apiKey || "apiKey",

            init_video: state.init_video,
            init_image: state.init_image,


            base64: true,
            webhook: null,
            track_id: null,
        };

        setRequestData(JSON.stringify(requestBody, null, 2));
    }, [apiKey, state])

    async function handleSubmit() {
        setIsSubmitting(true);

        if (!apiKey) {
            toast.error("Please sign in to run the model.");
            setIsSubmitting(false);
            return;
        }







        const requestBody: DeepfakeVideoSingleRequestBodyProps = {
            key: apiKey || "apiKey",

            init_video: state.init_video,
            init_image: state.init_image,


            base64: true,
            webhook: null,
            track_id: null,
        };

        try {
            const response = await fetch(
                "https://modelslab.com/api/v6/deepfake/single_video_swap",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            if ("error" in response) {
                toast.error("Error generating video");
                setIsSubmitting(false);
                return;
            }

            const data: DeepfakeVideoSingleResponseProps = await response.json();

            if (data.status === "error") {
                toast.error("failed to generate video");
                setIsSubmitting(false);
                return;
            }

            if (data.status === "success") {
                toast.success("Video generated successfully");
                createConfettiCannons();
                updateResults(data.output || []);
                updateEta(data.generationTime || 0);
                setIsSubmitting(false);
            }

            if (data.status === "failed") {
                toast.error("failed to generate video");
                setIsProcessing(false);
                return;
            }

            setResponseData(JSON.stringify(data, null, 2));

            if (data.status === "processing") {
                toast.warning("Your image is processing in background.");
                // updateResults(data.future_links);
                setIsProcessing(true);

                const checkAccessibility = async (url: string) => {
                    try {
                        const response = await fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ key: apiKey }),
                        });
                        const result = await response.json();
                        if (result.status === "success") {
                            updateResults(data.future_links || []);
                            createConfettiCannons();
                            setIsProcessing(false);
                        } else if (result.status === "failed") {
                            toast.error("failed to generate image");
                            setIsProcessing(false);
                        } else {
                            setTimeout(() => checkAccessibility(url), 5000);
                        }
                    } catch {
                        setTimeout(() => checkAccessibility(url), 5000);
                    }
                };

                checkAccessibility(`https://modelslab.com/api/v6/deepfake/fetch/${data.id}`);
            }

            setIsSubmitting(false);
        } catch (error) {
            console.log(error);

            if (error instanceof Error) {
                // toast.error(error.message);
                console.log(error.message);

                toast.error("Something went wrong");
            } else {
                toast.error("Something went wrong");
                setIsSubmitting(false);
            }
        }
    }

    function handleReset() {

        updateResults([]);
        // setResultHeight("");
        // setResultWidth("");
    }

    function handleCancel() {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setIsSubmitting(false);
            toast.info("Canceling request...");
        }
    }


    return (

        <div
            className={cn("h-full p-2 pl-0.5 grid gap-1", "grid-rows-[auto_1fr] ")}
        >
            <ViewDemo
                videoUrl=""
                Icon={Waves}
                heading="Deepfake Video (Single)"
                subHeading=" Click on 'View Demo' to watch a tutorial video and see
            how it works."
            />
            <ResizablePanelGroup
                direction={screenWidth > 768 ? "horizontal" : "vertical"}
                className="rounded-lg"
            >
                <ResizablePanel
                    defaultSize={50}
                    minSize={30}
                    className={cn(
                        "p-1",
                        screenWidth > 768 ? "pl-2" : "!overflow-visible pt-2"
                    )}
                >
                    <div
                        className={cn(
                            "relative h-full border border-border rounded-md",
                            screenWidth < 768 ? "min-h-96" : ""
                        )}
                    >
                        <Badge
                            variant={"outline"}
                            className="bg-background z-10 absolute top-2 left-2"
                        >
                            Result
                        </Badge>
                        <AvgGenTime eta={state.eta} />
                        <div className="h-full">
                            {(isSubmitting || isProcessing) && (
                                <div className="flex items-center justify-center flex-col gap-2 h-full">
                                    <GenerationLoader />
                                    <p className="text-sm">
                                        {isProcessing
                                            ? "Video is processing in background..."
                                            : "Generating..."}
                                    </p>
                                </div>
                            )}
                            {state.results.length > 0 && (
                                <ScrollArea className="flex flex-wrap rounded-lg h-full p-3 gap-3 pt-10">
                                    <div
                                        className={cn(
                                            "flex flex-wrap gap-2 p-2 pt-10 justify-center items-center h-full rounded-lg"
                                        )}
                                    >
                                        {state.results.map((result, index) => (
                                            // <Base64ImageView
                                            //     className={
                                            //         state.results.length > 1 ? "w-[40%]" : "w-full"
                                            //     }
                                            //     key={index}
                                            //     imgUrl={result}
                                            //     height={resultHeight}
                                            //     width={resultWidth}
                                            // />

                                            <VideoView
                                                className={state.results.length > 1 ? "w-[40%]" : "w-full"}
                                                key={index}
                                                videoUrl={result}
                                                height={512}
                                                width={512}
                                            />
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    </div>
                </ResizablePanel>

                {showCode && (
                    <>
                        {screenWidth > 768 && (
                            <ResizableHandle withHandle className="bg-transparent" />
                        )}
                        <ShowCodePanel
                            apiEndpoint="https://modelslab.com/api/v6/deepfake/single_face_swap"
                            isLoading={isSubmitting}
                            request={requestData}
                            response={responseData}
                        />
                    </>
                )}
            </ResizablePanelGroup>

            <div className="mx-1 flex gap-2 flex-col">
                {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground flex gap-1 items-center">
                        <CircleAlert className="size-4" /> Sign in to run the model
                    </p>
                )}

                {isAuthenticated && isProcessing && (
                    <p className="text-xs text-muted-foreground flex gap-1 items-center">
                        <CircleAlert className="size-4" /> Cannot cancel while image is in
                        processing... please wait!
                    </p>
                )}

                <div className="flex gap-2 items-center">
                    {isSubmitting && !isProcessing ? (
                        <Button onClick={handleCancel} variant="destructive">
                            Cancel
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || isProcessing}
                        >
                            Generate
                        </Button>
                    )}

                    <Button
                        variant={"secondary"}
                        disabled={isSubmitting || isProcessing}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </div>
        </div>

    );
};

export default Content;
