---
layout: post
title: Getting up and running with Database testing quickly in .NET
date: 2011-03-22 00:13:51.000000000 +08:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories:
- Technical
tags:
- C#
- NHibernate
- NuGet
- ReSharper
- testing
- Visual Studio
meta:
  _edit_last: '1'
  _syntaxhighlighter_encoded: '1'
author:
  login: rob
  email: robertmooreweb@gmail.com
  display_name: rob
  first_name: Rob
  last_name: Moore
---


When I first started learning about how to do database code in .NET and in particular how to test your database code I came across a really [useful post on the Code Project](http://www.codeproject.com/KB/database/TDD_and_SqlCE.aspx).



It basically goes through a tutorial on how to get a base class set up that sets up a brand new SQL Server CE database every test run and populates it from an [NHibernate](http://nhforge.org) configuration.



This was great, but there were a number of issues that caused it to not work for me (including the fact I decided to use [Fluent NHibernate](http://fluentnhibernate.org/) rather than writing a heap of obscure XML). As well as this, there were a couple of fundamental flaws in the way the test worked and it didn't work with the latest versions of SQL Server CE and NHibernate at the time.



Consequently, I fixed up the code so it worked and I wanted to outline those changes and the final result here in case anyone finds it useful.



<!--more-->



Ideally, after you figure out how it all works you will change so you are using the same database you are using in production for your tests (e.g. MSSQL Server) rather than SQL Server CE. In saying that, using CE to get started means you are up and running quickly and don't need to worry about setting SQL Server up.


## Changes made


The changes I made to the original code were as follows:


- Upgraded project to Visual Studio 2010 project.
- Upgraded NUnit to the latest version using NuGet (2.5.9 at time of writing).
- Upgraded NHibernate to the latest version using NuGet (3.0.0.4 at the time of writing).
- Upgraded SQL Server CE to the latest version using NuGet (4.0.8482 at the time of writing).
- Added Fluent NHibernate using NuGet (version 1.1.1 at the time of writing).
- Added Migrator.NET using NuGet (version 0.9.0 at the time of writing).
- Removed the XML NHibernate mapping file and replaced it with Fluent configuration code within FixtureInitialize() in EmbeddedTestBase.cs
- Allowed the configuration to be modified by providing a public Configure() method that returns the Fluent Configuration object for further chaining.
- Moved the call to SetupDb() to FixtureInitialize() since the database needed to be created before building the session factory (otherwise an error was thrown).
- Removed the exception catch within SetupDb() so any errors become immediately apparent to the test runner.
- Changed the code to conform with usual C# coding and naming conventions (thanks ReSharper).
- Added ability to pass in assembly containing migrations so SetupDb() using Migrator.NET rather than NHibernate to create the database (thus testing you migrations as well as the integration between them and NHibernate).


## Gotcha


In order to get SQL Server CE 4 working with Migrator.NET I needed to add a binding redirect to app.config (since Migrator.NET was compiled against version 3.5):


```xml
          <dependentAssembly>
            <assemblyIdentity name="System.Data.SqlServerCe" publicKeyToken="89845dcd8080cc91" culture="neutral" />
            <bindingRedirect oldVersion="0.0.0.0-4.0.0.0" newVersion="4.0.0.0" />
          </dependentAssembly>
```

## The code


The EmbeddedTestBase class turned out as follows:



```csharp
using System;
using System.IO;
using System.Reflection;
using FluentNHibernate.Automapping;
using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using NHibernate;
using NHibernate.Tool.hbm2ddl;
namespace Samples.SqlCe.Tests
{
    /// <summary>
    /// SqlCEDBHelper courtesy of Ayende Rahien from Rhino.Commons.Helpers
    /// Full code can be found here: https://svn.sourceforge.net/svnroot/rhino-tools/trunk/rhino-commons/Rhino.Commons/Helpers/SqlCEDbHelper.cs
    /// </summary>
    internal static class SqlCeDbHelper
    {
        private const string EngineTypeName = "System.Data.SqlServerCe.SqlCeEngine, System.Data.SqlServerCe";
        private static Type _type;
        private static PropertyInfo _localConnectionString;
        private static MethodInfo _createDatabase;
        internal static void CreateDatabaseFile(string filename)
        {
            if (File.Exists(filename))
                File.Delete(filename);
            if (_type == null)
            {
                _type = Type.GetType(EngineTypeName);
                _localConnectionString = _type.GetProperty("LocalConnectionString");
                _createDatabase = _type.GetMethod("CreateDatabase");
            }
            object engine = Activator.CreateInstance(_type);
            _localConnectionString
                .SetValue(engine, string.Format("Data Source='{0}';", filename), null);
            _createDatabase
                .Invoke(engine, new object[0]);
        }
    }
    /// <summary>
    /// The code below was also supplied by Ayende Rahien from Rhino.Commons.ForTesting
    /// You can find the complete code here: https://svn.sourceforge.net/svnroot/rhino-tools/trunk/rhino-commons/Rhino.Commons/ForTesting/NHibernateEmbeddedDBTestFixtureBase.cs
    /// Ayende has more code in the version in his repository, and you can
    /// expand a lot more here, but for the sake of argument only the basics are here
    /// </summary>
    public class EmbeddedTestBase
    {
        public static string DatabaseFilename = "TempTestDB.sdf";
        protected static ISessionFactory SessionFactory;
        protected static FluentConfiguration Config;
        public FluentConfiguration Configure()
        {
            return Config ?? (Config =
                Fluently.Configure()
                // Bug fix: http://stackoverflow.com/questions/2361730/assertionfailure-null-identifier-fluentnh-sqlserverce
                .ExposeConfiguration(x => x.SetProperty("connection.release_mode", "on_close"))
                .Database(
                    MsSqlCeConfiguration.Standard
                    .ConnectionString(string.Format("Data Source={0};", DatabaseFilename))
                    .ShowSql()
                )
            );
        }
        protected void Initialize(Assembly migrationAssembly = null, params Assembly[] assemblies)
        {
            foreach (var assembly in assemblies)
            {
                var asm = assembly;
                Configure().Mappings(m => m.AutoMappings.Add(AutoMap.Assembly(asm)));
            }
            Initialize(migrationAssembly);
        }
        protected void Initialize(string namespaceSuffix, Assembly migrationAssembly = null, params Assembly[] assemblies)
        {
            foreach (var assembly in assemblies)
            {
                var asm = assembly;
                Configure().Mappings(m => m.AutoMappings.Add(
                    AutoMap.Assembly(asm).Where(t => t.Namespace != null && t.Namespace.EndsWith(namespaceSuffix))
                ));
            }
            Initialize(migrationAssembly);
        }
        /// <summary>
        /// Initialize NHibernate and builds a session factory.
        /// Note, this is a costly call so it will be executed only one.
        /// </summary>
        protected void Initialize(Assembly migrationAssembly = null)
        {
            if (SessionFactory != null)
                return;
            Configure();
            SetupDb(migrationAssembly);
            SessionFactory = Config.BuildSessionFactory();
        }
        public void SetupDb(Assembly migrationAssembly = null)
        {
            SqlCeDbHelper.CreateDatabaseFile(DatabaseFilename);
            if (migrationAssembly == null)
            {
                new SchemaExport(Config.BuildConfiguration()).Execute(true, true, false);
            }
            else
            {
                var migrator = new Migrator.Migrator("SqlServerCE", "Data Source=" + DatabaseFilename, migrationAssembly, true);
                migrator.MigrateToLastVersion();
            }
        }
        public ISession CreateSession()
        {
            return SessionFactory.OpenSession();
        }
    }
}
```



In order to create a database test you simply extend this class and call one of the overloads of Initialize() within the Test Fixture Setup as relevant. You can optionally call Configure() before callign Initialize() and change the Fluent NHibernate configuration by chaining against that call. After calling initialize you simply call CreateSession() to get an NHibernate session object reference for use with your testing code.



If you would like to download the sample code you can [find it on github](https://github.com/robdmoore/DB-TDD-With-SQLCE-NHib-and-Migrator.NET).

