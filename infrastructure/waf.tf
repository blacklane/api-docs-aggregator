resource "aws_wafv2_ip_set" "allowed_ips" {
  provider           = aws.us-east-1
  name               = "allowed-ips"
  description        = "Allowed Office IPs for api-docs"
  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"

  addresses = [
    "46.189.27.100/32",
    "93.241.23.242/32",
    "87.128.42.122/32"
  ]
}

resource "aws_wafv2_web_acl" "ip_restrict_acl" {
  provider    = aws.us-east-1
  name        = "cloudfront-ip-restrict"
  description = "Access to api-docs only allowed from Office IPs"
  scope       = "CLOUDFRONT"
  default_action {
    block {
      custom_response {
        response_code = 403
        custom_response_body_key = "accessDeniedBody"
      }
    }
  }

  rule {
    name     = "AllowListedIPs"
    priority = 1

    action {
      allow {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.allowed_ips.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AllowListedIPs"
      sampled_requests_enabled   = true
    }
  }

  custom_response_body {
    key          = "accessDeniedBody"
    content_type = "TEXT_PLAIN"
    content      = "Access Denied"
  }
  
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "CloudFrontWebACL"
    sampled_requests_enabled   = true
  }
}
