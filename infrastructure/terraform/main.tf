# School MIS - Terraform Configuration
# Infrastructure as Code for Cloudflare deployment

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }

  required_version = ">= 1.0"

  # Uncomment for remote state management
  # backend "s3" {
  #   bucket = "school-mis-terraform-state"
  #   key    = "production/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

# Cloudflare Provider Configuration
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Variables
variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "zone_id" {
  description = "Cloudflare Zone ID for custom domain"
  type        = string
  default     = ""
}

variable "domain" {
  description = "Primary domain for the application"
  type        = string
  default     = "school.aryaminakshi.workers.dev"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production."
  }
}

variable "neon_database_url" {
  description = "Neon PostgreSQL connection string"
  type        = string
  sensitive   = true
}

variable "upstash_redis_url" {
  description = "Upstash Redis REST URL"
  type        = string
}

variable "upstash_redis_token" {
  description = "Upstash Redis REST Token"
  type        = string
  sensitive   = true
}

variable "better_auth_secret" {
  description = "Better Auth secret key"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
  default     = ""
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "github_client_id" {
  description = "GitHub OAuth Client ID"
  type        = string
  default     = ""
}

variable "github_client_secret" {
  description = "GitHub OAuth Client Secret"
  type        = string
  sensitive   = true
  default     = ""
}

variable "sentry_dsn" {
  description = "Sentry DSN for error tracking"
  type        = string
  sensitive   = true
  default     = ""
}

variable "datadog_api_key" {
  description = "Datadog API Key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_secret_key" {
  description = "Stripe Secret Key"
  type        = string
  sensitive   = true
  default     = ""
}

variable "stripe_webhook_secret" {
  description = "Stripe Webhook Secret"
  type        = string
  sensitive   = true
  default     = ""
}

# Local values
locals {
  project_name = "school-mis"
  environment_suffix = var.environment == "production" ? "" : "-${var.environment}"
  full_domain  = var.environment == "production" ? var.domain : "${var.environment}.${var.domain}"
}

# ============================================================================
# CLOUDFLARE PAGES (Frontend)
# ============================================================================

resource "cloudflare_pages_project" "frontend" {
  account_id        = var.cloudflare_account_id
  project_name      = "${local.project_name}-web${local.environment_suffix}"
  production_branch = "main"

  build_config {
    build_command   = "bun run build --filter=@school/web"
    destination_dir = "apps/web/dist"
    root_dir        = "/"
  }

  source {
    type = "github"
    config {
      owner                         = "aryaminakshi71"
      repo_name                     = "school-mis"
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "all"
      preview_branch_includes       = ["*"]
    }
  }

  deployment_configs {
    production {
      compatibility_date  = "2024-01-01"
      compatibility_flags = ["nodejs_compat"]
      
      environment_variables = {
        NODE_ENV             = "production"
        VITE_PUBLIC_SITE_URL = "https://${local.full_domain}"
        VITE_API_URL         = "https://api.${local.full_domain}"
      }

      kv_namespaces {
        namespace_id = cloudflare_workers_kv_namespace.cache.id
      }
    }

    preview {
      compatibility_date  = "2024-01-01"
      compatibility_flags = ["nodejs_compat"]
      
      environment_variables = {
        NODE_ENV             = "development"
        VITE_PUBLIC_SITE_URL = "https://preview.${local.full_domain}"
        VITE_API_URL         = "https://api-preview.${local.full_domain}"
      }
    }
  }
}

# ============================================================================
# CLOUDFLARE WORKERS (Backend API)
# ============================================================================

resource "cloudflare_workers_script" "api" {
  account_id = var.cloudflare_account_id
  script_name = "${local.project_name}-api${local.environment_suffix}"
  
  content = file("${path.module}/worker.js")
  
  module = true
  
  compatibility_date  = "2024-01-01"
  compatibility_flags = ["nodejs_compat"]

  plain_text_binding {
    name = "NODE_ENV"
    text = var.environment
  }

  plain_text_binding {
    name = "BETTER_AUTH_URL"
    text = "https://api.${local.full_domain}"
  }

  plain_text_binding {
    name = "UPSTASH_REDIS_REST_URL"
    text = var.upstash_redis_url
  }

  secret_text_binding {
    name = "DATABASE_URL"
    text = var.neon_database_url
  }

  secret_text_binding {
    name = "UPSTASH_REDIS_REST_TOKEN"
    text = var.upstash_redis_token
  }

  secret_text_binding {
    name = "BETTER_AUTH_SECRET"
    text = var.better_auth_secret
  }

  secret_text_binding {
    name = "GOOGLE_CLIENT_ID"
    text = var.google_client_id
  }

  secret_text_binding {
    name = "GOOGLE_CLIENT_SECRET"
    text = var.google_client_secret
  }

  secret_text_binding {
    name = "GITHUB_CLIENT_ID"
    text = var.github_client_id
  }

  secret_text_binding {
    name = "GITHUB_CLIENT_SECRET"
    text = var.github_client_secret
  }

  secret_text_binding {
    name = "SENTRY_DSN"
    text = var.sentry_dsn
  }

  secret_text_binding {
    name = "DATADOG_API_KEY"
    text = var.datadog_api_key
  }

  secret_text_binding {
    name = "STRIPE_SECRET_KEY"
    text = var.stripe_secret_key
  }

  secret_text_binding {
    name = "STRIPE_WEBHOOK_SECRET"
    text = var.stripe_webhook_secret
  }

  kv_namespace_binding {
    binding         = "CACHE"
    namespace_id    = cloudflare_workers_kv_namespace.cache.id
  }
}

# KV Namespace for caching
resource "cloudflare_workers_kv_namespace" "cache" {
  account_id = var.cloudflare_account_id
  title      = "${local.project_name}-cache${local.environment_suffix}"
}

# Worker route
resource "cloudflare_workers_route" "api" {
  count       = var.zone_id != "" ? 1 : 0
  zone_id     = var.zone_id
  pattern     = "api.${local.full_domain}/*"
  script_name = cloudflare_workers_script.api.script_name
}

# ============================================================================
# CLOUDFLARE R2 (Storage)
# ============================================================================

resource "cloudflare_r2_bucket" "storage" {
  account_id = var.cloudflare_account_id
  bucket_name = "${local.project_name}-storage${local.environment_suffix}"
  location   = "APAC"
}

# ============================================================================
# CLOUDFLARE D1 (Edge Database for caching/sessions)
# ============================================================================

resource "cloudflare_d1_database" "edge_cache" {
  account_id = var.cloudflare_account_id
  name       = "${local.project_name}-edge-cache${local.environment_suffix}"
}

# ============================================================================
# DNS RECORDS (if using custom domain)
# ============================================================================

resource "cloudflare_record" "api" {
  count   = var.zone_id != "" ? 1 : 0
  zone_id = var.zone_id
  name    = "api${local.environment_suffix}"
  type    = "CNAME"
  content = "${cloudflare_workers_script.api.script_name}.${var.cloudflare_account_id}.workers.dev"
  proxied = true
  ttl     = 1 # Auto
}

resource "cloudflare_record" "www" {
  count   = var.zone_id != "" ? 1 : 0
  zone_id = var.zone_id
  name    = "www${local.environment_suffix}"
  type    = "CNAME"
  content = cloudflare_pages_project.frontend.subdomain
  proxied = true
  ttl     = 1 # Auto
}

# ============================================================================
# RATE LIMITING RULES
# ============================================================================

resource "cloudflare_ruleset" "rate_limiting" {
  count       = var.zone_id != "" ? 1 : 0
  zone_id     = var.zone_id
  name        = "Rate limiting rules"
  description = "Rate limiting rules for School MIS API"
  kind        = "zone"
  phase       = "http_ratelimit"

  rules {
    action = "block"
    action_parameters {
      response {
        status_code = 429
        content     = "Rate limit exceeded. Please try again later."
        content_type = "text/plain"
      }
    }
    ratelimit {
      characteristics = [
        "cf.colo.id",
        "ip.src"
      ]
      period              = 60
      requests_per_period = 100
      mitigation_timeout  = 60
      counting_expression = "true"
    }
    expression  = "(http.request.uri.path contains \"/api/\")"
    description = "API rate limiting"
    enabled     = true
  }

  rules {
    action = "block"
    action_parameters {
      response {
        status_code = 429
        content     = "Too many login attempts. Please try again later."
        content_type = "text/plain"
      }
    }
    ratelimit {
      characteristics = ["ip.src"]
      period              = 300
      requests_per_period = 10
      mitigation_timeout  = 300
      counting_expression = "true"
    }
    expression  = "(http.request.uri.path contains \"/api/auth/\")"
    description = "Auth endpoint rate limiting"
    enabled     = true
  }
}

# ============================================================================
# WAF RULES (Security)
# ============================================================================

resource "cloudflare_ruleset" "waf_custom" {
  count       = var.zone_id != "" ? 1 : 0
  zone_id     = var.zone_id
  name        = "Custom WAF rules"
  description = "Custom WAF rules for School MIS"
  kind        = "zone"
  phase       = "http_request_firewall_custom"

  rules {
    action      = "block"
    expression  = "(http.user_agent contains \"bot\") and not (http.user_agent contains \"Googlebot\") and not (http.user_agent contains \"Bingbot\")"
    description = "Block bad bots"
    enabled     = true
  }

  rules {
    action      = "challenge"
    expression  = "(http.request.uri.path contains \"/api/auth\") and (ip.geoip.country in {\"CN\" \"RU\" \"KP\"})"
    description = "Challenge suspicious auth requests"
    enabled     = true
  }
}

# ============================================================================
# OUTPUTS
# ============================================================================

output "frontend_url" {
  description = "Frontend Pages URL"
  value       = "https://${cloudflare_pages_project.frontend.subdomain}"
}

output "api_url" {
  description = "API Worker URL"
  value       = "https://${cloudflare_workers_script.api.script_name}.${var.cloudflare_account_id}.workers.dev"
}

output "pages_project_name" {
  description = "Cloudflare Pages project name"
  value       = cloudflare_pages_project.frontend.project_name
}

output "worker_script_name" {
  description = "Cloudflare Worker script name"
  value       = cloudflare_workers_script.api.script_name
}

output "kv_namespace_id" {
  description = "KV Namespace ID for caching"
  value       = cloudflare_workers_kv_namespace.cache.id
}

output "r2_bucket_name" {
  description = "R2 bucket name for storage"
  value       = cloudflare_r2_bucket.storage.bucket_name
}

output "d1_database_id" {
  description = "D1 database ID for edge caching"
  value       = cloudflare_d1_database.edge_cache.id
}
