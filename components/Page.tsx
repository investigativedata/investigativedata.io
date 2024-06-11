"use client";

import { useContext, useEffect, useState } from "react";
import slugify from "slugify";
import { IMediaScreen, IPage, IPageBase, IScreen } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import {
  BACKGROUNDS,
  Drawer,
  DrawerMenuItem,
  Header,
  IPageMenuItem,
  MediaScreen,
  PageContext,
  PageContextProvider,
  Screen,
} from "@investigativedata/style";
import PreviewAlert from "@/components/PreviewAlert";
import { getFileUrl } from "@/lib/directus";
import Content from "./Content";
import Footer from "./Footer";

const renderScreen = (props: IScreen | IMediaScreen, isLast: boolean) =>
  props.collection === "image_screens" ? (
    <MediaScreen key={props.item.id}>
      <Image fill={true} src={getFileUrl(props.item.backgroundImage)} alt="" />
    </MediaScreen>
  ) : (
    <Box
      component="section"
      id={slugify(props.item.name)}
      data-anchor={props.item.anchor}
      key={props.item.id}
      paddingBottom={isLast ? 12 : 0}
    >
      <Screen
        {...props.item}
        padding={props.item.padding}
        changeBackgroundOnScroll
      >
        <Stack
          gap={4}
          direction={{
            sm: "column",
            md: props.item.horizontal ? "row" : "column",
          }}
          sx={{ "& > *": { flex: 1 } }}
        >
          {props.item.content?.map((c) => <Content key={c.item.id} {...c} />)}
        </Stack>
      </Screen>
    </Box>
  );

export default function Page({
  data,
  menu,
  pageMenu,
  showSection = true,
  previewMode = true,
}: {
  data: IPage;
  menu: IPageBase[];
  pageMenu?: IPageMenuItem[];
  showSection?: boolean;
  previewMode?: boolean;
}) {
  const [section, sayHi] = useState<string>(showSection ? data.title : "");
  useEffect(() => {
    if (typeof document !== "undefined") {
      const params = new URLSearchParams(document.location.search);
      const hello = params.get("hi");
      if (!!hello) {
        sayHi(`says hi to ${hello} 👋`);
      }
    }
  }, []);

  const drawer = (
    <Drawer>
      {menu.map((m) => (
        <DrawerMenuItem key={m.slug} href={`/${m.slug}`}>
          {m.title}
        </DrawerMenuItem>
      ))}
      <Button component={Link} href="/contact">
        Contact
      </Button>
    </Drawer>
  );

  const { currentColor } = useContext(PageContext);

  return (
    <PageContextProvider initialColor={data.color}>
      {previewMode && <PreviewAlert />}
      <Header
        sx={{
          marginTop: previewMode ? "40px" : 0,
          backgroundColor: BACKGROUNDS[currentColor] || "inherit",
          transition: "background 0.8s ease",
        }}
        fixed
        section={section}
        drawer={drawer}
        pageMenu={pageMenu}
        color={data.color}
      />
      <Box
        component="main"
        paddingTop={{ xs: "70px", md: pageMenu?.length ? "180px" : "150px" }}
      >
        {data.screens.map((s, i) =>
          renderScreen(s, i === data.screens.length - 1),
        )}
      </Box>
      <Footer />
    </PageContextProvider>
  );
}
