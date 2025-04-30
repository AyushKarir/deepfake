import React, { useState, useCallback, useEffect } from "react";
import { Upload, X } from "lucide-react";
import ReactPlayer from "react-player";

type Props = {
  onVideoUpload: (file: File | null) => Promise<void>;
  videoPreview?: string;
  accept?: string;
  name?: string;
  ytLink?: string;
  onYtLinkChange?: (link: string) => void;
};

const DragAndDropInputVideoPreview = ({
  onVideoUpload,
  videoPreview,
  accept = "video/*",
  name = "video",
  ytLink = "",
}: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);

  // Reset video when ytLink changes from empty to non-empty
  useEffect(() => {
    if (ytLink && hasUploaded) {
      setLocalPreview(null);
      onVideoUpload(null);
      setHasUploaded(false);
    }
  }, [ytLink, hasUploaded, onVideoUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0 && !ytLink) {
        await handleFile(files[0]);
      }
    },
    [ytLink]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0 && !ytLink) {
        await handleFile(files[0]);
      }
    },
    [ytLink]
  );

  const handleFile = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true);
        setHasUploaded(true);

        // Create local preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Verify file type
        const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
        if (!validTypes.includes(file.type)) {
          throw new Error(`Invalid file type: ${file.type}`);
        }

        await onVideoUpload(file);
      } catch (error) {
        console.error("Video handling failed:", error);
        setLocalPreview(null);
        setHasUploaded(false);
      } finally {
        setIsUploading(false);
      }
    },
    [onVideoUpload]
  );

  const clearVideo = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        setIsUploading(true);
        setLocalPreview(null);
        setHasUploaded(false);
        await onVideoUpload(null);
      } catch (error) {
        console.error("Clear failed:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [onVideoUpload]
  );

  const previewUrl = videoPreview || localPreview;

  // Don't show the component if there's a YouTube link
  if (ytLink) return null;

  return (
    <div className="space-y-2">
      <div
        className={`relative min-h-[100px] w-full cursor-pointer rounded-lg border-2 border-dashed p-4 transition-all hover:bg-muted/25 ${isDragging ? "bg-muted/50" : ""
          } ${isUploading ? "opacity-70 cursor-wait" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`video-input-${name}`)?.click()}
      >
        <input
          id={`video-input-${name}`}
          type="file"
          accept={accept}
          name={name}
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading || !!ytLink}
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center">
            <p>Uploading...</p>
          </div>
        ) : previewUrl ? (
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full">
              <div className="mt-4 max-w-full w-auto rounded-md h-32 m-auto">
                <ReactPlayer
                  url={previewUrl}
                  controls
                  width="100%"
                  height="100%"
                  playing={false}
                />
              </div>
              <button
                onClick={clearVideo}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/80 transition-all"
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Click to replace or drop a new video
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-full flex items-center justify-center aspect-square border border-dashed p-3 mb-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-center mb-1 text-sm text-muted-foreground">
              Drag &apos;n&apos; drop video here, or click to select video
            </p>
            <p className="text-xs text-center text-muted-foreground/70">
              Supports: MP4, WebM, Ogg
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragAndDropInputVideoPreview;