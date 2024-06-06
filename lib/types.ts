import { TypographyProps } from "@mui/joy/Typography";
import { ColorPaletteProp } from "@mui/joy/styles";
import {
  IHero,
  IMediaScreen as Style_IMediaScreen,
  IScreen as Style_IScreen,
} from "@investigativedata/style";
import { ICard } from "@investigativedata/style";

// PAGES

export interface IPageBase {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
}

export interface IPage extends IPageBase {
  readonly screens: IScreen[];
  readonly color: ColorPaletteProp;
}

// SCREENS

interface IScreenItem extends Style_IScreen {
  readonly id: string;
  readonly name: string;
  readonly horizontal: boolean;
  readonly anchor?: boolean;
  content?: TContent[];
}

interface IMediaScreenItem extends Style_IMediaScreen {
  readonly id: string;
  readonly backgroundImage: string;
}

export interface IScreen {
  readonly collection: "screens";
  readonly item: IScreenItem;
}

export interface IMediaScreen {
  readonly collection: "image_screens";
  readonly item: IMediaScreenItem;
}

// CONTENT TYPES

export type TCollection =
  | "heroes"
  | "typography"
  | "mdx"
  | "images"
  | "cards"
  | "projects";

export type TContent =
  | IHeroContent
  | IMdxContent
  | IImageContent
  | ITypographyContent
  | ICardContent
  | IProjectContent;

interface BaseItem {
  readonly id: string;
  readonly status?: "draft" | "published";
  readonly user_created?: string;
  readonly user_updated?: string;
  readonly date_created?: string;
  readonly date_updated?: string;
}

export interface IHeroItem extends IHero {
  readonly actionLabel?: string;
  readonly actionHref?: string;
  mediaSrc?: string;
  renderedTeaser: React.ReactNode;
}

export interface IHeroContent {
  readonly collection: "heroes";
  readonly item: BaseItem & IHeroItem;
}

export interface ITypographyContent {
  readonly collection: "typography";
  readonly item: BaseItem &
    TypographyProps & {
      readonly dangerouslySetInnerHtml: boolean;
    };
}

export interface IMdxContent {
  readonly collection: "mdx";
  readonly item: BaseItem & {
    readonly content: string;
    renderedContent: React.ReactNode;
  };
}

export interface IImageContent {
  readonly collection: "images";
  readonly item: BaseItem & {
    readonly src: string;
    readonly alt: string;
    readonly position: "flex-start" | "center" | "flex-end";
    readonly shadow?: boolean;
    readonly ratio?: string;
    readonly width?: number;
    readonly description?: string;
    renderedDescription?: React.ReactNode;
  };
}

export interface IProjectItem {
  readonly partner: string;
  readonly title: string;
  readonly image: string;
  readonly tags: string[];
  readonly url: string;
  readonly caseStudy?: boolean;
  readonly caseStudyUrl?: string;
  readonly description: string;
  readonly date_published?: string;
  renderedDescription: React.ReactNode;
}

export interface IProjectContent {
  readonly collection: "projects";
  readonly item: BaseItem & IProjectItem;
}

export interface ICardItem extends ICard {
  readonly content?: string;
  renderedContent?: React.ReactNode;
  readonly actionLabel?: string;
  readonly actionHref?: string;
}
export interface ICardContent {
  readonly collection: "cards";
  readonly item: BaseItem & ICardItem;
}
