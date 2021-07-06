# The Wall App - Frontend

The frontend is hosted on Heroku: https://the-wall-app-frontend.herokuapp.com

The backend is hosted on heroku: https://the-wall-app-backend.herokuapp.com

## Installation
Clone the project and install it's dependencies.

```bash
git clone git@github.com:Ronan-Fernandes/the_wall_app_frontend.git  
# or
git clone https://github.com/Ronan-Fernandes/the_wall_app_frontend.git

cd the_wall_app_frontend

npm install
#or
yarn install
```

Create a .env file in project root and configure the environment variables.
```bash
REACT_APP_BASE_URL=https://the-wall-app-backend.herokuapp.com # if you want to use the production backend
#or
REACT_APP_BASE_URL=http://localhost:3333 # if you want to use the backend running locally
```

## usage
Once the variables are ready you can start [the backend app](https://github.com/Ronan-Fernandes/the_wall_app_backend) locally or use the production backend link,
once you have the backend ready you can start the frontend.

```bash
npm start
#or
yarn start
```

## improvements to do
- [ ] Tests
- [ ] Better styles
- [ ] Better components
