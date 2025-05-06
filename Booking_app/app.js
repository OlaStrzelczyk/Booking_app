// import modułów
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// konfiguracja połączenia z bazą danych
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "booking_app",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Połączono z bazą danych MySQL");
});

// Endpoint: Wyszukiwanie ofert: odbiera dane wyszukiwania post, wykonuje zapytanie sql, wyniki wysyłane jako odp json
app.post("/wyszukaj", (req, res) => {
  const { 
    miasto, 
    data_przyjazdu, 
    data_odjazdu, 
    max_osob_doroslych, 
    cena } = req.body;

  console.log("Wyszukiwanie:", { 
    miasto, 
    data_przyjazdu, 
    data_odjazdu, 
    max_osob_doroslych, 
    cena 
  });

  const query = `
    SELECT * FROM oferty 
    WHERE LOWER(TRIM(miasto)) = LOWER(TRIM(?)) 
    AND id_oferty NOT IN (
      SELECT id_oferty FROM rezerwacje 
      WHERE (
        (data_przyjazdu BETWEEN ? AND ?) OR 
        (data_odjazdu BETWEEN ? AND ?) OR 
        (? BETWEEN data_przyjazdu AND data_odjazdu)
      )
    )
  `;

  db.query(
    query,
    [
      miasto,
      data_przyjazdu,
      data_odjazdu,
      data_przyjazdu,
      data_odjazdu,
      data_przyjazdu,
    ],
    (err, results) => {
      console.log("SQL wyniki:", results);
      if (err) {
        console.error("SQL błąd:", err);
        return res.status(500).json({ error: err });
      }
      res.json(results);
    }
  );
});

// Endpoint: Pobierz szczegóły oferty: odbiera parametr id oferty z URL, wyszukuje ofertę w bazie danych, zwraca szczegóły w formacie json
app.get("/oferty/:id", (req, res) => {
  const query = "SELECT * FROM oferty WHERE id_oferty = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results[0]);
  });
});

// Endpoint: Dodaj rezerwację: odbiera dane rezerwacji, dodaje klienta do tabeli klieni, pobiera id_klienta z bazy, 
// tworzy nową rezerwację w tabeli rezerwacje, wysyła odpowiedź json z potwierdzeniem
app.post("/rezerwacje", (req, res) => {
  const { 
    imie, 
    nazwisko, 
    email, 
    kraj_region, 
    nr_telefonu, 
    id_oferty, 
    data_przyjazdu, 
    data_odjazdu 
  } = req.body;

  console.log("Otrzymane dane rezerwacji:", { 
    imie, 
    nazwisko, 
    email, 
    kraj_region, 
    nr_telefonu, 
    id_oferty, 
    data_przyjazdu, 
    data_odjazdu 
  });

  // dodanie klienta do bazy
  const klientQuery = `
    INSERT INTO klienci (imie, nazwisko, email, kraj_region, nr_telefonu) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(klientQuery, [
    imie, 
    nazwisko, 
    email, 
    kraj_region, 
    nr_telefonu
  ], (err, klientResult) => {
    if (err) {
      console.error("Błąd podczas dodawania klienta:", err);
      return res.status(500).json({ error: "Błąd serwera podczas dodawania klienta" });
    }

    const id_klienta = klientResult.insertId;

    // dodanie rezerwacji do bazy
    const rezerwacjaQuery = `
      INSERT INTO rezerwacje (id_klienta, id_oferty, data_przyjazdu, data_odjazdu) 
      VALUES (?, ?, ?, ?)
    `;

    db.query(rezerwacjaQuery, [
      id_klienta, 
      id_oferty, 
      data_przyjazdu, 
      data_odjazdu
    ], (err, rezerwacjaResult) => {
      if (err) {
        console.error("Błąd podczas dodawania rezerwacji:", err);
        return res.status(500).json({ error: "Błąd serwera podczas dodawania rezerwacji" });
      }

      res.json({ message: "Gratki! Twoja rezerwacja została dodana do bazy!", id_rezerwacji: rezerwacjaResult.insertId });
    });
  });
});

// start serwera
app.listen(3072, () => {
  console.log("Serwer działa na porcie 3072");
});