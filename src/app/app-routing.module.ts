import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeroSectionComponent } from './hero-section/hero-section.component';
// import { HomeComponent } from './components/home/home.component';
// import { ArchiveComponent } from './components/archive/archive.component';

// const routes: Routes = [
//   // { path: ':language?', component: HomeComponent },
//   // { path: ':language?/proyectos', component: ArchiveComponent },
//   { path: '**', pathMatch: 'full', redirectTo: '/' },
// ];

// const routes: Routes = [
//   { path: '', component: HeroSectionComponent },
//   // Add more routes as needed
// ];

@NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
})
// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes)
//   ],
//   exports: [RouterModule]
// })
export class AppRoutingModule { }
