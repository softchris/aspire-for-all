
import { DistributedApplication } from "../src/core";
import { ProjectDictionary } from "../src/types/ProjectDictionary";
import { ProjectType } from "../src/types/ProjectType";



class ObjectBuilder {
    static DotnetObject(name: string): ProjectDictionary {
        return {
            [name] : {
                type : "project.v0",
                env : {
                    "OTEL_DOTNET_EXPERIMENTAL_OTLP_EMIT_EXCEPTION_LOG_ATTRIBUTES": "true",
                    "OTEL_DOTNET_EXPERIMENTAL_OTLP_EMIT_EVENT_LOG_ATTRIBUTES": "true",
                    "OTEL_DOTNET_EXPERIMENTAL_OTLP_RETRY": "in_memory",
                    "ASPNETCORE_FORWARDEDHEADERS_ENABLED": "true"
                },
                bindings: {},
                path: "../AspireJavaScript.MinimalApi"
            }
        }
    }

    static DotnetObjectWithBindings(name: string) {
        let obj = ObjectBuilder.DotnetObject(name);
        let nameProp = obj[name]; 
        nameProp.bindings = {
            http: {
                scheme: "http",
                protocol: "tcp",
                transport: "http"
            },
            https: {
                scheme: "https",
                protocol: "tcp",
                transport: "http"
            }
        }
        return obj;
    }

    static JavaScriptObject(name: string): ProjectDictionary {
        return {
            [name] : {
                type : "project.v0",
                env: {},
                bindings: {}
            }
        }
    }

    static JavaScriptObjectWithBindings(name: string) {
        let obj = ObjectBuilder.JavaScriptObject(name);
        let nameProp = obj[name];
        nameProp.bindings = {
            http: {
                scheme: "http",
                protocol: "tcp",
                transport: "http",
                targetPort: 8000,
                external: true
            }
        }
        return obj;
    }

    static JavaScriptObjectWithDocker(name: string, projectPath: string) {
        let obj = ObjectBuilder.JavaScriptObject(name);
        let nameProp = obj[name];
        nameProp.type = "dockerfile.v0";
        nameProp.path = `${projectPath}/Dockerfile`;
        nameProp.context = projectPath;
        return obj;
    }

    static DotnetObjectWithReference(name: string, reference: string) {
        let obj = ObjectBuilder.DotnetObject(name);
        let key = `services__${reference}__http__0`;
        let value = `{${reference}.bindings.http.url}`;
        obj[name].env[key] = value; 

        return obj;
    }
}

// test if app is defined
test("Create app", () => {
    var builder = DistributedApplication.CreateBuilder([]);
    var project = builder.AddProject("weatherapi", ProjectType.Dotnet, "../AspireJavaScript.MinimalApi")

    var app = builder.Build();
    app.Run();
    expect(app).toBeDefined();
});



// test to add projects
test("Add projects", () => {
    var builder = DistributedApplication.CreateBuilder([]);
    var project = builder.AddProject("weatherapi", ProjectType.Dotnet, "../AspireJavaScript.MinimalApi")

    var project2 = builder.AddProject("productapi", ProjectType.Javascript, "../AspireJavaScript.ProductApi")
      
    var app = builder.Build();
    var actual = app.Run();

    const weatherApiName = "weatherapi";
    const productApiName = "productapi";

    var expected = JSON.stringify(
        { 
            "weatherapi": ObjectBuilder.DotnetObject(weatherApiName)[weatherApiName],
            "productapi": ObjectBuilder.JavaScriptObject(productApiName)[productApiName] 
        }, null, 2);

    console.log("EXPECTED: ", expected);

    console.log("ACTUAL: ", actual);

    expect(actual).toEqual(expected);
}); 

// test to verify PublishToDockerFile
test("Publish to Docker", () => {
    var projectPath = "../AspireJavaScript.JavaScriptApi";
    var builder = DistributedApplication.CreateBuilder([]);
    var project = builder.AddProject("weatherapi", ProjectType.Javascript, projectPath)
        .PublishAsDockerFile();
    var app = builder.Build();

    var weatherApiName = "weatherapi";

    expect(app.Run()).toEqual(JSON.stringify({ 
        "weatherapi": ObjectBuilder.JavaScriptObjectWithDocker(weatherApiName, projectPath)[weatherApiName]
    }, null, 2));
});

// test WithReference
test("With Reference", () => {
    var builder = DistributedApplication.CreateBuilder([]);
    var productapi = builder.AddProject("productapi", ProjectType.Dotnet, "../AspireJavaScript.MinimalApi")
    var project = builder.AddProject("weatherapi", ProjectType.Dotnet, "../AspireJavaScript.MinimalApi")
        .WithReference(productapi);

    var app = builder.Build();

    var weatherApiName = "weatherapi";
    var productApiName = "productapi";

    var actual = app.Run();
    var expected = JSON.stringify(
        { 
            "productapi": ObjectBuilder.DotnetObject(productApiName)[productApiName],
            "weatherapi": ObjectBuilder.DotnetObjectWithReference(weatherApiName, productApiName)[weatherApiName]
            
        }, null, 2);

    console.log("EXPECTED: ", expected);
    console.log("ACTUAL: ", actual);    

    expect(actual).toEqual(expected);
}); 

// test external endpoints, .NET project
test("External Http Endpoints. .NET project", () => {
    var builder = DistributedApplication.CreateBuilder([]);
    var project = builder.AddProject("weatherapi", ProjectType.Dotnet, "../AspireJavaScript.MinimalApi")
        .WithExternalHttpEndpoints();
    var app = builder.Build();

    let weatherApiName = "weatherapi";

    const actual = app.Run();
    const expected = JSON.stringify({
         "weatherapi": ObjectBuilder.DotnetObjectWithBindings(weatherApiName)[weatherApiName]
    }, null, 2);

    expect(actual).toEqual(expected);
});

// test external endpoints, other project
test("External Http Endpoints, other project", () => {
    var builder = DistributedApplication.CreateBuilder([]);
    var project = builder.AddProject("weatherapi", ProjectType.Javascript, "../AspireJavaScript.MinimalApi")
        .WithExternalHttpEndpoints();
    var app = builder.Build();
    let weatherApiName = "weatherapi";

    const actual = app.Run();
    const expected = JSON.stringify({
         "weatherapi": ObjectBuilder.JavaScriptObjectWithBindings(weatherApiName)[weatherApiName]  
    }, null, 2);

    expect(actual).toEqual(expected);
});