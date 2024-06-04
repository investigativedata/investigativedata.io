"use client";

import slugify from "slugify";
import { IMediaScreen, IPage, IPageBase, IScreen } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import {
  Drawer,
  DrawerMenuItem,
  Header,
  IPageMenuItem,
  MediaScreen,
  Screen,
} from "@investigativedata/style";
import { HeaderContext } from "@investigativedata/style";
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
    <Box component="section" id={slugify(props.item.name)} key={props.item.id}>
      <Screen {...props.item} sx={isLast ? { paddingBottom: 24 } : {}}>
        <Stack
          gap={12}
          direction={props.item.horizontal ? "row" : "column"}
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

  return (
    <>
      <HeaderContext>
        {previewMode && <PreviewAlert />}
        <Header
          sx={{ marginTop: previewMode ? "40px" : 0 }}
          fixed
          section={showSection ? data.title : ""}
          drawer={drawer}
          pageMenu={pageMenu}
        />
      </HeaderContext>
      <main style={{ paddingTop: pageMenu?.length ? "180px" : "150px" }}>
        {data.screens.map((s, i) =>
          renderScreen(s, i === data.screens.length - 1),
        )}
      </main>
      <Footer />
    </>
  );
}
