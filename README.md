# AIMS custom rules
This script creating custom alert rules.
#### 1. To use this script need to install NodeJs version LTS locally and npm or yarn.
#### 2. Run command in terminal **_yarn_** or **_npm i_** for install some libs.
#### 3. Fill JSON in the **_data_** folder in the project. 
Some explanations for fields in JSON.

**_masterApiUrl_** <br /> 
set to one of three values, depending on the environment in which the queries are to be executed
* **alpha** http://test.aimsinnovation.com/api/
* **beta** https://beta-api.aimsinnovation.com/api/
* **prod** https://api.aimsinnovation.com/api/

**_credentials_** <br />
email and password according to the environment (alpha, beta or prod)

**_data_** <br />
consists of objects with the following values
* **environmentId** id of the environment in which you want to create rules
* **rules**  list of rules
* **nodeIds** list of nodeIds to which the rules apply
<br /><br />
For example,
```
{
  "masterApiUrl": "http://test.aimsinnovation.com/api/",
  "credentials": {
    "email": "internal_alert@aimsinnovation.com",
    "password": "*******"
  },
  "data": [
    {
      "environmentId": "c6d56a45-a473-474e-813c-a5a6f6018667",
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
      "nodeIds": [2813, 213123123]
    }
  ]
}
```

#### 4. Run command in a terminal for running script **_yarn start_** or **_npm run start_**
