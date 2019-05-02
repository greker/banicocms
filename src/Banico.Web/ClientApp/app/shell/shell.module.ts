import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { FrontComponent } from './front/front.component';
import { ModalComponent } from './modal/modal.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { NavBarService } from './nav-bar/nav-bar.service';
import { AuthService } from '../shared/services/auth.service';

@NgModule({
    imports: [ 
        CommonModule,
        PipesModule
    ],
    declarations: [ 
        FrontComponent,
        ModalComponent,
        NavBarComponent,
        NavMenuComponent,
        SpinnerComponent,
    ],
    exports: [
        NavBarComponent,
        NavMenuComponent
    ],
    providers: [
        NavBarService,
        AuthService
    ]
})
export class ShellModule { }