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
// import ReactPlayer from "react-player";

// import { Button } from "@/components/ui/button";



import useDeepfakeVideoSingle from "@/lib/zustand-states/deepfake-video-single/store";
import { Input } from "@/components/ui/input";
import convertToBase64 from "@/lib/convert-to-base-64";
import uploadAndGetUrl from "@/lib/upload-and-get-url";
import useApiKeyStore from "@/lib/zustand-states/apikey-store";
import DragAndDropInputVideoPreview from "@/components/drag-and-drop-input-video-preview";
import DragAndDropInputFilePreview from "@/components/drag-and-drop-input-file-preview";
import SidebarWrapper from "@/components/wrappers/sidebar-wrapper";



const Sidebar = () => {


    // const [duration, setDuration] = useState("5")


    // const { screenWidth } = useResize();

    const { apiKey } = useApiKeyStore();

    // const [previewInit, setPreviewInit] = useState<string | null>(null);
    // const [previewReference, setPreviewReference] = useState<string | null>(null);
    // const [previewTarget, setPreviewTarget] = useState<string | null>(null);


    const [ytLink, setYtLink] = useState("");
    // const [videoPreviewVideo, setVideoPreviewVideo] = useState<string | null>(
    //     null
    // );



    const { state, updateInitVideo, updateReferenceImage } = useDeepfakeVideoSingle();


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
                    </div>





                </form>
            </ScrollArea>
        </SidebarWrapper>
    );
};

export default Sidebar;
