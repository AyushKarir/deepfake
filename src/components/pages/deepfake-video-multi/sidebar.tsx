"use client";

// import ButtonRadio from "@/components/ui/button-radio";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
// import Image from "next/image";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
// import {
//     Accordion,
//     AccordionContent,
//     AccordionItem,
//     AccordionTrigger
// } from "@/components/ui/accordion"
// import { ChevronDown, ChevronUp } from 'lucide-react'
// import { cn } from "@/lib/utils";
// import { Textarea } from "@/components/ui/textarea";
// import useTextToImageRealtimeStore from "@/lib/zustand-states/text-to-image-realtime/store";
import { CircleAlert } from "lucide-react";
import React, { useState } from "react";

// import { Button } from "@/components/ui/button";



// import useVideogenImageToVideoStore from "@/lib/zustand-states/videogen-image-to-video/store";
import { Input } from "@/components/ui/input";
import convertToBase64 from "@/lib/convert-to-base-64";
import uploadAndGetUrl from "@/lib/upload-and-get-url";
import useApiKeyStore from "@/lib/zustand-states/apikey-store";
import useDeepfakeVideoMulti from "@/lib/zustand-states/deepfake-video-multi/store";
// import ReactPlayer from "react-player";
import DragAndDropInputVideoPreview from "@/components/drag-and-drop-input-video-preview";
import DragAndDropInputFilePreview from "@/components/drag-and-drop-input-file-preview";
import SidebarWrapper from "@/components/wrappers/sidebar-wrapper";



const Sidebar = () => {


    // const [duration, setDuration] = useState("5")


    // const { screenWidth } = useResize();
    const { apiKey } = useApiKeyStore();

    // const [preview, setPreview] = useState<string | null>(null);

    const [ytLink, setYtLink] = useState("");
    // const [videoPreviewVideo, setVideoPreviewVideo] = useState<string | null>(
    //     null
    // );


    // const [previewReference, setPreviewReference] = useState<string | null>(null);
    // const [previewTarget, setPreviewTarget] = useState<string | null>(null);



    const { state, updateTargetImage, updateInitVideo, updateReferenceImage } = useDeepfakeVideoMulti();

    // const handleInitImageUpload = async (file: File | null) => {
    //     if (!file) {
    //         updateInitImage("");
    //         return;
    //     }

    //     try {

    //         const base64 = await convertToBase64(file) as string;


    //         const imageUrl = await uploadAndGetUrl(apiKey || 'apikey', base64);
    //         updateInitImage(imageUrl.link);
    //     } catch (error) {
    //         console.error("Init image upload failed:", error);
    //     }
    // };



    const handleTargetImageUpload = async (file: File | null) => {
        if (!file) {
            updateTargetImage("");
            return;
        }

        try {

            const base64 = await convertToBase64(file) as string;



            const imageUrl = await uploadAndGetUrl(apiKey || 'apikey', base64);


            updateTargetImage(imageUrl.link);
        } catch (error) {
            console.error("Init image upload failed:", error);
        }
    };

    const handleReferenceImageUpload = async (file: File | null) => {
        if (!file) {
            updateReferenceImage("");
            return;
        }

        try {

            const base64 = await convertToBase64(file) as string;



            const imageUrl = await uploadAndGetUrl(apiKey || 'apikey', base64);


            updateReferenceImage(imageUrl.link);
        } catch (error) {
            console.error("Init image upload failed:", error);
        }
    };


    const handleTargetVideoUpload = async (file: File | null) => {
        if (!file) {
            updateInitVideo("");
            return;
        }

        try {
            const base64 = (await convertToBase64(file)) as string;
            const videoUrl = await uploadAndGetUrl(apiKey || 'apikey', base64);
            updateInitVideo(videoUrl.link);
        } catch (error) {
            console.error("Video upload failed:", error);
        }
    };


    // const handleVideoChange = async (
    //     event: React.ChangeEvent<HTMLInputElement>
    // ) => {
    //     const file = event.target.files?.[0];

    //     if (file) {
    //         const base64 = await convertToBase64(file) as string;
    //         const imageUrl = await uploadAndGetUrl(apiKey || 'apikey', base64);

    //         updateInitVideo(imageUrl.link as string);
    //     }


    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setVideoPreviewVideo(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setVideoPreviewVideo(null);
    //     }
    // };


    // const handleReferenceImageChange = async (
    //     event: React.ChangeEvent<HTMLInputElement>
    // ) => {
    //     const file = event.target.files?.[0];

    //     if (file) {
    //         const base64 = await convertToBase64(file) as string;
    //         const imageUrl = await uploadAndGetUrl(apiKey || 'apikey', base64);

    //         updateReferenceImage(imageUrl.link as string);
    //     }


    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setPreviewReference(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setPreviewReference(null);
    //     }
    // };



    console.log("this is video: " + state.init_video);
    console.log("this is ref: " + state.reference_image);
    console.log("this is targ: " + state.target_image);

    return (
        <SidebarWrapper>
            <ScrollArea className="h-full px-2 sm:px-4">
                <form className="space-y-5 py-2  sm:py-4" action="">














                    <Label className="flex gap-2 items-center">Image</Label>

                    <div className="space-y-3">
                        <Label className="flex gap-2 items-center">
                            Upload Video
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <CircleAlert className="text-muted-foreground size-4" />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Upload an image to use for face swapping.</p>
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        {/* <Input
                        type="file"
                        accept="video/*"
                        name="video"
                        onChange={handleVideoChange}
                        className="w-fit"
                    /> */}

                        {/* {ytLink.length <= 0 && (
                        <>
                            {videoPreviewVideo && (
                                <div className="mt-4 max-w-full mb-5 w-auto rounded-md h-32 m-auto">
                                    <ReactPlayer
                                        url={videoPreviewVideo}
                                        controls
                                        width="100%"
                                        height="100%"
                                        playing={false}
                                        className=""
                                    />
                                </div>
                            )}
                        </>

                    )} */}
                        <DragAndDropInputVideoPreview
                            onVideoUpload={handleTargetVideoUpload}
                            videoPreview={state.init_video}
                            name="target_video"
                            ytLink={ytLink}
                        />

                        <center>or</center>
                        <Input
                            type="text"
                            onChange={(e) => setYtLink(e.target.value)}
                            value={ytLink}
                            className="mx-auto rounded-lg"
                            placeholder="Enter youtube video link"
                        />

                        {/* <Input type="text"
                        onChange={(e) => setYtLink(e.target.value)}
                        value={ytLink}
                        className="mx-auto rounded-lg" placeholder="Enter youtube video link" /> */}

                    </div>


                    <div className="space-y-3">
                        <Label className="flex gap-2 items-center">
                            Upload Target Image
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <CircleAlert className="text-muted-foreground size-4" />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Upload an image to use for face swapping.</p>
                                </TooltipContent>
                            </Tooltip>
                        </Label>




                        <DragAndDropInputFilePreview
                            onFileUpload={handleTargetImageUpload}
                            imagePreview={state.target_image}
                            name="target_image"
                        />

                        {/* <Input
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={handleTargetImageChange}
                        className="w-fit"
                    />
                    {previewTarget && (
                        <Image
                            height={512}
                            width={512}
                            src={previewTarget}
                            alt="Selected preview"
                            className="mx-auto mt-2 rounded-lg"
                        />
                    )} */}
                    </div>




                    <div className="space-y-3">
                        <Label className="flex gap-2 items-center">
                            Upload Reference Image
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <CircleAlert className="text-muted-foreground size-4" />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Upload the source image for the face to be swapped.</p>
                                </TooltipContent>
                            </Tooltip>
                        </Label>


                        <DragAndDropInputFilePreview
                            onFileUpload={handleReferenceImageUpload}
                            imagePreview={state.reference_image}
                            name="reference_image"
                        />

                        {/* <Input
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={handleReferenceImageChange}
                        className="w-fit"
                    />
                    {previewReference && (
                        <Image
                            height={512}
                            width={512}
                            src={previewReference}
                            alt="Selected preview"
                            className="mx-auto mt-2 rounded-lg"
                        />
                    )} */}
                    </div>





                </form>
            </ScrollArea>
        </SidebarWrapper>
    );
};

export default Sidebar;
