﻿import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DirectoryItem } from '../../entities/directory-item';
import { NavBarService } from '../../../../shell/nav-bar/nav-bar.service';
import { SectionsService } from '../../../../shared/services/sections.service';
import { DirectoryService } from '../../services/directory.service';

@Component({
    selector: 'app-directory-display',
    templateUrl: './directory-display.component.html',
    providers: [DirectoryService]
})
export class DirectoryDisplayComponent implements OnInit, OnDestroy {
    private id: string;
    private sub: any;
    private path: string;
    public directoryItems: DirectoryItem[];
    public isAdmin: boolean;

    constructor(
        @Inject(NavBarService) private navBarService: NavBarService,
        @Inject(DirectoryService) public directoryService: DirectoryService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        // this.sub = this.route.params.subscribe(params => {
        //     this.id = params['id'];
        //     this.directoryService.GetDirectoryItem(this.id)
        //         .subscribe(item => this.item = item);
        // });

        this.sub = this.route.params.subscribe(params => {
            this.path = params['path'];
            this.navBarService.initialize('directory', this.path, '', '/directory');

            if (this.path) {
                this.directoryService.getDirectoryItems(this.path)
                .subscribe(directoryItems => this.setDirectoryItems(directoryItems));
            }
        });
    }
    
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private setDirectoryItems(directoryItems: DirectoryItem[]) {
        this.directoryItems = directoryItems;
    }
}
