<h1 align="center">Restful CRUD API for CardMesh</h1>

[![CI status](https://github.com/CardMesh/rest-api/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/CardMesh/rest-api/actions/workflows/ci.yml)
[![Contributors](https://img.shields.io/github/contributors/CardMesh/rest-api.svg)](https://github.com/CardMesh/rest-api/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/CardMesh/rest-api.svg)](https://github.com/CardMesh/rest-api/network/members)
[![Stargazers](https://img.shields.io/github/stars/CardMesh/rest-api.svg)](https://github.com/CardMesh/rest-api/stargazers)
[![Issues](https://img.shields.io/github/issues/CardMesh/rest-api.svg)](https://github.com/CardMesh/rest-api/issues)
[![MIT License](https://img.shields.io/github/license/CardMesh/rest-api.svg)](https://github.com/CardMesh/rest-api/blob/develop/LICENSE.txt)

CardMesh is an app aimed at modernizing the sharing of business cards within a company. It displays digital business
cards in a web browser, accessible via NFC tags, QR codes, or direct URLs.

### Versions & Dependencies

| Version | Documentation |
|---------|---------------|
| 1.0.0   | current       |

### Requirements

- `Node.js` >= 20.0

## Documentation

### Explore the REST API

The app defines the following CRUD APIs.

### Auth

| Method | Url               | Description | 
|--------|-------------------|-------------|
| POST   | /api/auth/signup  | Sign up     |
| POST   | /api/auth/login   | Log in      |
| POST   | /api/auth/recover | Recover     |
| PUT    | /api/auth/reset   | Reset       |

### Users

| Method | Url                              | Description                               |
|--------|----------------------------------|-------------------------------------------|
| GET    | /api/users                       | Get all users                             |
| GET    | /api/users/:id                   | Get specific user                         |
| GET    | /api/users/:id/vcard-options     | Get vcard options for specific user       |
| GET    | /api/users/:id/statistics/clicks | Get click statistics for specific user    |
| POST   | /api/users/:id/images            | Upload image for specific user            |
| POST   | /api/users/:id/statistics/clicks | Create click statistics for specific user | 
| PUT    | /api/users/:id/settings/:setting | Update setting for specific user          |
| PUT    | /api/users/:id/vcard-options     | Update vcard options for specific user    |
| DELETE | /api/users                       | Delete specific user                      |

### Themes

| Method | Url                    | Description                      | 
|--------|------------------------|----------------------------------|
| GET    | /api/themes            | Get all themes                   |
| GET    | /api/themes/:id        | Get specific theme               |
| POST   | /api/themes/:id/images | Upload images for specific theme |
| PUT    | /api/themes/:id        | Update specific theme            |

## Steps to setup

**1. Clone the application**

```bash
git clone git@github.com:CardMesh/rest-api.git && cd rest-api
```

**2. Configure your private `.env` file, following the `.env-sample sample`**

**3. Initialize the database**

This will install the program with a lot of test users. To change this, you can modify `./database/ddl.js`.

```bash
npm run db:init
```

**4. Run the app**

```bash
npm run dev # dev
```

```bash
npm run start # prod
```

#### Docker

If you're considering deploying using docker-compose, here's a simple example. Please see `./docker-compose.yml`.

```bash
docker-compose up -d
```

### Roadmap

See the [open issues](https://github.com/CardMesh/rest-api/issues) for a complete list of proposed
features (and known issues).

### Contributing

If you have a suggestion to enhance this project, kindly fork the repository and create a pull request. Alternatively,
you may open an issue and tag it as "enhancement". Lastly, do not hesitate to give the project a star ⭐. Thank you for
your support.

#### Tools

Coding standards checker:

```bash
npm run lint
```

Coding standards fixer:

```bash
npm run format
```

Unit tests:

```bash
npm run test
```

### License

The distribution of the package operates under the `MIT License`. Further information can be found in the LICENSE file.
