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

export async function bootstrap() {
    const builder = new ContainerBuilder();

    builder.registerService(Application, {}, [{ serviceIdentifier: "!command", method: "addCommands" }]);
    builder.registerService(MigrationStorage, { name: "migrations.storage" }, [{ serviceIdentifier: "!migration", method: "addMigrations" }]);
    builder.registerService(ExecutedMigrationFileStorage, { name: "migrations.executed.storage" }, [{ serviceIdentifier: "%migrations.file%", parameterIndex: 0 }]);
    builder.registerService(VersionAliasResolver, { name: "migrations.version.aliasResolver" }, [{ serviceIdentifier: "@migrations.storage", parameterIndex: 0 }, { serviceIdentifier: "@migrations.executed.storage", parameterIndex: 1 }]);

    builder.registerService(Configuration);

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
    builder.registerService(CurrentCommand, { name: "migrations.command.current", tags: ["command"] }, [
        { serviceIdentifier: "@migrations.storage", parameterIndex: 0 }, {
            serviceIdentifier: "@migrations.version.aliasResolver",
            parameterIndex: 1,
        }]);
    builder.registerService(ExecuteCommand, { name: "migrations.command.execute", tags: ["command"] }, [
        { serviceIdentifier: "@migrations.storage", parameterIndex: 0 },
        { serviceIdentifier: "@migrations.executed.storage", parameterIndex: 1 },
    ]);
    builder.registerService(LatestCommand, { name: "migrations.command.latest", tags: ["command"] }, [
        { serviceIdentifier: "@migrations.storage", parameterIndex: 0 }, {
            serviceIdentifier: "@migrations.version.aliasResolver",
            parameterIndex: 1,
        },
    ]);
    builder.registerService(ListCommand, { name: "migrations.command.list", tags: ["command"] }, [
        { serviceIdentifier: "@migrations.storage", parameterIndex: 0 },
        { serviceIdentifier: "@migrations.executed.storage", parameterIndex: 1 },
    ]);
    builder.registerService(MigrateCommand, { name: "migrations.command.migrate", tags: ["command"] }, [
        { serviceIdentifier: "@migrations.storage", parameterIndex: 0 },
        { serviceIdentifier: "@migrations.executed.storage", parameterIndex: 1 },
    ]);
    builder.registerService(StatusCommand, { name: "migrations.command.status", tags: ["command"] }, [
        { serviceIdentifier: "@migrations.storage", parameterIndex: 0 },
        { serviceIdentifier: "@migrations.executed.storage", parameterIndex: 1 },
    ]);
    builder.registerService(UpToDateCommand, { name: "migrations.command.up-to-date", tags: ["command"] }, [
        { serviceIdentifier: "@migrations.storage", parameterIndex: 0 },
        { serviceIdentifier: "@migrations.executed.storage", parameterIndex: 1 },
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
    container.setParameter("migrations.file", joinToRunetimeDirectory("migrations.json"));

    return container;
}
