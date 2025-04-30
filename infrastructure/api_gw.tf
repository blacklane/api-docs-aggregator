resource "aws_api_gateway_rest_api" "github-proxy-api" {
  name        = aws_lambda_function.github-proxy.function_name
  description = "API that call Lambda function GithubProxy "
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.github-proxy-api.id
  resource_id   = aws_api_gateway_rest_api.github-proxy-api.root_resource_id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "method-options" {
  rest_api_id   = aws_api_gateway_rest_api.github-proxy-api.id
  resource_id   = aws_api_gateway_rest_api.github-proxy-api.root_resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda-integration" {
  rest_api_id             = aws_api_gateway_rest_api.github-proxy-api.id
  resource_id             = aws_api_gateway_rest_api.github-proxy-api.root_resource_id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  uri                     = aws_lambda_function.github-proxy.invoke_arn
  type                    = "AWS_PROXY"
}

resource "aws_api_gateway_integration" "lambda-integration-mock" {
  rest_api_id             = aws_api_gateway_rest_api.github-proxy-api.id
  resource_id             = aws_api_gateway_rest_api.github-proxy-api.root_resource_id
  http_method             = aws_api_gateway_method.method-options.http_method
  integration_http_method = "POST"
  uri                     = aws_lambda_function.github-proxy.invoke_arn
  type                    = "MOCK"
  timeout_milliseconds    = 29000

  request_templates = {
    "application/json" = file("${path.module}/params_api_gw.json")
  }
}

resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.lambda-integration,
    aws_api_gateway_integration.lambda-integration-mock
  ]
  rest_api_id = aws_api_gateway_rest_api.github-proxy-api.id
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "api_stage" {
  stage_name    = "prod"
  rest_api_id   = aws_api_gateway_rest_api.github-proxy-api.id
  deployment_id = aws_api_gateway_deployment.api_deployment.id
}

data "aws_iam_policy_document" "gw-policy-docuemnt" {
  statement {
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions   = ["execute-api:Invoke"]
    resources = ["${aws_api_gateway_rest_api.github-proxy-api.execution_arn}/*"]

    condition {
      test     = "IpAddress"
      variable = "aws:SourceIp"
      values   = 
    }
  }
}

resource "aws_api_gateway_rest_api_policy" "gw-policy" {
  rest_api_id = aws_api_gateway_rest_api.github-proxy-api.id
  policy      = data.aws_iam_policy_document.gw-policy-docuemnt.json
}
