import { Component, Input } from '@angular/core';
import { PROJECTS, PORTFOLIO } from './projectConfig';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  // @Input() filter: string;
  projects = PROJECTS; // Assuming PROJECTS is an array of project objects
  PORTFOLIO = PORTFOLIO;
  filter = 'All Projects'
  // getSectionClasses(project: any, index: number): string {
  //   const projectTypeIncludesFilter = project.type.includes(this.filter);
  // const isAllProjects = this.filter === 'All Projects';

  // if (isAllProjects || projectTypeIncludesFilter) {
  //   return `relative h-[380px] w-[340px] min-w-[340px] snap-start rounded-xl border-2 border-gray-700/30 bg-clip-padding p-4 shadow-xl transition-[min-width,width,margin-left,opacity] duration-300 spacing-0 d:border-white/20 flex`;
  // } else {
  //   return `relative h-[380px] w-[340px] min-w-[340px] snap-start rounded-xl border-2 border-gray-700/30 bg-clip-padding p-4 shadow-xl transition-[min-width,width,margin-left,opacity] duration-300 spacing-0 d:border-white/20 -ml-8 !w-0 !min-w-0 !overflow-hidden !border-0 !px-0 opacity-20`;
  // }
    // const rotationIndex = this.projects
    //   .filter(({ type }) => this.filter === 'All Projects' || type.includes(this.filter))
    //   .findIndex(({ name }) => project.name === name);
    // const rotationIndex = 0;

    // return `relative h-[380px] w-[340px] min-w-[340px] snap-start rounded-xl border-2 border-gray-700/30 bg-clip-padding p-4 shadow-xl transition-[min-width,width,margin-left,opacity] duration-300 spacing-0 d:border-white/20 ${
    //   this.filter === 'All Projects' || project.type.includes(this.filter)
    //     ? 'flex'
    //     : '-ml-8 !w-0 !min-w-0 !overflow-hidden !border-0 !px-0 opacity-20'
    // } ${
    //   rotationIndex % 2 === 0 && 'sm:rotate-[1.5deg]'
    // } ${
    //   rotationIndex % 2 === 1 && 'sm:rotate-[-1.5deg]'
    // } ${
    //   index % 8 === 0 &&
    //   'shadow-[currentBg] bg-[linear-gradient(40deg,var(--tw-gradient-stops))] from-pink-300/80 to-violet-500/40 shadow-violet-500/20'
    // } `;
    //  ${
    //   index % 8 === 1 &&
    //   'bg-[linear-gradient(120deg,var(--tw-gradient-stops))] from-yellow-300/80 to-rose-600/80 shadow-rose-600/20'
    // } ${
    //   index % 8 === 2 &&
    //   'bg-[linear-gradient(180deg,var(--tw-gradient-stops))] from-gray-200/40 to-rose-500/80 shadow-rose-500/20'
    // } ${
    //   index % 8 === 3 &&
    //   'bg-[linear-gradient(120deg,var(--tw-gradient-stops))] from-green-400/70 to-cyan-600/80 shadow-cyan-600/20'
    // } ${
    //   index % 8 === 4 &&
    //   'bg-[linear-gradient(140deg,var(--tw-gradient-stops))] from-orange-500/50 to-yellow-500/80 shadow-yellow-500/20'
    // } ${
    //   index % 8 === 5 &&
    //   'bg-[linear-gradient(200deg,var(--tw-gradient-stops))] from-purple-500/80 to-sky-600/40 shadow-sky-600/20'
    // } ${
    //   index % 8 === 6 &&
    //   'bg-[linear-gradient(70deg,var(--tw-gradient-stops))] from-emerald-400/80 to-teal-600/40 shadow-teal-600/20'
    // } ${
    //   index % 8 === 7 &&
    //   'bg-[linear-gradient(140deg,var(--tw-gradient-stops))] from-cyan-400/80 to-indigo-700/50 shadow-indigo-700/20'
    // }

    // @Input() filter: string;


  getSectionClasses(project: any, index: number): string {
    const rotationIndex = this.projects
      .filter(({ type }) => this.filter === 'All Projects' || type.includes(this.filter))
      .findIndex(({ name }) => project.name === name);
    // const rotationIndex = 0;

    return `relative h-[380px] w-[340px] min-w-[340px] snap-start rounded-xl border-2 border-gray-700/30 bg-clip-padding p-4 shadow-xl transition-[min-width,width,margin-left,opacity] duration-300 spacing-0 d:border-white/20 ${
      this.filter === 'All Projects' || project.type.includes(this.filter)
        ? 'flex'
        : '-ml-8 !w-0 !min-w-0 !overflow-hidden !border-0 !px-0 opacity-20'
    } ${
      rotationIndex % 2 === 0 && 'sm:rotate-[1.5deg]'
    } ${
      rotationIndex % 2 === 1 && 'sm:rotate-[-1.5deg]'
    } ${
      index % 8 === 0 &&
      'shadow-[currentBg] bg-[linear-gradient(40deg,var(--tw-gradient-stops))] from-pink-300/80 to-violet-500/40 shadow-violet-500/20'
    } ${
      index % 8 === 1 &&
      'bg-[linear-gradient(120deg,var(--tw-gradient-stops))] from-yellow-300/80 to-rose-600/80 shadow-rose-600/20'
    } ${
      index % 8 === 2 &&
      'bg-[linear-gradient(180deg,var(--tw-gradient-stops))] from-gray-200/40 to-rose-500/80 shadow-rose-500/20'
    } ${
      index % 8 === 3 &&
      'bg-[linear-gradient(120deg,var(--tw-gradient-stops))] from-green-400/70 to-cyan-600/80 shadow-cyan-600/20'
    } ${
      index % 8 === 4 &&
      'bg-[linear-gradient(140deg,var(--tw-gradient-stops))] from-orange-500/50 to-yellow-500/80 shadow-yellow-500/20'
    } ${
      index % 8 === 5 &&
      'bg-[linear-gradient(200deg,var(--tw-gradient-stops))] from-purple-500/80 to-sky-600/40 shadow-sky-600/20'
    } ${
      index % 8 === 6 &&
      'bg-[linear-gradient(70deg,var(--tw-gradient-stops))] from-emerald-400/80 to-teal-600/40 shadow-teal-600/20'
    } ${
      index % 8 === 7 &&
      'bg-[linear-gradient(140deg,var(--tw-gradient-stops))] from-cyan-400/80 to-indigo-700/50 shadow-indigo-700/20'
    }`;
  }
}

