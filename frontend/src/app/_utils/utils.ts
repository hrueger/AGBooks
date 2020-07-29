export function getApiUrl(): string {
    //if (window.location.toString().startsWith("http://localhost:4200")) {
        return "http://localhost:3000/api/";
    //}
    return "/api/";
}
