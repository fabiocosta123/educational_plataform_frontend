"use client";

import { useEffect, useState } from "react";

export default function ProfilePhotoSlot({
  src,
  name,
  alt,
}: {
  src: string;
  name: string;
  alt: string;
}) {
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    const image = new window.Image();
    image.onload = () => setHasImage(true);
    image.onerror = () => setHasImage(false);
    image.src = src;
  }, [src]);

  return (
    <figure className="mx-auto w-full max-w-sm shrink-0 lg:sticky lg:top-24 lg:mx-0">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-dashed border-[#338B97] bg-[#E8F4F6] shadow-sm">
        {hasImage ? (
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center text-[#163E72]">
            <span className="text-sm font-semibold uppercase tracking-wide">
              Espaço para foto
            </span>
            <span className="text-xs text-[#255690]">{name}</span>
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-center text-sm text-gray-600">{name}</figcaption>
    </figure>
  );
}
