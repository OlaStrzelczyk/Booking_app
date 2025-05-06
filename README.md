# Vacation Booking Website

This is a simple vacation booking web application that allows users to search for holiday accommodations in **Alicante**, **Gdańsk**, and **Warsaw**. The user can browse offers, view detailed information on a map, and make reservations which are stored in a MySQL database.

## 🌍 Features

- Search for vacation offers based on:
  - Destination city (Alicante, Gdańsk, Warsaw)
  - Check-in and check-out dates
  - Number of adults and children
  - Number of rooms
- Display available offers with price per night and a short description
- View offer details including location on a map
- Book an offer by filling out a reservation form
- Save reservation details to a MySQL database (via phpMyAdmin)

## 🗃️ Database Structure

The application uses a MySQL database with three main tables:

### `klienci` (clients)
| Field         | Description        |
|---------------|--------------------|
| `id_klienta`  | Unique client ID   |
| `imie`        | First name         |
| `nazwisko`    | Last name          |
| `kraj`        | Country            |
| `nr_telefonu` | Phone number       |

### `oferty` (offers)
| Field              | Description                         |
|--------------------|-------------------------------------|
| `id_oferty`        | Unique offer ID                     |
| `miasto`           | City                                |
| `nazwa_miejsca`    | Name of the vacation place          |
| `max_liczba_osob`  | Maximum number of people allowed    |
| `zdjecie`          | Photo of the place                  |
| `lokalizacja`      | Google Maps location or coordinates |

### `rezerwacje` (reservations)
| Field             | Description            |
|-------------------|------------------------|
| `id_rezerwacji`   | Reservation ID         |
| `id_klienta`      | Link to `klienci`      |
| `id_oferty`       | Link to `oferty`       |
| `data_przyjazdu`  | Check-in date          |
| `data_odjazdu`    | Check-out date         |

## 🧪 How to Run Locally

1. Clone this repository.

2. Make sure you have:

- PHP and a local server (like XAMPP or MAMP)

- MySQL running

- phpMyAdmin access

3. Import the SQL schema into your MySQL via phpMyAdmin.

4. Place the project files inside your web server root directory (e.g. htdocs/ for XAMPP).

5. Open the main page in your browser.

6. Start booking!

## ✅ Technologies Used

- HTML, CSS, JavaScript

- PHP (backend)

- MySQL (database)

- Google Maps API (for location display)

## 📬 Reservation Process

1. User enters search criteria and clicks *Szukaj*.

2. Matching offers appear with pricing and brief details.

3. Clicking Zobacz szczegóły tej oferty shows a map and *Rezerwuj* button.

4. User fills in the reservation form with: Name, Surname, Email, Country, Phone number

5. After clicking  *Potwierdź rezerwację*, a message appears:
✅ "Twoja rezerwacja została zapisana do bazy."

All reservation data is stored in the MySQL database in the corresponding tables.

## 👤 Author

Created by Aleksandra Strzelczyk
