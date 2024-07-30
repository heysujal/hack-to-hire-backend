### Link to frontend repo : https://github.com/heysujal/hack-to-hire-frontend


# IndiGo Hack to Hire Backend

## How to run the project ?
1. Open termianl and run `npm i`
2. create a `.env file` which looks like this
    ```
    PORT=3000
    DB_CONNECT=<YOUR_MONGO_URI>
    EMAIL_USER=<YOUR_GMAIL_ID>
    EMAIL_APP_PASSWORD=<YOUR_GMAIL_ID_GOOGLE_APP_PASSWORD>
    TWILIO_ACCOUNT_SID=<TWILIO_ACCOUNT_SID>
    TWILIO_AUTH_TOKEN=<TWILIO_AUTH_TOKEN>
    TWILIO_PHONE_NUMBER=<YOUR_TWILIO_PHONE_NUMBER>
    ```

    For twilio credentials visit their console
    For EMAIL_APP_PASSWORD. Go to setting of your gmail accout and search for App Passwords in Security settings.
Create a new app name and copy the password.

3. Run `npm run dev`

## APIs usage with sample body and response
> Note: Helper APIs may come handly in development and can be used for extending the project with new features. They are not being used directly at the moment.

### Flights APIs

#### `POST` -  `/api/flights/`  (helper API)
##### Body: 
```json
{
  "flight_id": "6E 1007",
  "airline": "Indigo",
  "status": "Delayed",
  "departure_gate": "K11",
  "arrival_gate": "L12",
  "scheduled_departure": "2024-08-03T22:00:00Z",
  "scheduled_arrival": "2024-08-03T00:00:00Z",
  "actual_departure": null,
  "actual_arrival": null,
  "from": "DEL",
  "to": "BLR"
} 
```

##### Response:
```json
{
  "flight_id": "6E 1007",
  "airline": "Indigo",
  "status": "Delayed",
  "departure_gate": "K11",
  "arrival_gate": "L12",
  "scheduled_departure": "2024-08-03T22:00:00.000Z",
  "scheduled_arrival": "2024-08-03T00:00:00.000Z",
  "actual_departure": null,
  "actual_arrival": null,
  "from": "DEL",
  "to": "BLR",
  "_id": "66a95f65a6f06e95f14c7e98",
  "__v": 0
}

```

#### `GET` -  `/api/flights/search?from=<SOURCE_CODE>&to=<DEST_CODE>&date=<YYYY_MM_DD_FORMAT_DATE>&flight_id=<FLIGHT_ID>`
#### Example: `/api/flights/search?from=DEL&to=BLR&date=2024-08-03&flight_id=6E 1003`
> Note: The space present after "6E" in above API is intentional

##### Response:
```json
[
  {
    "_id": "66a7c576c7a76b3d4070390a",
    "flight_id": "6E 1003",
    "airline": "Indigo",
    "status": "Cancelled",
    "departure_gate": "E5",
    "arrival_gate": "F6",
    "scheduled_departure": "2024-08-03T13:00:00.000Z",
    "scheduled_arrival": "2024-08-05T15:00:00.000Z",
    "actual_departure": null,
    "actual_arrival": null,
    "from": "DEL",
    "to": "BLR",
    "__v": 0
  }
]

```
>Other helper APIs like getFlightById and getAllFlights are also present.


### Subscription APIs

#### `POST` -  `/api/subscriptions/<FLIGHT_ID>/subscribe`
#### Example : `/api/subscriptions/6E 1004/subscribe`
Saves all the subscribers of a particular flightId
##### Body: 
```json
{
    "contactInfo": "sujal@gmail.com",
    "notificationMethod" :"email"
}
```

##### Response:
```json
{
  "flightId": "6E 1004",
  "subscribers": [
    {
      "contactInfo": "sujal@gmail.com",
      "notificationMethod": "email",
      "_id": "66a96743a6f06e95f14c7ea3"
    }
  ],
  "_id": "66a96743a6f06e95f14c7ea2",
  "__v": 0
}

```
#### `GET` -  `/api/subscriptions/<FLIGHT_ID>/`

#### Example : `/api/subscriptions/6E 1004/`
Saves all the subscribers of a particular flightId

##### Response: An Array of all subscribers details
```json
[
  {
    "contactInfo": "sujal@gmail.com",
    "notificationMethod": "email",
    "_id": "66a96743a6f06e95f14c7ea3"
  }
]

```

### Admin APIs

#### `POST` -  `/api/admin/signup`

##### Body: 
```json
{
    "username": "example",
    "password": "pass123"
}
```

##### Response:
```json
{
  "message": "Admin registered successfully"
}

```
#### `POST` -  `/api/admin/login`

##### Body: 
```json
{
    "username": "example",
    "password": "pass123"
}
```

##### Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTk2YWRmYTZmMDZlOTVmMTRjN2ViMiIsInVzZXJuYW1lIjoiZXhhbXBsZSIsImlhdCI6MTcyMjM3OTA3MiwiZXhwIjoxNzIyMzgyNjcyfQ.EMnxnYJCdMgKApMavCXywpi4RxZkvfBD-aPF5QAPNc8",
  "isVerified": true,
  "message": "User Verified"
}

```
#### `GET` -  `/api/admin/flights/<FLIGHT_ID>`
#### Example:  `/api/admin/flights/6E 1003`
Forms the part of Admin UI so that he gets prefilled values in the update form

##### Response:
```json
{
  "_id": "66a7c576c7a76b3d4070390a",
  "flight_id": "6E 1003",
  "airline": "Indigo",
  "status": "Cancelled",
  "departure_gate": "E5",
  "arrival_gate": "F6",
  "scheduled_departure": "2024-08-03T13:00:00.000Z",
  "scheduled_arrival": "2024-08-05T15:00:00.000Z",
  "actual_departure": null,
  "actual_arrival": null,
  "from": "DEL",
  "to": "BLR",
  "__v": 0
}
```