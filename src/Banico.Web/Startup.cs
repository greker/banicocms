﻿using AspNetCore.RouteAnalyzer;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Swagger;
using System;
using WebEssentials.AspNetCore.Pwa;

namespace Banico.Web
{
    public class Startup 
    {
        private WebStartup webStartup;

        public Startup (IConfiguration configuration, IWebHostEnvironment env) 
        {
            this.webStartup = new WebStartup();
            this.webStartup.Init(configuration, env);
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {
            services.AddNodeServices();
            services.AddHttpContextAccessor();

            // Add framework services.
            this.webStartup.ConfigureServices(services);

            services.AddProgressiveWebApp(new PwaOptions { Strategy = ServiceWorkerStrategy.CacheFirst, RegisterServiceWorker = true, RegisterWebmanifest = true }, "manifest.json");

            // Register the Swagger generator, defining one or more Swagger documents
            services.AddSwaggerGen (c => {
                c.SwaggerDoc ("v1", new OpenApiInfo { Title = "Banico", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (
            IApplicationBuilder app, 
            IWebHostEnvironment env, 
            ILoggerFactory loggerFactory, 
            IAntiforgery antiforgery, 
            IHostApplicationLifetime applicationLifetime, // Add
            IRouteAnalyzer routeAnalyzer,
            IServiceProvider services) {
            // move to Program.cs - loggerFactory.AddConsole (this.Configuration.GetSection ("Logging"));
            // move to Program.cs - loggerFactory.AddDebug ();

            // app.UseStaticFiles();

            this.webStartup.Configure(app, env, antiforgery, services);
            app.UseStaticFiles(new StaticFileOptions() {
                OnPrepareResponse = c => {
                    //Do not add cache to json files. We need to have new versions when we add new translations.
                    c.Context.Response.GetTypedHeaders ().CacheControl = !c.Context.Request.Path.Value.Contains (".json")
                        ? new CacheControlHeaderValue () {
                            MaxAge = TimeSpan.FromDays (30) // Cache everything except json for 30 days
                        }
                        : new CacheControlHeaderValue () {
                            MaxAge = TimeSpan.FromMinutes (15) // Cache json for 15 minutes
                        };
                }
            });            
            app.UseSpaStaticFiles();

            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage ();
                app.UseWebpackDevMiddleware (new WebpackDevMiddlewareOptions {
                    HotModuleReplacement = true,
                        HotModuleReplacementEndpoint = "/dist/"
                });
                app.UseSwagger ();
                app.UseSwaggerUI (c => {
                    c.SwaggerEndpoint ("/swagger/v1/swagger.json", "My API V1");
                });

                // Enable middleware to serve swagger-ui (HTML, JS, CSS etc.), specifying the Swagger JSON endpoint.

                app.MapWhen (x => !x.Request.Path.Value.StartsWith ("/swagger", StringComparison.OrdinalIgnoreCase), builder => {
                    builder.UseMvc (routes => {
                        routes.MapSpaFallbackRoute (
                            name: "spa-fallback",
                            defaults : new { controller = "Home", action = "Index" });
                    });
                });
            } else {
                app.UseMvc(routes => {
                    routes.MapRoute (
                        name: "default",
                        template: "{controller=Home}/{action=Index}/{id?}");

                    routes.MapRoute (
                        "Sitemap",
                        "sitemap.xml",
                        new { controller = "Home", action = "SitemapXml" });

                    routes.MapSpaFallbackRoute (
                        name: "spa-fallback",
                        defaults : new { controller = "Home", action = "Index" });

                });
                app.UseExceptionHandler("/Home/Error");
            }

            // display all routes
            //applicationLifetime.ApplicationStarted.Register(() =>
            //{
            //    var infos = routeAnalyzer.GetAllRouteInformations();
            //    Console.WriteLine("======== ALL ROUTE INFORMATION ========");
            //    foreach (var info in infos)
            //    {
            //        Console.WriteLine(info.ToString());
            //    }
            //    Console.WriteLine("");
            //    Console.WriteLine("");
            //});

            app.UseSpa(spa =>
            {
            // To learn more about options for serving an Angular SPA from ASP.NET Core,
            // see https://go.microsoft.com/fwlink/?linkid=864501

            spa.Options.SourcePath = "ClientApp";

            if (env.IsDevelopment())
            {
                spa.UseAngularCliServer(npmScript: "start");
            }
            });
        }
    }
}
