"use client";

import PlaygroundWrapper from "@/components/wrappers/playground-wrapper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/deepfake-image-single");
    setTimeout(() => {
      router.push("/deepfake-image-single");
    }, 100);
  }, []);

  return (
    <PlaygroundWrapper sidebar={<div></div>}>
      <div></div>
    </PlaygroundWrapper>
  );
}
