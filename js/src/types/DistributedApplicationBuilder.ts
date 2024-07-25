import { DistributedProject } from './DistributedProject';
import { DistributedApplication } from '../core';
import { ProjectType } from './ProjectType';

export class DistributedApplicationBuilder {
    private projects: DistributedProject[] = [];

    constructor(private args: string[]) {
    }

    AddProject(name: string, projectType: ProjectType, sourcePath: string ): DistributedProject {
        let project = new DistributedProject(name, projectType, sourcePath);
        this.projects.push(project);
     
        return project;
    }

    Build(): DistributedApplication {
        return new DistributedApplication(this.projects);
    }
}