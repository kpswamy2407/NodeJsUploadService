# ForumNXT Node.Js XML Upload Service v1.0.0

This document contains the life cycle of the XML upload services of the ForumNXT application.

## Application behaviour

### General

 1. It must be able to give success/error response in JSON format only.
 2. It must be able to log the debug messages to a local file in the server.
 3. All debug/error logs are stored in *"public/logs/application.log"*path.
 4. It must be able to log the access history to a local file in the server.
 5. All access logs are stored in *"public/logs/access.log"*path.
 6. The logs are rotated at the end of the day.

## Life cycle

### Receive a HTTP request

    POST /xml-upload
    <xml body>
    
    {
        "status": 1,
        "msg": "Sales order has been imported successfully.",
        "data": null
    }
    
    * status: int =  can be either 0 or 1
    * msg: string = Response message
    * data: any = data to pass to the client. Defaults to null

### Save the request body in a file

- Save the request body file with respective of service and requested date with unique file name.
- Sample  file path is as follows *public/uploads/module-name/yyyy-mm-dd/YYYYMMDDHHmmss.SSS.xml*

### Load the corresponding module

 - Analyse the incoming XML and get the module name.
 - Load the corresponding module class from the "modules" folder in the project root directory

### Validate the data

### Import into the database

### Trigger the event hooks

### Write success/failure response to the client.

## Project File Structure

### Naming conventions

 1. Camel casing of the file name is NOT allowed. Use hyphens instead. For example, a class with name "XmlFile" will have the following file name, "xml-file.js".
 2. Folder also follow the same convention as above (1). For example, *"ReceiveSalesOrder"* module can have the following folder name, *"receive-sales-order"*.

### models

 - Model definition for each table will be kept here.
 - All files should be in lower case and must end with ".js" extension.
 - Each file should contain definition of only one table.

### modules

 - Module here refers to the individual service that can be consumed.
 - Modules can import various models from the "models" folder.
 - Immediate children of the "modules" directory must be folders only. 
 - Each folder inside module directory represents the name of the service that is going to be served.

### public

 - Public accessible directory in the server.
 - All XML files passed as request body to the server will be stored here.
 - All log files of the application will be stored here.

### utils

- Its contains the commonly used functions in the application such as helpers etc.

### config

 - Contains the configuration files for database, ActiveMQ,...
 - Environment "env" files are kept here.

## Deployment

### Create a file from the following template and save as "config/env" file.

    # db basic
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

### Testing the connections && checklist

  Test the master database connection before deploying the application.

    tests/db-master
  
  Test the slave (replica) connection before deploying the application.
  
    tests/db-slave


---END OF THE DOCUMENT---