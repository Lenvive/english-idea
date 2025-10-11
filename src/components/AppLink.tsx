import NextLink from "next/link";
import { ComponentProps } from "react";
import { getFullPath } from "@/lib/config";

type AppLinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  href: string;
};

// 自定义 Link 组件
export const AppLink = ({ href, ...props }: AppLinkProps) => {
  const fullPath = getFullPath(href);

  return <NextLink href={fullPath} {...props} />;
};

export default AppLink;
