### Link to frontend repo : https://github.com/heysujal/hack-to-hire-frontend


# IndiGo Hack to Hire Backend

## Real-Time Indigo-Flight Status and Notification System

### Assumptions
- **Departure Time**: The time at which the flight will depart from the source.
- **Arrival Time**: The time at which the flight will reach the destination.

### Tech Stack
- **Frontend**: React, CSS, JavaScript, TypeScript
- **Backend**: Express, Node.js, 
- **Database**: MongoDB

### Frameworks/Libraries
- **UI Frameworks**: Magic UI, Tailwind CSS, Mantine.dev
- **Frontend**: Zustand, React Router DOM, ThunderClient
- **Backend**: Mongoose, bcrypt, Twilio, Nodemailer, Nodemon

### User Flow
1. Enter flight details (flight ID is optional).
2. View all matching flights.
3. Expand results for more details.
4. Subscribe using email, phone, or app notifications.

### Admin Route
- **Endpoint**: `/api/admin/`
- **Access**: Requires login.
- **Functionality**:
  - Enter a specific flight ID to update details.
  - Editable fields: Scheduled/actual arrival, scheduled/actual departure, gates, status.
  - Read-only fields: Flight number, source, destination.

### APIs
- **Flights API** (`/api/flights/`):
  - `GET /` - Get all flights
  - `POST /` - Create a new flight
  - `GET /search` - Search for flights
  - `GET /:id` - Get a flight by ID

- **Admin API** (`/api/admin/`):
  - `POST /signup` - Admin signup
  - `POST /login` - Admin login
  - `GET /flights/:id` - Get flight details by ID
  - `PUT /flights/:id` - Update flight details by ID

- **Subscription API** (`/api/subscriptions/`):
  - `POST /:flightId/subscribe` - Add a subscriber to a flight
  - `GET /:flightId` - Get all subscribers for a flight

### Design Architecture
- **Models**: Define the schema for flights, admins, and subscriptions.
- **Controllers**: Handle the business logic for each API endpoint.
- **Routes**: Define the endpoints and link them to the appropriate controllers.

### Authentication
- **Admin Login**: Uses bcrypt for password hashing and JWT for authentication.

### Note
I do not own any copyrighted images used in the webapp. They are either taken from Flaticon or IndiGo Website for sake of this project.
