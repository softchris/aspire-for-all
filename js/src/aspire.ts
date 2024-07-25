import { DistributedApplication } from "./core";
import { ProjectType } from "./types/ProjectType";

let args = process.argv.slice(2);

var builder = DistributedApplication.CreateBuilder(args);

var weatherApi = builder.AddProject("weatherapi", ProjectType.Dotnet, "../AspireJavaScript.MinimalApi")
    .WithExternalHttpEndpoints();

builder.AddProject("svelte", ProjectType.Javascript, "../AspireJavaScript.Svelte")
    .WithReference(weatherApi)
    .WithHttpEndpoint("env", "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.AddProject("angular", ProjectType.Javascript, "../AspireJavaScript.Angular")
    .WithReference(weatherApi)
    .WithHttpEndpoint("env", "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.AddProject("react", ProjectType.Javascript, "../AspireJavaScript.React")
    .WithReference(weatherApi)
    .WithEnvironment("BROWSER", "none") // Disable opening browser on npm start
    .WithHttpEndpoint("env", "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.AddProject("vue", ProjectType.Javascript, "../AspireJavaScript.Vue")
    .WithReference(weatherApi)
    .WithHttpEndpoint("env", "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();