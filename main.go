package main

import (
    "database/sql"
    "encoding/json"
    "net/http"
    "log"
    "github.com/gorilla/mux"
    _ "github.com/lib/pq"
    "golang.org/x/crypto/bcrypt"
    "fmt"
    "os"
    "io"
)

var db *sql.DB

func main() {
    var err error
    db, err = sql.Open("postgres", "user=postgres dbname=postgres sslmode=disable")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    r := mux.NewRouter()
    r.HandleFunc("/api/register", Register).Methods("POST")
    r.HandleFunc("/api/login", Login).Methods("POST")
    r.HandleFunc("/api/upload", UploadTrack).Methods("POST")
    r.HandleFunc("/api/download/{id}", DownloadTrack).Methods("GET")
    r.HandleFunc("/api/playlists", ManagePlaylists).Methods("GET", "POST", "DELETE")

    fmt.Println("Сервер запущен на http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}

func Register(w http.ResponseWriter, r *http.Request) {
    var user struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    hashedPassword, err := HashPassword(user.Password)
    if err != nil {
        http.Error(w, "Ошибка при хешировании пароля", http.StatusInternalServerError)
        return
    }

    _, err = db.Exec("INSERT INTO users (username, password) VALUES (\\$1, \\$2)", user.Username, hashedPassword)
    if err != nil {
        http.Error(w, "Пользователь уже существует", http.StatusConflict)
        return
    }

    w.WriteHeader(http.StatusCreated)
}

func Login(w http.ResponseWriter, r *http.Request) {
    var user struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }
    if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    var dbUser  struct {
        ID       int
        Password string
    }
    err := db.QueryRow("SELECT id, password FROM users WHERE username=\\$1", user.Username).Scan(&dbUser .ID, &dbUser .Password)
    if err != nil || !CheckPasswordHash(user.Password, dbUser .Password) {
        http.Error(w, "Неверные учетные данные", http.StatusUnauthorized)
        return
    }

    w.WriteHeader(http.StatusOK)
}

func UploadTrack(w http.ResponseWriter, r *http.Request) {
    err := r.ParseMultipartForm(10 << 20) // Ограничение на размер загрузки 10 МБ
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    file, _, err := r.FormFile("track")
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    defer file.Close()

    // Создание директории, если она не существует
    os.MkdirAll("uploads", os.ModePerm)

    filePath := fmt.Sprintf("uploads/%s", "your_filename.mp3") // Реализуйте обработку имени файла
    out, err := os.Create(filePath)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer out.Close()
    io.Copy(out, file)

    userID := 1 // Замените на фактический ID пользователя из сессии
    title := "Track Title" // Замените на факальное название трека
    _, err = db.Exec("INSERT INTO tracks (user_id, title, file_path) VALUES (\\$1, \\$2, \\$3)", userID, title, filePath)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusCreated)
}

func DownloadTrack(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    trackID := vars["id"]

    var filePath string
    err := db.QueryRow("SELECT file_path FROM tracks WHERE id=\\$1", trackID).Scan(&filePath)
    if err != nil {
        http.Error(w, "Трек не найден", http.StatusNotFound)
        return
    }

    http.ServeFile(w, r, filePath)
}

func ManagePlaylists(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case "GET":
        // Логика для получения плейлистов
        http.Error(w, "Метод не реализован", http.StatusNotImplemented)
    case "POST":
        // Логика для создания нового плейлиста
        http.Error(w, "Метод не реализован", http.StatusNotImplemented)
    case "DELETE":
        // Логика для удаления плейлиста
        http.Error(w, "Метод не реализован", http.StatusNotImplemented)
    }
}

func HashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

func apiHandler(w http.ResponseWriter, _ *http.Request) {
    fmt.Fprintln(w, "API работает!")
}
