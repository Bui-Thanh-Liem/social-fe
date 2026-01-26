"use client";

import { X } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Drawer, DrawerContent, DrawerOverlay } from "~/components/ui/drawer";
import { WrapIcon } from "~/components/WrapIcon";
import type { IMedia } from "~/shared/interfaces/schemas/media.interface";
import { useDetailAttachment } from "~/store/useDetailAttachment";

export function DetailAttachmentDrawer() {
  //
  const { mediaList, mediaSelected, setMediaSelected, setMediaList } =
    useDetailAttachment();

  //
  if (!mediaSelected) {
    return <></>;
  }

  //
  function onClickMedia(media: IMedia) {
    setMediaSelected(media);
  }

  //
  function onClose() {
    setMediaSelected();
    setMediaList();
  }

  //
  return (
    <Drawer direction="right" open={!!mediaSelected}>
      <DrawerOverlay
        className="bg-black/70"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />

      {/* Các phần tử nằm trên overlay, ngoài DrawerOverlay */}
      {!!mediaSelected && (
        <div className="fixed top-0 left-0 w-3/4 z-[100] h-screen p-4 pl-28">
          {/* Content tweet */}
          <div className="h-full relative">
            <WrapIcon
              className="absolute -left-16 bg-gray-400 cursor-pointer hover:bg-gray-400/90 z-[1000]"
              onClick={onClose}
            >
              <X size={24} color="#fff" />
            </WrapIcon>

            <div className="h-[90%] z-[1000]">
              {mediaSelected.file_type.startsWith("video/") ? (
                <video
                  src={mediaSelected.url}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : mediaSelected.file_type.startsWith("image/") ? (
                <img
                  src={mediaSelected.url}
                  alt={mediaSelected.url}
                  className="object-contain w-full h-full"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.png"; // Fallback image
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-400">Định dạng không hỗ trợ</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <DrawerContent className="h-screen max-h-screen overflow-y-auto overflow-x-hidden flex items-center justify-center">
        <Carousel
          opts={{
            align: "start",
          }}
          orientation="vertical"
          className="w-full max-w-xs"
        >
          <CarouselContent className="-mt-1 h-[80vh] cursor-grab">
            {mediaList?.map((media, index) => (
              <CarouselItem
                key={index}
                className="pt-1 md:basis-1/3 lg:basis-1/6"
              >
                <div className="p-1">
                  <Card onClick={() => onClickMedia(media)}>
                    <CardContent className="flex items-center justify-center p-6">
                      {media.file_type.startsWith("video/") ? (
                        <video
                          src={media.url}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : media.file_type.startsWith("image/") ? (
                        <img
                          src={media.url}
                          alt={media.url}
                          className="object-contain w-full h-full"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-image.png"; // Fallback image
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-gray-400">
                            Định dạng không hỗ trợ
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DrawerContent>
    </Drawer>
  );
}
