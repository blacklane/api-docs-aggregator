provider "aws" {
  default_tags {
    tags = {
      Team        = "DevEx"
      Application = "api-docs-aggregator"
      Environment = var.environment
      ManagedBy   = "Terraform"
      GitRepo     = "https://github.com/blacklane/api-docs-aggregator"
      Name        = "api-docs-aggregator"
    }
  }
}
