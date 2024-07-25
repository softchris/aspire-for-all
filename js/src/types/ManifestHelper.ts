import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { JsonBuilder } from './JsonBuilder';
import { DistributedProject } from './DistributedProject';
import { ProjectType } from './ProjectType';

export class ManifestHelper {
    static WriteManifest(content: string, outputPath) {
    
        const filePath = resolve(__dirname, outputPath);

        // Ensure the directory exists
        mkdirSync(dirname(filePath), { recursive: true });

        // Write the file
        writeFileSync(filePath, content);
    }

    static ReadManifest(projects: DistributedProject []): string {
        const builder = new JsonBuilder();
        let port = 8000;

        projects.forEach(project => {
            builder.AddProperty(project.name, { type: project.type, env: {}, bindings: {} });

            if(project.projectType == ProjectType.Dotnet) {
                builder.Itr(project.name)
                    .Itr("env")
                    .AddProperty("OTEL_DOTNET_EXPERIMENTAL_OTLP_EMIT_EXCEPTION_LOG_ATTRIBUTES", "true")
                    .AddProperty("OTEL_DOTNET_EXPERIMENTAL_OTLP_EMIT_EVENT_LOG_ATTRIBUTES", "true")
                    .AddProperty("OTEL_DOTNET_EXPERIMENTAL_OTLP_RETRY", "in_memory")
                    .AddProperty("ASPNETCORE_FORWARDEDHEADERS_ENABLED", "true")
                    .ResetItr();
                
                builder.Itr(project.name)
                    .AddProperty("path", project.sourcePath)
                    .ResetItr();
                    
            } else if (project.projectType == ProjectType.Javascript) {
                if(project.publishAsDocker) {
                    builder.Itr(project.name)
                        .AddProperty("path", `${project.sourcePath}/Dockerfile`)
                        .AddProperty("context", project.sourcePath)
                        .ResetItr();
                }
            }

            if (project.externalHttpEndpoints) {
                console.log("External Http Endpoints");
                if(project.projectType == ProjectType.Dotnet) {
                    console.log("Dotnet Project");
                   builder.Itr(project.name)
                     .Itr("bindings")
                     .AddProperty("http", { scheme: "http", protocol: "tcp", transport: "http" })
                     .AddProperty("https", { scheme: "https", protocol: "tcp", transport: "http" })
                    .ResetItr()

                  
                } else if (project.projectType == ProjectType.Javascript) {
                    console.log("Other Project");
                    builder.Itr(project.name)
                        .Itr("bindings")
                        .AddProperty("http", { 
                            scheme: "http", 
                            protocol: "tcp", 
                            transport: "http",
                            targetPort: port++,
                            external: true })
                        .ResetItr()
                }
            }

            for (let i = 0; i < project.projects.length; i++) {
                let innerProject = project.projects[i];
                
                builder
                    .Itr(project.name)
                    .Itr("env")
                    .AddProperty(`services__${innerProject.name}__http__0`, `{${innerProject.name}.bindings.http.url}`)
                    .ResetItr();

                
            }
        });

        return builder.Build();
    }

}