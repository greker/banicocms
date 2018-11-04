﻿import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ContentItem } from '../../../../entities/content-item';
import { DirectoryItem } from '../../main/directory-item';
import { DirectoryService } from '../../main/directory.service';
import { NavBarService } from '../../../../shell/nav-bar/nav-bar.service';
import { ModalComponent } from '../../../../shell/modal/modal.component';
import { AppConfig } from '../../../../../../../config/app.config';

@Component({
    selector: 'directory-item-display',
    templateUrl: './directory-item-display.component.html',
    providers: [DirectoryService]
})
export class DirectoryItemDisplayComponent implements OnInit, OnDestroy {
    private id: string;
    public directoryItem: DirectoryItem;
    private sub: any;
    public isAdmin: boolean;
    public uriEncodeAddress: string;

    constructor(
        @Inject(NavBarService) private navBarService: NavBarService,
        @Inject(DirectoryService) private directoryService: DirectoryService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NgbModal,
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        this.directoryItem = new DirectoryItem(null);
        this.sub = this.route.params.subscribe(params => {
            this.id = params['id'];
            this.directoryService.get(this.id)
                .subscribe(directoryItem => this.SetDirectoryItem(directoryItem));
        });
    }

    private SetDirectoryItem(directoryItem: DirectoryItem) {
        this.directoryItem = directoryItem;
        this.uriEncodeAddress = encodeURIComponent(directoryItem.address);
        this.navBarService.initialize('directory', directoryItem.sectionItems, '', '/directory');
    }

    public mapUrl(): SafeUrl {
        var url: string = "https://www.google.com/maps/embed/v1/search?key=" + AppConfig.GOOGLE_MAP_API_KEY + "&q=" + this.uriEncodeAddress;
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    private ToDirectoryItem(item: ContentItem): DirectoryItem {
        var output: DirectoryItem = new DirectoryItem(null);
        output.id = item.id;
        output.name = item.name;
        output.description = item.content;

        return output;
    }

    public delete() {
        const modalRef = this.modalService.open(ModalComponent)
        modalRef.componentInstance.title = "Delete Confirmation"
        modalRef.componentInstance.body = "Delete this item?";
        modalRef.componentInstance.button = "Delete";
        modalRef.result.then((result) => {
            if (result == 'success') {
                this.directoryService.delete(this.directoryItem)
                    .subscribe(response => this.SaveResponse(response));
            }
        });
    }

    private SaveResponse(data: any) {
        if (data != null) {
            if (data.value != null) {
                if (data.value == '1') {
                    alert('Saved.');
                    this.router.navigateByUrl('directory/' + this.directoryItem.sectionItems);
                } else {
                    alert('Save failed.');
                }
            } else {
                alert('Save failed.');
            }
        } else {
            alert('Save failed.');
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
