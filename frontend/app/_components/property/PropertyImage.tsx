"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string;
  fallback: string;
};

// Swap to `fallback` when the src fails to load. Property images from Agentbox
// can 404 if the CDN file was removed after the record was created (common in
// sandbox test data; occasionally happens in prod too).
export function PropertyImage({ src, fallback, alt, ...rest }: Props) {
  const [current, setCurrent] = useState(src);
  return (
    <Image
      {...rest}
      src={current}
      alt={alt}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
