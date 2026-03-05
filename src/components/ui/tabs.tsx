import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "~/lib/utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "text-muted-foreground inline-flex h-12 w-fit items-center justify-center",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        `relative cursor-pointer inline-flex h-full flex-1 items-center justify-center 
         gap-1.5 border-b-2 border-transparent px-2 py-1 text-sm font-medium
         text-muted-foreground transition-colors
         hover:text-foreground hover:bg-gray-100
         data-[state=active]:font-bold
         data-[state=active]:after:content-['']
         data-[state=active]:after:absolute
         data-[state=active]:after:-bottom-[2px]
         data-[state=active]:after:w-20
         data-[state=active]:after:rounded-xl
         data-[state=active]:after:left-1/2
         data-[state=active]:after:translate-x-[-50%]
         data-[state=active]:after:h-[4px]
         data-[state=active]:after:bg-blue-400`,
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
