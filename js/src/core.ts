
import { ProjectDictionary } from "./types/ProjectDictionary";
import { DistributedProject } from "./types/DistributedProject";
import { DistributedApplicationBuilder } from "./types/DistributedApplicationBuilder";
import { JsonBuilder } from "./types/JsonBuilder";
import { ManifestHelper } from "./types/ManifestHelper";

export class DistributedApplication {
    private projects: DistributedProject[] = [];

    constructor(projects: DistributedProject[]) {
        this.projects = projects;
    }

    static CreateBuilder(args: string[]): DistributedApplicationBuilder {
        return new DistributedApplicationBuilder(args);
    }

    Run() {

        let manifestStr = ManifestHelper.ReadManifest(this.projects)
        let manifestJson = JSON.stringify(manifestStr, null, 2);
        ManifestHelper.WriteManifest(manifestJson, '../out/aspire.json');
        return manifestJson;
       // TODO, build all dependent projects, start the containers etc.
    }
}






