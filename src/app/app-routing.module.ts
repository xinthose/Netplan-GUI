import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NetworkComponent } from './network/network.component';
import { CommandsComponent } from './commands/commands.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: "", redirectTo: "/network", pathMatch: "full" },
  { path: "network", component: NetworkComponent, title: "Netplan GUI - Network" },
  { path: "commands", component: CommandsComponent, title: "Netplan GUI - Commands" },
  { path: '**', component: PageNotFoundComponent, title: "Page Not Found" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
