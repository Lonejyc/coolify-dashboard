/**
 * Type definitions for Coolify API responses
 * Based on Coolify API v1 documentation
 * @see https://coolify.io/docs/api-reference/authorization
 */

// ============================================
// Common Types
// ============================================

export type ResourceStatus =
  | "running"
  | "stopped"
  | "degraded"
  | "restarting"
  | "exited";
export type DeploymentStatus =
  | "queued"
  | "in_progress"
  | "finished"
  | "failed"
  | "cancelled";
export type BuildPack =
  | "nixpacks"
  | "dockerfile"
  | "dockercompose"
  | "static"
  | "dockerimage";

// ============================================
// Environment & Project Types
// ============================================

export interface CoolifyEnvironment {
  id: number;
  name: string;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface CoolifyProject {
  uuid: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// Server Types
// ============================================

export interface CoolifyServer {
  uuid: string;
  name: string;
  description?: string;
  ip: string;
  port: number;
  user: string;
  validation_logs?: string;
  is_reachable: boolean;
  is_build_server: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// Application Types
// ============================================

export interface CoolifyApplication {
  uuid: string;
  name: string;
  description?: string;
  fqdn?: string;
  status: ResourceStatus;

  // Git configuration
  git_repository?: string;
  git_branch?: string;
  git_commit_sha?: string;
  git_full_url?: string;

  // Build configuration
  build_pack: BuildPack;
  dockerfile_location?: string;
  docker_compose_location?: string;
  install_command?: string;
  build_command?: string;
  start_command?: string;

  // Runtime configuration
  ports_exposes?: string;
  ports_mappings?: string;
  base_directory?: string;
  publish_directory?: string;

  // Health check
  health_check_enabled?: boolean;
  health_check_path?: string;
  health_check_port?: number;
  health_check_interval?: number;

  // Relations
  environment: CoolifyEnvironment;
  destination: CoolifyDestination;
  server: CoolifyServer;

  // Timestamps
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CoolifyDestination {
  uuid: string;
  name: string;
  network: string;
  server: CoolifyServer;
}

// ============================================
// Deployment Types
// ============================================

export interface CoolifyDeployment {
  uuid: string;
  application_uuid: string;
  status: DeploymentStatus;

  // Git info
  commit_sha?: string;
  commit_message?: string;
  pull_request_id?: number;

  // Timing
  started_at?: string;
  finished_at?: string;

  // Logs
  current_process_id?: string;

  created_at: string;
  updated_at: string;
}

// ============================================
// Environment Variables Types
// ============================================

export interface CoolifyEnvironmentVariable {
  uuid: string;
  key: string;
  value: string;
  is_build_time: boolean;
  is_preview: boolean;
  is_multiline: boolean;
  is_literal: boolean;
  is_shown_once: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// Database Types
// ============================================

export type DatabaseType =
  | "postgresql"
  | "mysql"
  | "mariadb"
  | "mongodb"
  | "redis"
  | "keydb"
  | "dragonfly"
  | "clickhouse";

export interface CoolifyDatabase {
  uuid: string;
  name: string;
  description?: string;
  type: DatabaseType;
  status: ResourceStatus;

  // Connection details
  internal_db_url?: string;
  external_db_url?: string;

  // Configuration
  image: string;

  // Postgres specific
  postgres_user?: string;
  postgres_password?: string;
  postgres_db?: string;
  postgres_initdb_args?: string;
  postgres_host_auth_method?: string;
  postgres_conf?: string;

  // MySQL/MariaDB specific
  mysql_root_password?: string;
  mysql_user?: string;
  mysql_password?: string;
  mysql_database?: string;
  mysql_conf?: string;

  // MongoDB specific
  mongo_initdb_root_username?: string;
  mongo_initdb_root_password?: string;
  mongo_initdb_database?: string;
  mongo_conf?: string;

  // Backup configuration
  is_scheduled_backup_enabled?: boolean;
  backup_frequency?: string;
  backup_retention?: number;

  // Relations
  environment: CoolifyEnvironment;
  destination: CoolifyDestination;
  server: CoolifyServer;

  created_at: string;
  updated_at: string;
}

export interface CoolifyDatabaseBackup {
  uuid: string;
  database_uuid: string;
  filename: string;
  size: number;
  created_at: string;
}

// ============================================
// Service Types (One-click services)
// ============================================

export interface CoolifyService {
  uuid: string;
  name: string;
  description?: string;
  status: ResourceStatus;
  fqdn?: string;

  // Docker compose
  docker_compose_raw?: string;
  docker_compose?: Record<string, unknown>;

  // Relations
  environment: CoolifyEnvironment;
  destination: CoolifyDestination;
  server: CoolifyServer;

  created_at: string;
  updated_at: string;
}

// ============================================
// Logs Types
// ============================================

export interface CoolifyLogLine {
  timestamp: string;
  message: string;
  level?: "info" | "warn" | "error" | "debug";
}

// ============================================
// API Response Wrappers
// ============================================

export interface CoolifyAPIResponse<T> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface CoolifyListResponse<T> {
  data: T[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// ============================================
// API Error Types
// ============================================

export interface CoolifyAPIError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// ============================================
// Webhook Types
// ============================================

export interface CoolifyWebhook {
  uuid: string;
  name: string;
  url: string;
  enabled: boolean;
  events: string[];
  created_at: string;
  updated_at: string;
}

// ============================================
// Team & User Types
// ============================================

export interface CoolifyTeam {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CoolifyTeamMember {
  id: number;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
}

// ============================================
// Version Info
// ============================================

export interface CoolifyVersion {
  version: string;
  status: "success" | "error";
}

// ============================================
// Action Response Types
// ============================================

export interface CoolifyActionResponse {
  message: string;
  deployment_uuid?: string;
}

export interface CoolifyErrorResponse {
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// Application action results
export interface ApplicationActionResult {
  success: boolean;
  message: string;
  deployment_uuid?: string;
}
