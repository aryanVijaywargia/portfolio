import { ImageProps } from "next/dist/client/future/image";
import NextImage from "next/future/image";
import { FC } from "react";
import { SetRequired } from "type-fest";

export const Image: FC<
  SetRequired<Omit<ImageProps, "src">, "width" | "height"> & {
    aspectRatio?: number;
    maxHeight?: number;
    maxWidth?: number;
    pixelDensity?: number;
    preload?: boolean;
    src?: ImageProps["src"];
  }
> = ({ pixelDensity = 1, preload, ...props }) => {
  const { src, width, height, maxWidth, maxHeight, aspectRatio, ...rest } = props;

  const aspect = aspectRatio ?? +width / +height;

  if (!src || src === "undefined") {
    return null;
  }

  return (
    <NextImage
      {...rest}
      priority={preload || rest.priority}
      placeholder={!preload ? "blur" : undefined}
      blurDataURL={
        typeof src === "string" && !preload
          ? `/_next/image?url=${encodeURIComponent(
              src.replace(/^(http:)?\/\//, "https://")
            )}&w=32&q=1`
          : undefined
      }
      src={typeof src === "string" ? src.replace(/^(http:)?\/\//, "https://") : src}
      width={Math.round(
        +(maxWidth ? maxWidth : maxHeight ? maxHeight * aspect : width) * pixelDensity
      )}
      height={Math.round(
        +(maxHeight ? maxHeight : maxWidth ? maxWidth / aspect : height) * pixelDensity
      )}
    />
  );
};
