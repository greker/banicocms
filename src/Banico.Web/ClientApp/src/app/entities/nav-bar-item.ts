import { Section } from './section';
import { SectionItem } from './section-item';

export class NavBarItem {
    section: Section;
    sectionItem: SectionItem;
    childSectionItems: SectionItem[];
    homePathUrl: string;
    pathUrls: string[];
    pathNames: string[];
    showDropdown: boolean;
    childrenVisible: boolean;
}