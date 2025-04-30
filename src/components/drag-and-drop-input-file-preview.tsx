import React, { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";

type Props = {
  onFileUpload: (file: File | null) => Promise<void>; // Now accepts null for clear
  imagePreview?: string;
  accept?: string;
  name?: string;
};

const DragAndDropInputFilePreview = ({
  onFileUpload,
  imagePreview,
  accept = "image/*",
  name = "file",
}: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
      if (files && files.length > 0) {
        await handleFile(files[0]);
      }
    },
    [onFileUpload]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await handleFile(files[0]);
      }
    },
    [onFileUpload]
  );

  const handleFile = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      console.log("Selected file:", file.name, file.type, file.size);

      // Verify file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.type}`);
      }

      await onFileUpload(file);
    } catch (error) {
      console.error("File handling failed:", error);
      // Optionally show error to user
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const clearImage = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        setIsUploading(true);
        await onFileUpload(null);
      } catch (error) {
        console.error("Clear failed:", error);
      } finally {
        setIsUploading(false);
      }
    },
    [onFileUpload]
  );

  return (
    <div
      className={`relative min-h-[100px] w-full cursor-pointer rounded-lg border-2 border-dashed p-4 transition-all hover:bg-muted/25 ${isDragging ? "bg-muted/50" : ""
        } ${isUploading ? "opacity-70 cursor-wait" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById(`file-input-${name}`)?.click()}
    >
      <input
        id={`file-input-${name}`}
        type="file"
        accept={accept}
        name={name}
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center justify-center">
          <p>Uploading...</p>
        </div>
      ) : imagePreview ? (
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="mx-auto h-auto max-h-[400px] w-auto max-w-full rounded-md object-contain"
            />
            <button
              onClick={clearImage}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/80 transition-all"
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Click to replace or drop a new image
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-full flex items-center justify-center aspect-square border border-dashed p-3 mb-3">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-center mb-1 text-sm text-muted-foreground">
            Drag &apos;n&apos; drop image here, or click to select image
          </p>
          <p className="text-xs text-center text-muted-foreground/70">
            Supports: JPG, PNG, JPEG
          </p>
        </div>
      )}
    </div>
  );
};

export default DragAndDropInputFilePreview;