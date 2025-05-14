provider "aws" {
  assume_role {
    role_arn     = "arn:aws:iam::304609271557:role/terraform-sdlc"
    session_name = "tfagentsdlc"
    duration     = "1h"
  }
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

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
  default_tags {
    tags = {
      Team        = "devex"
      Application = "core-infrastructure"
      Environment = var.environment
      ManagedBy   = "Terraform"
      GitRepo     = "https://github.com/blacklane/aws-core-infrastructure"
      Name        = "core-infrastructure-production-resource"
    }
  }
}
