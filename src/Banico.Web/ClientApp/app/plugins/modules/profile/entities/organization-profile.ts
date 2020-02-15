import { ContentItem } from "../../../../entities/content-item";
import * as moment from "moment";

export class OrganizationProfile {
  id: string;
  owners: string;
  ownerUserIds: string;
  alias: string;
  content: string;
  createdDate: string;
  updatedDate: string;
  avatarHash: string;
  type: string;
  headline: string;

  constructor(private contentItem: ContentItem) {
    if (
      contentItem &&
      contentItem.module === "profile" &&
      contentItem.type === "org"
    ) {
      this.id = contentItem.id;
      this.owners = contentItem.owners;
      this.ownerUserIds = contentItem.ownerUserIds;
      this.alias = contentItem.alias;
      this.type = contentItem.type;
      this.content = contentItem.content;
      this.createdDate = contentItem.createdDate;
      this.updatedDate = contentItem.updatedDate;
      this.avatarHash = contentItem.attribute01;
      this.headline = contentItem.attribute02;
    }
  }

  public toContentItem(): ContentItem {
    let output: ContentItem = new ContentItem();

    output.module = "profile";
    output.id = this.id;
    output.owners = this.owners;
    output.alias = this.alias;
    output.type = this.type;
    output.content = this.content;
    output.attribute01 = this.avatarHash;
    output.attribute02 = this.headline;

    return output;
  }

  public formattedCreatedDate(): string {
    return moment(this.createdDate).format("MMMM Do YYYY, h:mm:ss a");
  }

  public formattedUpdatedDate(): string {
    return moment(this.updatedDate).format("MMMM Do YYYY, h:mm:ss a");
  }

  public createdFromNow(): string {
    return moment(this.createdDate).fromNow();
  }

  public updatedFromNow(): string {
    return moment(this.updatedDate).fromNow();
  }
}