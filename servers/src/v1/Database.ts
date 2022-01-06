import chalk = require("chalk");
import { isDevelopmentMode, isTestMode } from "./Environment";
import { PermissionGroupEnum } from "./interfaces/PermissionGroupInterface";
import DatabaseBuilder, { createTable } from "./utils/DatabaseBuilder";

/**
 * Table constants to map table naming.
 */
export const Tables = {
  // User
  User: "users",
  // Permission groups
  PermissionGroup: "permission_groups",
  // Permissions
  Permission: "permissions",
  // Permission in groups
  PermissionRelationship: "permission_relationships",
  // Users permissions
  UserPermission: "user_permissions",
  // Resources
  Resource: "resources",
};

export async function setupDatabase() {
  console.log("Setting up database");
  // Permission group
  await createTable(Tables.PermissionGroup, (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").notNullable();
  });

  // Permissions
  await createTable(Tables.Permission, (table) => {
    table.increments(`id`).primary();
    table.string(`name`).notNullable();
    table.string(`description`).notNullable();
    // table.integer(`permissionGroup`).notNullable();
  });

  await createTable(Tables.PermissionRelationship, (table) => {
    table.integer(`permissionGroup`).notNullable();
    table.integer(`permissionId`).notNullable();
  });

  // Users
  await createTable(Tables.User, (table) => {
    table.string("id").primary().unique().notNullable();
    table.string(`username`).unique().notNullable();
    table.string(`password`).unique().notNullable();
    table.string(`email`).unique().notNullable();
    table.string(`nickname`).notNullable();
    table.string(`introduction`).notNullable().defaultTo("");
  });

  // User permissions
  await createTable(Tables.UserPermission, (table) => {
    table.string(`userId`).notNullable();
    table
      .integer(`permissionGroup`)
      .notNullable()
      .defaultTo(PermissionGroupEnum.USER);
  });

  await createTable(Tables.Resource, (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string(`path`).notNullable();
    table.integer(`size`).notNullable();
    table.string(`uploader`).notNullable();
    table
      .dateTime(`uploadedAt`)
      .notNullable()
      .defaultTo(DatabaseBuilder.fn.now());
  });
}

export async function cleanUpDatabase() {
  if (!isDevelopmentMode() && !isTestMode()) {
    throw new Error("Unexpected environment (must be development or test)");
  }

  // console.warn(chalk.red(`Invoking clean up database (utility for test)...`));
  // Truncate
  for (let table in Tables) {
    if (Tables.hasOwnProperty(table)) {
      console.log(`Truncating table ${table}...`);
      await DatabaseBuilder(Tables[table]).truncate();
    }
  }

  for (let table in Tables) {
    if (Tables.hasOwnProperty(table)) {
      console.log(`Dropping table ${table}...`);
      await DatabaseBuilder.schema.dropTable(Tables[table]);
    }
  }
}
