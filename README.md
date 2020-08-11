
# CloudReport

  

CloudReport is a simple utility written in GO. It generates reports from various cloud sources and user-provided comments. The currently supported cloud sources are: [AWS Trusted Advisor](https://aws.amazon.com/premiumsupport/trustedadvisor/), [AWS Config](https://aws.amazon.com/config/), [Amazon Inspector](https://aws.amazon.com/inspector/), and [AWS Health Notifications](https://aws.amazon.com/premiumsupport/technology/personal-health-dashboard/). The sole purpose of this project is to simplify the effort needed to consolidate the findings from multiple accounts. Utility allows user to provide the comments for documenting exceptions and work in progress. This report is useful when reviewing the cloud compliance with EIS. We can generate this report periodically using Jenkins.

  

Sample Report is [here](https://github.optum.com/pages/cloud-idp/everything-as-code/docs/reports/trustedadvisor.html)

  

## Usage

  

### Run

  

```bash

curl -OL https://github.optum.com/ct-instrumentation/cloud_report/releases/download/v0.4.0-beta/cloudreport

chmod +x cloudreport

mv cloudreport /usr/local/bin

  

cloudreport --help

```

  

### Flags

  

#### Global Flags

  

`--rolearn`: (Optional) Takes the comma separated list of role ARN's. Provided role must have minimum permission needed to pull findings from Trusted Advisor, AWS Config, and Inspector services. Also, your parent account must have trust relationship so it can assume the role. When no role is provided, findings are only from the account associated with provided credentials

  

`--cfile`, `-c`: (Optional) YAML file to provide user comments for each finding. When this file is not provided, each finding is treated as a new finding

  

`--region`, `-r`: (Optional) AWS region to get results from. Default is us-east-1

  

`--output`, `-o`: (Optional) Output of the report. Options: json, table, and mdtable. Default is JSON

  

#### Health Flags

  

`--details`, `-d`: (Optional) Health event descpritons are often very long, thus, by default, it is shortened to three sentences. If this flag is added, then the entire description is printed out.

  

`--pastdays`: (Optional) Number of past days to get results from. Default is all health events that are open / upcoming.

  

### Report Types:

  

Trusted Advisor: `trustedadvisor`, `ta`, `t`

  

Example: `cloudreport get ta --rolearn arn:aws:iam::678910:role/cloudreport`

  

Output (JSON)

  

```json

{

"findings": [

{

"accountId": "123456",

"category": "COST_OPTIMIZING",

"name": "Low Utilization Amazon EC2 Instances",

"description": "Checks the Amazon Elastic Compute Cloud (Amazon EC2) instances that were running at any time during the last 14 days and alerts you if the daily CPU utilization was 10% or less and network I/O was 5 MB or less on 4 or more days. Running instances generate hourly usage charges. Although some scenarios can result in low utilization by design, you can often lower your costs by managing the number and size of your instances.",

"status": "warning",

"resourcesSummary": {

"ResourcesFlagged": 16,

"ResourcesIgnored": 0,

"ResourcesProcessed": 37,

"ResourcesSuppressed": 0

},

"flaggedResources": [

"i-0b18439757faf088a",

"i-095d0079d8546fd8a",

"i-0c5b586ec7e9d7eac",

"i-0e83db48d6de8f40b",

"i-008cceaa442471ec0",

"i-00699354adf9984ad",

"i-076d00ae185881b57",

"i-06faf0349948904c2",

"i-0baaf4989f05861aa",

"i-05663b1bc7e34230f",

"i-0928ccca5a6be3bab",

"i-0bd17acfcd8fd0545",

"i-0a23e343bb9fceb02",

"i-05b2809ba8bdd0b2c",

"i-04ebe8cc56724dda7",

"i-00ea85d920e9dd8cf"

],

"comments": "NEW_FINDING"

},

{

"accountId": "678910",

"category": "SECURITY",

"name": "IAM Use",

"description": "Checks for your use of AWS Identity and Access Management (IAM). You can use IAM to create users, groups, and roles in AWS, and you can use permissions to control access to AWS resources.",

"status": "warning",

"resourcesSummary": {

"ResourcesFlagged": 1,

"ResourcesIgnored": 0,

"ResourcesProcessed": 1,

"ResourcesSuppressed": 0

},

"flaggedResources": [

"NA"

],

"comments": "**EXCEPTION:** We use Federation and IAM roles to manage resources in AWS . No users/groups created in IAM"

},

],

"reportTime": "08 Oct 19 10:44 CDT"

```

  

AWS Config: `awsconfig`, `ac`, `a`

Example: `cloudreport get ac --region us-east-1 -o table`

  

Output (ASCII Table)

  

```txt

Report Time: 11 Oct 19 13:27 CDT

  

+--------------+---------------------------------------------+--------------------------------+-------------+

| ACCOUNT ID | NAME | FLAGGED RESOURCES | COMMENTS |

+--------------+---------------------------------------------+--------------------------------+-------------+

| 123456789101 | ALL_OPEN_INBOUND_PORTS_SECURITY_GROUP_CHECK | Resource Type: | NEW_FINDING |

| | | AWS::EC2::SecurityGroup | |

| | | sg-05e158d56c8b25319 | |

| | | sg-06f5d09fb147a86b0 | |

+--------------+---------------------------------------------+--------------------------------+-------------+

| 123456789101 | ATTACHED_INTERNET_GATEWAY_CHECK | Resource Type: AWS::EC2::VPC | NEW_FINDING |

| | | vpc-00e4cb50ec84cd503 | |

| | | vpc-5127f92a vpc-b892fac3 | |

+--------------+---------------------------------------------+--------------------------------+-------------+

| 123456789101 | CF_WITH_S3_ORIGIN_ONLY_ALLOWS_CF_READ_CHECK | Resource Type: | NEW_FINDING |

| | | AWS::CloudFront::Distribution | |

| | | E3RZWKT1AZ6RXD EELB4I9ZS38XE | |

+--------------+---------------------------------------------+--------------------------------+-------------+

```

  

Inspector: `inspector`, `ins`, `i`

  

Example: `cloudreport get inspector --cfile my-comments.yaml --output mdtable`

  

Output (Markdown Table)

  

```markdown

Report Time: 11 Oct 19 13:32 CDT

  

| ACCOUNT ID | RULE PACKAGES | HIGH | MEDIUM | LOW | INFORMATIONAL | COMMENTS |

|--------------|--------------------------------|------|--------|-----|---------------|--------------------------------|

| 757541135089 | CIS Operating System Security | 2992 | 0 | 0 | 272 | **EXCEPTION:** Description |

| | Configuration Benchmarks-1.0 | | | | | here |

| | Common Vulnerabilities and | 454 | 347 | 28 | 0 | NEW_FINDING |

| | Exposures-1.1 | | | | | |

| 757541135089 | Runtime Behavior Analysis-1.0 | 0 | 0 | 19 | 42 | NEW_FINDING |

| | Security Best Practices-1.0 | | | 0 | 0 | |

  
  

| ACCOUNT ID | AMI | AGE |

|--------------|---------------------------------------------------------------------------------|---------|

| 757541135089 | encrypted-amzn2-ami-k8s-2.0-ssm-ossec-awslogs-inspector-2019-09-22 | 19 days |

| | encrypted-amzn2-ami-kafkaproxy-1.0-ssm-ossec-awslogs-inspector-certs-2019-09-05 | 36 days |

| | encrypted-amazon-eks-1.14-node-ssm-ossec-awslogs-inspector-2019-10-01 | 9 days |

```

  

Health: `health`, `he`, `h`

  

Example: `cloudreport get health --cfile my-comments.yaml --output mdtable`

  

Output (Markdown Table)

  

``` markdown

Report Time: 24 Feb 20 16:09 CST

| ACCOUNT ID | EVENT TYPE CODE | REGION | STATUS CODE | EVENT DESCRIPTION | AFFECTED RESOURCES | COMMENTS |

|--------------|--------------------------------|-----------|-------------|---------------------------------------|-------------------------------------------|-------------|

| 757541135089 | Rds Security Notification | us-east-2 | open | You're receiving this message | oid-global-stage-instance-0 | NEW_FINDING |

| | | | | because you have one or more | | |

| | | | | Amazon RDS database instances | | |

| | | | | that need action, listed | | |

| | | | | in the 'Affected resources' | | |

| | | | | tab in your Personal | | |

| | | | | Health Dashboard. In this | | |

| | | | | notification, we provide new | | |

| | | | | information about your Amazon | | |

| | | | | RDS certificate authority | | |

| | | | | (CA) certificate updates. We | | |

| | | | | are sending this information | | |

| | | | | to help make your certificate | | |

| | | | | rotations simpler and to give | | |

| | | | | you more control over the | | |

| | | | | rotation process. | | |

| 757541135089 | Rds Security Notification | us-east-2 | open | We previously sent a | oid-global-stage-instance-0, | NEW_FINDING |

| | | | | communication in early October | oid-global-dev-instance-0 | |

| | | | | to update your RDS SSL/TLS | | |

| | | | | certificates by October 31, | | |

| | | | | 2019. We have extended the | | |

| | | | | dates and now request that | | |

| | | | | you act before February 5, | | |

| | | | | 2020 to avoid interruption | | |

| | | | | of your applications that use | | |

| | | | | Secure Sockets Layer (SSL) | | |

| | | | | or Transport Layer Security | | |

| | | | | (TLS) to connect to your RDS | | |

| | | | | and Aurora database instances. | | |

| | | | | Note that this new date is | | |

| | | | | only 4 weeks before the actual | | |

| | | | | Certificate Authority (CA) | | |

| | | | | expiration on March 5, 2020. | | |

```

  

Sample cfile format:

  

```yaml

- accountid: '757541135089'

ta-findings:

- SECURITY-IAM_Use: '**EXCEPTION:** We use Federation and IAM roles to manage resources in AWS . No users/groups created in IAM'

config-findings:

- IAM_POLICY_BLACKLISTED_CHECK: '**EXCEPTION:** Removed the AdminstratorAccess policy since the default AWS_*_Admins uses the policy. Future enhancement would be to create a Custom Rule that no other Role can use the AdmnistratorAccess policy besides the AWS_*_Admins'

inspector-findings:

- CIS_Operating_System_Security_Configuration_Benchmarks-1.0: '**EXCEPTION:*** Description here'

health-findings:

- AWS_RDS_SECURITY_NOTIFICATION: "**EXCEPTION:** Description here"

```

  

Sample Policy and Assume role:

  

```hcl

data "aws_iam_policy_document" "cloudreport_policy" {

statement {

effect = "Allow"

  

actions = [

"support:*",

"config:GetComplianceSummaryByConfigRule",

"config:GetComplianceDetailsByConfigRule",

"config:DescribeComplianceByConfigRule",

"config:DescribeComplianceByResource",

"config:DescribeConfigRules",

"health:DescribeEvents",

"health:DescribeEventDetails",

"health:DescribeAffectedEntities",

"inspector:GetAssessmentReport",

"inspector:ListAssessmentRuns",

"ec2:DescribeInstances",

"ec2:DescribeImages",

]

resources = ["*"]

}

}

  

data "aws_iam_policy_document" "cloudreport_assume_role" {

statement {

effect = "Allow"

  

actions = [

"sts:AssumeRole",

]

  

principals {

type = "AWS"

identifiers = ["arn:aws:iam::757541135089:role/AWS_757541135089_Service"]

}

}

}

  
  

resource "aws_iam_role" "cloudreport_role" {

name = "cloudreport"

assume_role_policy = "${data.aws_iam_policy_document.cloudreport_assume_role.json}"

}

  

resource "aws_iam_role_policy" "cloudreport_policy" {

name = "cloudreport"

role = "${aws_iam_role.cloudreport_role.id}"

policy = "${data.aws_iam_policy_document.cloudreport_policy.json}"

}

```
AWS ECR Image scan findings : `ecrsan`, `scan`, `s`

Example: `cloudreport get scan --region us-east-1 -o json`

Sample Output(JSON)
```json
"findings": [
    
    {
      "image_digest": "sha256:88d5da4609681df482d51c4e898d107317c32bd3c4951793138570cc18c1294d",
      "image_tag": "latest",
      "repository_name": "oid/pingfederate-server",
      "image_findings_count": {
        "HIGH": 1
      }
    },
    {
      "image_digest": "sha256:99d0ab34e24a87884b104e76dea5d917ab026c0cfc352bc9cf2665d5d70f973a",
      "image_tag": "nonprod-2020-06-30.040638",
      "repository_name": "oid/service-gateway",
      "image_findings_count": {
        "HIGH": 5,
        "MEDIUM": 4
      }
    }
```
esrscan image will also take optional parameter tag as first argument. For example
`cloudreport get scan 6.8.6-v2 -o table`

Sample output with table format, with specific tag "6.8.6-v2"
```table
Report Time:  04 Aug 20 16:13 EDT
+--------------+----------+-----------------+-------------------------------------------------------------------------+------------------------+
|  ACCOUNT ID  |   TAG    | REPOSITORY NAME |                                 DIGEST                                  | VULNERABILITIES(COUNT) |
+--------------+----------+-----------------+-------------------------------------------------------------------------+------------------------+
| 044014527626 | 6.8.6-v2 | admin/filebeat  | sha256:fb73dba9945cd8154532676d11b0d8310cbed5a2b4f71680128540f3f2a42848 |  MEDIUM : 2            |
|              |          |                 |                                                                         | INFORMATIONAL          |
|              |          |                 |                                                                         | : 27  LOW : 6          |
|              |          |                 |                                                                         | UNDEFINED : 3          |
+--------------+----------+-----------------+-------------------------------------------------------------------------+------------------------+

```

**Note**: Support doesn't let you allow or deny access to individual actions. Therefore, the Action element of a policy is always set to support:*.

Similarly, Support & Inspector don't provide resource-level access, so the Resource element is always set to *. Need access to EC2 for getting AMI information

  

### Build

  

CloudReport uses the Go Modules support built into Go 1.11. Make sure installed go version is at least 1.11

  

`go build -o cloudreport` OR `make build`

  

Build for different Target OS and Platform:

  

`env GOOS=<target-OS> GOARCH=<target-architecture> go build -o cloudreport`

  

OR

  

`make compile`

* This will compile the 64-bit binaries for Linux, Windows, and Mac

  

## Example

  

An example use case is [here](https://github.optum.com/cloud-idp/everything-as-code/tree/preprod/documents/cloudreport)

  

## Testing

  

Running the tests: `make test`

  

Testing methodolgy:

  

CloudReport tests are written using the [GoMock](https://github.com/golang/mock) mocking framework and table-driven tests.

  

A few of the reasons we chose to use GoMock are:

1. Allows us to write tests for functions that make API calls without actually making the call.

  

2. Integrates well with the standard library testing package: `testing`.

  

Examples of these tests can be found under the `pkg/aws` and `pkg/cloudreport` folders

  

The mocks that were generated can be found under the `pkg/mocks` folder and the commands used to generate them can be found [here](https://github.optum.com/ct-instrumentation/cloud_report/pkg/mocks/README.md)

  

Read more about GoMock and table driven tests using the links below:

* https://blog.codecentric.de/en/2017/08/gomock-tutorial/

* https://www.philosophicalhacker.com/post/getting-started-with-gomock/

* https://www.philosophicalhacker.com/post/table-driven-tests-with-gomock/