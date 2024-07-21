const express = require("express");
const pg = require("pg");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const cors = require("cors");

dotenv.config();

const app = express();
const port = 3000;

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUGXEn9NIT07BwjUlKjVTsmxVzdFwwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZTY2NGY4ZTUtZTNlZS00N2EzLWI4YTAtNWJkM2Q4MTkz
MzBiIFByb2plY3QgQ0EwHhcNMjQwNzIwMDQwMTA0WhcNMzQwNzE4MDQwMTA0WjA6
MTgwNgYDVQQDDC9lNjY0ZjhlNS1lM2VlLTQ3YTMtYjhhMC01YmQzZDgxOTMzMGIg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANgOhTAp
zLx+aHLV5Si9QFayiwj7zy8Wa6DwNnOwC8JnhxirqjSdlm4IVoseIg63VLKgzoTR
goQgDlkwE49NNwvFwzsA4m2mk/1lbBuK4TQQWPFwtZPbcb4igwFhX5Sc3yHteSHp
10BgxPzokzRAZTBZI2oJVIf8tniMnsk0Z1JGzzkPxIOujHHyYP3sEgKbtzl51vN/
i4pzinqroSrG61ORljLHt/pqMMrITyfGwWPLNIk6GapiZ0WIbHYhe8ZNxfnd0TDB
H3sybDox7hNSAoD+MZZ1lrdGnWpaWflmYbNpPLuZYKN+Z+FA4s1mgUC+H3O6esUo
gTl892P7wD0o7t1Z1gvJEWbIZW79GD0tU/9CP6vfhLbsd12QM7pUYBh7K0/FR6ed
lM4NHJgtYZEC0kUtgWP8ZN2qr4e2pzzSmxweYjzok+0fIDtCC3f+l+pYV639IXxj
KKTsIYeLhWDE4V7gH+lNP8q5kEejcGrsKsKPrqULNixnEwa2Yec7VwURZwIDAQAB
oz8wPTAdBgNVHQ4EFgQUc4043e1b3l8BCUckmv2zp4UO3RQwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAGwbJtq9bu/ybaTo
V9CEB6ZvOsHQNl2+Z2Fals9mIYj2h/nATtxs3Jqk8ATPXj1KJdMdrqoYKeyzH0xg
w5dAoaOAtX4zZdSFutm80mkWLRMT5Y84RQW87D1mYCPWAAZKwt+6MZjIepp/TQ+W
BvwzK+35J3hkPTHSvKE/3KiXvj0a4EH0/j7uXnXqFKbLFEbfJe1L5BGK1I4rpIZa
KBygU4OGDIS2EegfVmDxnt2qPcyJLcurm4ASU9yO5YEauX0G+CwQCjLxiKIqPOAv
fmWFu1kAfvQa2HDaWc2K6EYs29yoUkChndj1AZj6fmUBCrTBvjj6U2dKc31wnVhx
QVYZo+lwN9tPgzwn/Mh7dFzUgQPboktmZ0zhxK2HN2fEpWtHRCniKkL7iJoPGLdK
gi143UU8Mse+lNwcGZ/hI6WMnn+6uKGcE0PWjonInVmF9Z1vNVLXzJlusXMBfECt
FULhUbNiWNB7bgY2/esnCo3AVbMuIbdMrMl2lihhoiZ/z2h6Zw==
-----END CERTIFICATE-----
`,
  },
};

const client = new pg.Client(config);
const jwtSecret = process.env.JWT_SECRET;

client.connect((err) => {
  if (err) {
    console.error("Connection error", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

app.use(express.json());
app.use(cors());

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("Token não fornecido!");
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(500).send("Falha ao autenticar o token.");
    }

    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  });
};

app.post("/register", async (req, res) => {
  const { username, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return res.status(400).send("As senhas não conferem!");
  }

  try {
    const userCheckQuery = "SELECT * FROM users WHERE username = $1";
    const userCheckResult = await client.query(userCheckQuery, [username]);

    if (userCheckResult.rows.length > 0) {
      return res.status(400).send("Usuário já cadastrado!");
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha

    const insertUserQuery =
      "INSERT INTO users (username, password) VALUES ($1, $2)";
    await client.query(insertUserQuery, [username, hashedPassword]);

    res.status(201).send("Usuário registrado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

app.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userQuery = "SELECT * FROM users WHERE username = $1";
    const userResult = await client.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      return res.status(400).send("Usuário ou senha incorretos!");
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).send("Usuário ou senha incorretos!");
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      jwtSecret,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

app.delete("/delete", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const deleteUserQuery = "DELETE FROM users WHERE id = $1";
    await client.query(deleteUserQuery, [userId]);

    res.status(200).send("Usuário deletado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

app.post("/update", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { username, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return res.status(400).send("As senhas não conferem!");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash da senha

    const updateUserQuery =
      "UPDATE users SET username = $1, password = $2 WHERE id = $3";
    await client.query(updateUserQuery, [username, hashedPassword, userId]);

    res.status(200).send("Usuário atualizado com sucesso!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no servidor");
  }
});

app.get("/beers", verifyToken, async (req, res) => {
  try {
    const { page, per_page } = req.query;
    const response = await axios.get(
      `https://api.openbrewerydb.org/v1/breweries?page=${page}&per_page=${per_page}`
    );
    var data = response.data;
    const responseTotal = await axios.get(
      `https://api.openbrewerydb.org/v1/breweries/meta`
    );
    const total = responseTotal.data.total;
    res.json({ data, total });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar dados da API externa");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
