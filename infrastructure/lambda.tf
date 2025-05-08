resource "aws_iam_role" "lambda_exec" {
  name = "GithubProxyLambda"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_policy" "create_ec2_interfaces" {
  name        = "CreteEC2Interfaces"
  path        = "/"
  description = "Creating interfaces for Lambda"

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "ec2:*",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "custom-policies" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.create_ec2_interfaces.arn
}

resource "aws_cloudwatch_log_group" "github-proxy" {
  name              = "/aws/lambda/${aws_lambda_function.github-proxy.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_function" "github-proxy" {
  filename      = "${path.module}/github_proxy.zip"
  function_name = "GithubProxy"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "lambda_function.lambda_handler"
  description   = "Lambda used as proxy to access to files in private Github repository"
  architectures = ["x86_64"]
  timeout       = 10

  runtime = "python3.12"
  lifecycle {
    ignore_changes = all
  }
  environment {
    variables = {
      GITHUB_TOKEN = ""
    }
  }

  vpc_config {
    subnet_ids = [""]
    security_group_ids = []
  }
}
