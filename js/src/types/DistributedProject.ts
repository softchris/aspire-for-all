import { ProjectType } from "./ProjectType";

export class DistributedProject {
    type: string;
    projects: DistributedProject[] = [];
    externalHttpEndpoints: boolean = false;
    publishAsDocker = false;
    constructor(public name: string, public projectType: ProjectType, public sourcePath: string) {   
        this.type = "project.v0";
    }

    WithExternalHttpEndpoints(): DistributedProject {
        this.externalHttpEndpoints = true;
        return this;
    }

    WithHttpEndpoint(key: string, value: string): DistributedProject { 
        return this;
    }

    WithReference(project: DistributedProject): DistributedProject { 
        
        this.projects.push(project);
        return this;
    }

    WithEnvironment(key: string, value: string): DistributedProject {
        return this;
    }

    PublishAsDockerFile(): DistributedProject { 
        this.publishAsDocker = true;
        this.type = "dockerfile.v0";
        return this;
    }
}