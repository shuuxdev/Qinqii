export let SERVER_DOMAIN = ""

process.env.NODE_ENV === "development" && (SERVER_DOMAIN = "http://localhost:5000")