"use client";

import slugify from "slugify";
import { IMediaScreen, IPage, IPageBase, IScreen } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
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
import PreviewAlert from "@/components/PreviewAlert";
import { getFileUrl } from "@/lib/directus";
import Content from "./Content";

const renderScreen = (props: IScreen | IMediaScreen) =>
  props.collection === "image_screens" ? (
    <MediaScreen key={props.item.id}>
      <Image fill={true} src={getFileUrl(props.item.backgroundImage)} alt="" />
    </MediaScreen>
  ) : (
    <section id={slugify(props.item.name)} key={props.item.id}>
      <Screen {...props.item}>
        <Stack gap={12}>
          {props.item.content?.map((c) => <Content key={c.item.id} {...c} />)}
        </Stack>
      </Screen>
    </section>
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
      {previewMode && <PreviewAlert />}
      <Header
        sx={{ marginTop: previewMode ? "40px" : 0 }}
        fixed
        section={showSection ? data.title : ""}
        drawer={drawer}
        pageMenu={pageMenu}
      />
      <main style={{ paddingTop: pageMenu?.length ? "180px" : "150px" }}>
        {data.screens.map(renderScreen)}
      </main>
    </>
  );
}
