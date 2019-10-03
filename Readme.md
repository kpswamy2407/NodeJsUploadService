# ForumNXT XML Upload Service v1.0.0

This document contains the life cycle of the XML upload services of the ForumNXT application.

### Requirements

 - Server must be able to give success/error response in JSON format only.
 - Server must be able to log the debug messages to a local file in the server. ***File path** "public/logs/application.log"*
 - Server must be able to log the access history to a local file in the server. ***File path** "public/logs/access.log"*

## Life cycle

### Receive a HTTP request

    POST /xml-upload
    
    <xml body>

### Save the request body in a file
- Save the request body file with respective of service and requested date with unique file name. Sample  folder structure as follows public/uploads/xrSalesOrder/01-10-2019/xxxxxxx1234568888990.xml

### Load the corresponding module

### Validate the data

### Import into the database

### Write success/failure response to the client.

    {
        "status": 1,
        "msg": "Sales order has been imported successfully.",
        "data": null
    }
    
    * status: int =  can be either 0 or 1
    * msg: string = Response message
    * data: any = data to pass to the client. Defaults to null

## Project File Structure

### models

 - Model definition for each table will be kept here.
 - All files should be in lower case and must end with ".js" extension.
 - Each file should contain defintion of only one table.

### modules

 - Module here refers to the service.
 - Modules import various models while importing the XML into the database.
 - "modules" directory should contain only folders. 
 - Each folder inside module directory represents the name of the service that is going to be served.
 - Each folder inside modules directory must be in lower case.
  - **Eg.,** salesorder

### public

 - Public accessible directory in the server.
 - All XML files passed as request body to the server will be stored here.
 - All log files of the application will be stored here.
### utils
- Its contains the commonly used functions in the application such as helpers etc.
### config

 - Contains the configuration files for database, ActiveMQ,...
 - Environment ".env" files are kept here.

### Create a file from the following template and save as "config/env" file.

    #1 db basic
    FNXT_MYSQLDB=database_name
    FNXT_MYSQLPORT=3306
    # master
    FNXT_MYSQLHOST=some-db-host.com
    FNXT_MYSQLUSER=username
    FNXT_MYSQLPWD=password@123
    # slave
    FNXT_MYSQL_SLAVE_HOST=some-db-host.com
    FNXT_MYSQL_SLAVE_USER=username
    FNXT_MYSQL_SLAVE_PWD=password@123
