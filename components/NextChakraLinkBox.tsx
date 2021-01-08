import { PropsWithChildren } from "react";
import NextLink from "next/link";
import { LinkProps as NextLinkProps } from "next/dist/client/link";
import {
  LinkBox as ChakraLinkBox,
  LinkBoxProps as ChakraLinkBoxProps,
} from "@chakra-ui/react";

export type NextChakraLinkBoxProps = PropsWithChildren<
  NextLinkProps & Omit<ChakraLinkBoxProps, "as">
>;

//  Has to be a new component because both chakra and next share the `as` keyword
export const NextChakraLinkBox = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  children,
  ...chakraProps
}: NextChakraLinkBoxProps) => {
  return (
    <NextLink
      passHref={true}
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
    >
      <ChakraLinkBox {...chakraProps}>{children}</ChakraLinkBox>
    </NextLink>
  );
};
