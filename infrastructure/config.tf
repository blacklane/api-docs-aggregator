terraform {
  cloud {
    organization = "blacklane"

    workspaces {
      tags = ["api-docs-aggregator"]
    }
  }
}
