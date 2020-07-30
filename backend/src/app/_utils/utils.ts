export function getApiUrl(): string {
    if (window.location.toString().startsWith("http://localhost")) {
        return "http://localhost:3000/api/";
    }
    return "/api/";
}
