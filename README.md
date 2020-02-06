# AIMS custom rules
This script creating custom alert rules.
#### 1. To use this script need to install NodeJs version LTS locally and npm or yarn.
#### 2. Run command in terminal **_yarn_** or **_npm i_** for install some libs.
#### 3. Fill JSON in the **_data_** folder in the project. 
Some explanations for fields in JSON.

**_masterApiUrl_** <br /> 
* **prod** https://api.aimsinnovation.com/api/

**_credentials_** <br />
User email and password according to the environment

**_data_** <br />
consists of objects with the following values
* **environmentId** id of the environment in which you want to create rules
* **rules**  list of rules
* **nodeIds** list of nodeIds to which the rules apply
<br /><br />
For example,
```
{
  "masterApiUrl": "https://api.aimsinnovation.com/api/",
  "credentials": {
    "email": "your_user_email",
    "password": "*******"
  },
  "data": [
    {
      "environmentId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "rules": [
        {
          "statType":"aims.mssql.size-available-size",
          "period":"day",
          "min":0,
          "max":2,
          "startTimeSeconds":36000,
          "endTimeSeconds":39600
        }
      ],
      "nodeIds": [xxxx, xxxx]
    }
  ]
}
```

#### 4. Run command in a terminal **_yarn start_** or **_npm run start_**
