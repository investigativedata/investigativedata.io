import { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";
import NLink from "next/link";
import Button, { ButtonProps } from "@mui/joy/Button";
import MLink from "@mui/joy/Link";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Typography, { TypographyProps } from "@mui/joy/Typography";

const Link = (props: React.PropsWithChildren<{ href: string }>) => (
  <NLink passHref legacyBehavior href={props.href}>
    <MLink>{props.children}</MLink>
  </NLink>
);

const MDX_COMPONENTS: MDXComponents = {
  h1: (props: React.PropsWithChildren) => <Typography level="h1" {...props} />,
  h2: (props: React.PropsWithChildren) => <Typography level="h2" {...props} />,
  h3: (props: React.PropsWithChildren) => <Typography level="h3" {...props} />,
  p: (props: React.PropsWithChildren) => (
    <Typography level="body-lg" {...props} />
  ),
  small: (props: React.PropsWithChildren) => (
    <Typography level="body-sm" {...props} />
  ),
  // @ts-ignore
  img: (props: { src: string }) => <Image fill={true} {...props} alt="" />,
  // @ts-ignore
  a: (props: React.PropsWithChildren<{ href: string }>) => <Link {...props} />,
  ul: (props: React.PropsWithChildren) => <List {...props} />,
  ol: (props: React.PropsWithChildren) => (
    <List component="ol" marker="decimal" {...props} />
  ),
  li: (props: React.PropsWithChildren) => <ListItem {...props} />,
  Button: (props: ButtonProps) => <Button {...props} />,
  Typography: (props: TypographyProps) => <Typography {...props} />,
  Image: (props: ImageProps) => <Image {...props} alt={props.alt} />,
};

export default MDX_COMPONENTS;
