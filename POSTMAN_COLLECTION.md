# Postman Collection pour Car Management API

## Variables d'environnement
- `base_url`: http://localhost:8080
- `token`: (sera rempli automatiquement après login)

## 1. Authentication

### Login Admin
```http
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Login User
```http
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "user",
  "password": "user123"
}
```

## 2. Cars CRUD

### Get All Cars
```http
GET {{base_url}}/api/cars
```

### Get Cars by Marque
```http
GET {{base_url}}/api/cars?marque=Toyota
```

### Get Cars by Disponibilité
```http
GET {{base_url}}/api/cars?disponible=true
```

### Get Cars with Filters
```http
GET {{base_url}}/api/cars?marque=Toyota&disponible=true
```

### Get Car by ID
```http
GET {{base_url}}/api/cars/1
```

### Create Car (Authenticated)
```http
POST {{base_url}}/api/cars
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "marque": "Toyota",
  "modele": "Yaris",
  "prix": 20000,
  "carburant": "Essence",
  "imageUrl": "https://example.com/toyota-yaris.jpg",
  "disponible": true,
  "dateMiseEnVente": "2026-02-02"
}
```

### Update Car (Authenticated)
```http
PUT {{base_url}}/api/cars/1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "marque": "Toyota",
  "modele": "Corolla Updated",
  "prix": 26000,
  "carburant": "Hybride",
  "imageUrl": "https://example.com/toyota-corolla-updated.jpg",
  "disponible": true,
  "dateMiseEnVente": "2026-02-02"
}
```

### Delete Car (Authenticated)
```http
DELETE {{base_url}}/api/cars/1
Authorization: Bearer {{token}}
```

## 3. Error Cases

### Get Non-existent Car
```http
GET {{base_url}}/api/cars/9999
```

### Create Car without Auth
```http
POST {{base_url}}/api/cars
Content-Type: application/json

{
  "marque": "Toyota",
  "modele": "Yaris",
  "prix": 20000,
  "carburant": "Essence",
  "disponible": true
}
```

### Create Car with Invalid Data
```http
POST {{base_url}}/api/cars
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "marque": "T",
  "modele": "",
  "prix": -1000,
  "carburant": "InvalidFuel",
  "disponible": true
}
```

## Instructions d'utilisation

1. Importer cette collection dans Postman
2. Créer un environnement avec `base_url = http://localhost:8080`
3. Exécuter la requête Login
4. Copier le token de la réponse dans la variable d'environnement `token`
5. Tester les autres endpoints

## Réponses attendues

### Success (200/201)

```json
{
  "id": 1,
  "marque": "Toyota",
  "modele": "Corolla",
  "prix": 25000,
  "carburant": "Essence",
  "imageUrl": "https://example.com/car.jpg",
  "disponible": true,
  "dateMiseEnVente": "2026-02-02"
}
```

### Error (400/404/401)
```json
{
  "status": 404,
  "message": "Voiture non trouvée avec l'id: 999",
  "timestamp": "2026-02-02T10:30:00",
  "path": "/api/cars/999"
}
```

### Validation Error (400)
```json
{
  "status": 400,
  "message": "Erreur de validation",
  "errors": {
    "marque": "La marque doit contenir entre 2 et 50 caractères",
    "prix": "Le prix doit être positif"
  },
  "timestamp": "2026-02-02T10:30:00",
  "path": "/api/cars"
}
```
