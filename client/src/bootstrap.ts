import { Application } from "./Application";
import { joinToPackageDirectory } from "./Utils/JoinToPackageDirectory";
import { EnvironmentLoader, ProcessEnvironment } from "@mscs/environment";
import { Container, ContainerBuilder, NpmPackage, NpmPackageLoader } from "@soundsystem/system";
import { IdentifierService } from "./Service/IdentifierService";
import { ConfigureCommand } from "./Command/ConfigureCommand";
import { joinToRunetimeDirectory } from "./Utils/JoinToRuntimeDirectory";
import { RunCommand } from "./Command/RunCommand";
import { UpdateCommand } from "./Command/UpdateCommand";
import { CurrentCommand, ExecuteCommand, ExecutedMigrationFileStorage, LatestCommand, ListCommand, MigrateCommand, MigrationStorage, StatusCommand, UpToDateCommand, VersionAliasResolver } from "@soundsystem/migration";
import { SoundClient } from "./Sound/SoundClient";
import { SoundService } from "./Sound/SoundService";
import { AirplayService } from "./SystemService/AirplayService";
import { AlsaService } from "./SystemService/AlsaService";
import { BluetoothService } from "./SystemService/BluetoothService";
import { SnapclientService } from "./SystemService/SnapclientService";
import { SnapserverService } from "./SystemService/SnapserverService";
import { Configuration } from "./Configuration/Configuration";
import { DeviceService } from "./Service/DeviceService";
import { TestMigration } from "./Migration/1.0/TestMigration";

export async function bootstrap() {
    const builder = new ContainerBuilder();

    builder.registerService(Application, {}, [{ serviceIdentifier: "!command", method: "addCommands" }]);
    builder.registerService(MigrationStorage, { name: "migration.storage" }, [{ serviceIdentifier: "!migration", method: "addMigrations" }]);
    builder.registerService(ExecutedMigrationFileStorage, { name: "migration.executed.storage" }, [{ serviceIdentifier: "%migration.file%", parameterIndex: 0 }]);
    builder.registerService(VersionAliasResolver, { name: "migration.version.aliasResolver" }, [{ serviceIdentifier: "@migration.storage", parameterIndex: 0 }, { serviceIdentifier: "@migration.executed.storage", parameterIndex: 1 }]);

    builder.registerService(Configuration);

    // Migrations
    builder.registerService(TestMigration);

    // Services
    builder.registerService(SoundClient);
    builder.registerService(SoundService);
    builder.registerService(DeviceService);

    // System services
    builder.registerService(AirplayService);
    builder.registerService(AlsaService);
    builder.registerService(BluetoothService);
    builder.registerService(SnapclientService);
    builder.registerService(SnapserverService);

    // Commands
    builder.registerService(ConfigureCommand);
    builder.registerService(RunCommand);
    builder.registerService(UpdateCommand);

    // Migration Commands
    builder.registerService(CurrentCommand, { name: "migration.command.current", tags: ["command"] }, [
        { serviceIdentifier: "@migration.storage", parameterIndex: 0 }, {
            serviceIdentifier: "@migration.version.aliasResolver",
            parameterIndex: 1,
        }]);
    builder.registerService(ExecuteCommand, { name: "migration.command.execute", tags: ["command"] }, [
        { serviceIdentifier: "@migration.storage", parameterIndex: 0 },
        { serviceIdentifier: "@migration.executed.storage", parameterIndex: 1 },
    ]);
    builder.registerService(LatestCommand, { name: "migration.command.latest", tags: ["command"] }, [
        { serviceIdentifier: "@migration.storage", parameterIndex: 0 }, {
            serviceIdentifier: "@migration.version.aliasResolver",
            parameterIndex: 1,
        },
    ]);
    builder.registerService(ListCommand, { name: "migration.command.list", tags: ["command"] }, [
        { serviceIdentifier: "@migration.storage", parameterIndex: 0 },
        { serviceIdentifier: "@migration.executed.storage", parameterIndex: 1 },
    ]);
    builder.registerService(MigrateCommand, { name: "migration.command.migrate", tags: ["command"] }, [
        { serviceIdentifier: "@migration.storage", parameterIndex: 0 },
        { serviceIdentifier: "@migration.executed.storage", parameterIndex: 1 },
    ]);
    builder.registerService(StatusCommand, { name: "migration.command.status", tags: ["command"] }, [
        { serviceIdentifier: "@migration.storage", parameterIndex: 0 },
        { serviceIdentifier: "@migration.executed.storage", parameterIndex: 1 },
    ]);
    builder.registerService(UpToDateCommand, { name: "migration.command.up-to-date", tags: ["command"] }, [
        { serviceIdentifier: "@migration.storage", parameterIndex: 0 },
        { serviceIdentifier: "@migration.executed.storage", parameterIndex: 1 },
    ]);

    builder.registerFactory(async (file: string) => {
        const loader = new NpmPackageLoader(file);
        const data = await loader.load();

        return new NpmPackage(data);

    }, NpmPackage, { name: "package" }, [{ serviceIdentifier: "%package.file%", parameterIndex: 0 }]);

    builder.registerFactory(async (file: string) => {
        const environment = new ProcessEnvironment();
        const environmentLoader = new EnvironmentLoader(environment);

        await environmentLoader.load(file);

        return environment;
    }, ProcessEnvironment, { name: "environment" }, [{ serviceIdentifier: "%environment.file%", parameterIndex: 0 }]);

    builder.registerFactory(async (file: string) => {
        const service = new IdentifierService(file);

        await service.ensure();

        return service;
    }, IdentifierService);

    const container = new Container(builder);

    container.setParameter("package.file", joinToPackageDirectory("package.json"));
    container.setParameter("environment.file", joinToRunetimeDirectory(".env"));
    container.setParameter("identifier.file", joinToRunetimeDirectory(".id"));
    container.setParameter("configuration.file", joinToRunetimeDirectory("client.json"));
    container.setParameter("migration.file", joinToRunetimeDirectory("migration.json"));

    return container;
}
