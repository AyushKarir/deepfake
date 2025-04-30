"use client";

import PlaygroundWrapper from "@/components/wrappers/playground-wrapper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/text-to-video");
    setTimeout(() => {
      router.push("/text-to-video");
    }, 100);
  }, []);

  return (
    <PlaygroundWrapper sidebar={<div></div>}>
      <div></div>
    </PlaygroundWrapper>
  );
}
