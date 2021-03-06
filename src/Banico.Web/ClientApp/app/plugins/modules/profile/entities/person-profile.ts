import { ContentItem } from "../../../../entities/content-item";
import * as moment from "moment";

export class PersonProfile {
  id: string;
  name: string;
  alias: string;
  content: string;
  snippet: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  avatarHash: string;
  type: string;
  headline: string;

  constructor(private contentItem: ContentItem) {
    if (
      contentItem &&
      contentItem.module === "profile" &&
      contentItem.type === "in"
    ) {
      this.id = contentItem.id;
      this.createdBy = contentItem.createdBy;
      this.name = contentItem.name;
      this.alias = contentItem.alias;
      this.type = contentItem.type;
      this.content = contentItem.content;
      this.snippet = contentItem.snippet;
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
    output.createdBy = this.createdBy;
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
