# Aspire for all

This repo is mean to showcase how you can use Aspire in any language to orchestrate your apps

## About Aspire

Aspire is a gream framework that really helps you with the following:

- Containerize your apps
- Helps with service discovery (no need for Docker Compose)
- Compose your solution, makes it easy to add things like cache, queues, dbs and more
- Mix and match, you can easily mix and match APIs written for different runtimes, so you could have a JS frontend, .NET API and a Python API in the solution.

## Why this project

Aspire orchestration code is written in C#, even though it's very few lines of C# you may want to write this orchestration code in a language of your choice like for example JavaScript, Python or Java, that's exactly what this project is looking to address.

## Install dependencies

You should have Node.js installed, preferably v 20.

```bash
npm i
```

## Build and run

```bash
npm run build
npm start
```

Takes `aspire.ts` and produces a manifest file called `aspire.json` in `/dist` folder that looks something similar to:

```json
{
  "weatherapi": {
    "type": "project.v0",
    "env": {
      "OTEL_DOTNET_EXPERIMENTAL_OTLP_EMIT_EXCEPTION_LOG_ATTRIBUTES": "true",
      "OTEL_DOTNET_EXPERIMENTAL_OTLP_EMIT_EVENT_LOG_ATTRIBUTES": "true",
      "OTEL_DOTNET_EXPERIMENTAL_OTLP_RETRY": "in_memory",
      "ASPNETCORE_FORWARDEDHEADERS_ENABLED": "true"
    },
    "bindings": {
      "http": {
        "scheme": "http",
        "protocol": "tcp",
        "transport": "http"
      },
      "https": {
        "scheme": "https",
        "protocol": "tcp",
        "transport": "http"
      }
    },
    "path": "../AspireJavaScript.MinimalApi"
  },
  "svelte": {
    "type": "dockerfile.v0",
    "env": {
      "services__weatherapi__http__0": "{weatherapi.bindings.http.url}"
    },
    "bindings": {
      "http": {
        "scheme": "http",
        "protocol": "tcp",
        "transport": "http",
        "targetPort": 8000,
        "external": true
      }
    },
    "path": "../AspireJavaScript.Svelte/Dockerfile",
    "context": "../AspireJavaScript.Svelte"
  },
  "angular": {
    "type": "dockerfile.v0",
    "env": {
      "services__weatherapi__http__0": "{weatherapi.bindings.http.url}"
    },
    "bindings": {
      "http": {
        "scheme": "http",
        "protocol": "tcp",
        "transport": "http",
        "targetPort": 8001,
        "external": true
      }
    },
    "path": "../AspireJavaScript.Angular/Dockerfile",
    "context": "../AspireJavaScript.Angular"
  },
  "react": {
    "type": "dockerfile.v0",
    "env": {
      "services__weatherapi__http__0": "{weatherapi.bindings.http.url}"
    },
    "bindings": {
      "http": {
        "scheme": "http",
        "protocol": "tcp",
        "transport": "http",
        "targetPort": 8002,
        "external": true
      }
    },
    "path": "../AspireJavaScript.React/Dockerfile",
    "context": "../AspireJavaScript.React"
  },
  "vue": {
    "type": "dockerfile.v0",
    "env": {
      "services__weatherapi__http__0": "{weatherapi.bindings.http.url}"
    },
    "bindings": {
      "http": {
        "scheme": "http",
        "protocol": "tcp",
        "transport": "http",
        "targetPort": 8003,
        "external": true
      }
    },
    "path": "../AspireJavaScript.Vue/Dockerfile",
    "context": "../AspireJavaScript.Vue"
  }
}
```

This file can then be used in your Aspire project.


## Run tests

```bash
npm run test
```

## Manifest file

A manifest file is something that Aspire uses to set the proper configurations for each component in an Aspire project. Typically it creates the correct env variables aka "service discovery" and inject other needed env needed to run.

A manifest file in C# can look like so:

```csharp
var builder = DistributedApplication.CreateBuilder(args);

var weatherApi = builder.AddProject<Projects.AspireJavaScript_MinimalApi>("weatherapi")
    .WithExternalHttpEndpoints();

builder.AddNpmApp("angular", "../AspireJavaScript.Angular")
    .WithReference(weatherApi)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.AddNpmApp("react", "../AspireJavaScript.React")
    .WithReference(weatherApi)
    .WithEnvironment("BROWSER", "none") // Disable opening browser on npm start
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.AddNpmApp("vue", "../AspireJavaScript.Vue")
    .WithReference(weatherApi)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
```

Thanks to this project, you can now author the above file in Typescript like so:

```typescript
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
```
