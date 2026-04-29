import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { ChatComponent } from "./chat.component";

const routes: Routes = [{ path: "", component: ChatComponent }];

@NgModule({
  declarations: [ChatComponent],
  imports: [CommonModule, SharedModule, FormsModule, RouterModule.forChild(routes)]
})
export class ChatModule {}
