<h1 align="center">Restful CRUD API for CardMesh</h1>

[![CI status](https://github.com/CardMesh/rest-api/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/CardMesh/rest-api/actions/workflows/ci.yml)
[![Contributors](https://img.shields.io/github/contributors/CardMesh/rest-api.svg)](https://github.com/CardMesh/rest-api/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/CardMesh/rest-api.svg)](https://github.com/CardMesh/rest-api/network/members)
[![Stargazers](https://img.shields.io/github/stars/CardMesh/rest-api.svg)](https://github.com/CardMesh/rest-api/stargazers)
[![Issues](https://img.shields.io/github/issues/CardMesh/rest-api.svg)](https://github.com/CardMesh/rest-api/issues)
[![MIT License](https://img.shields.io/github/license/CardMesh/rest-api.svg)](https://github.com/CardMesh/rest-api/blob/main/LICENSE)

CardMesh is an app aimed at modernizing the sharing of business cards within a company. It displays digital business
cards in a web browser, accessible via NFC tags, QR codes, or direct URLs.

### Tech Stack

[![Node.Js](https://img.shields.io/badge/Node.js-339933.svg?style=flat&logo=nodedotjs&logoColor=white)](#)
[![Express](https://img.shields.io/badge/Express-000?logo=express&logoColor=fff&style=flat)](#)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff&style=flat)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff&style=flat)](#)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](#)

### Versions & Dependencies

| Version | Documentation |
|---------|---------------|
| 1.0.4   | current       |

### Requirements

- `Node.js` >= 18.x

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
| GET    | /api/users/:id/vcf               | Get vcf file for specific user            |
| GET    | /api/users/:id/vcards            | Get vcard options for specific user       |
| GET    | /api/users/:id/statistics/clicks | Get click statistics for specific user    |
| POST   | /api/users/:id/images            | Upload image for specific user            |
| POST   | /api/users/:id/statistics/clicks | Create click statistics for specific user | 
| PUT    | /api/users/:id/settings/:setting | Update setting for specific user          |
| PUT    | /api/users/:id/vcards            | Update vcard options for specific user    |
| DELETE | /api/users/:id                   | Delete specific user                      |

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

**2. Configure your private `.env` file, following the `.env.example` sample**

**3. Initialize the database**

This will install the program with a lot of test users. To change this, you can modify `./src/data/ddl.js`.

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

![db.png](docs%2Fimg%2Fdb.png)

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

### DISCLAIMER: USE OF THIS GITHUB REPOSITORY

By accessing and using this GitHub repository ("Repository"), you agree to the following terms and conditions. If you do
not agree with any of these terms, please refrain from using the Repository.

1) No Warranty or Liability:
   The Repository is provided on an "as is" basis, without any warranties or representations of any kind, either
   expressed or implied. The owner(s) of the Repository ("Owner") hereby disclaim(s) any and all liability for any
   damages, losses, or injuries arising out of or in connection with the use, inability to use, or reliance on the
   Repository.

2) No Legal Advice:
   The content and information provided in the Repository are for informational purposes only and do not constitute
   legal advice. The Owner does not assume any responsibility for any actions taken or not taken based on the
   information provided in the Repository. For legal advice or specific inquiries, consult a qualified legal
   professional.

3) Intellectual Property:
   The Repository may contain copyrighted materials, including but not limited to code, documentation, images, and other
   intellectual property owned by the Owner or third parties. You may not use, copy, distribute, or modify any such
   materials without obtaining prior written permission from the respective copyright holder(s).

4) External Links:
   The Repository may include links to third-party websites or resources. The Owner does not endorse, control, or assume
   any responsibility for the content or practices of these third-party websites or resources. Accessing and using such
   links are solely at your own risk.

5) Modification of Repository:
   The Owner reserves the right to modify, update, or remove any content or functionality of the Repository at any time
   without prior notice. The Owner shall not be liable for any consequences arising from such modifications.

6) Indemnification:
   You agree to indemnify and hold the Owner harmless from and against any claims, damages, liabilities, costs, and
   expenses arising out of or in connection with your use of the Repository, including but not limited to any violation
   of these terms.

7) Governing Law:
   These terms shall be governed by and construed in accordance with the laws of the jurisdiction where the Owner is
   located, without regard to its conflict of law principles.

By using the Repository, you acknowledge that you have read, understood, and agreed to these terms and conditions. If
you do not agree with any of these terms, your sole remedy is to discontinue using the Repository.
