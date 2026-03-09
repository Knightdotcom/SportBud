namespace SportBud.Api.Core.Services
{
    // Generisk resultatklass som används för att hantera lyckade och misslyckade operationer
    // Används av alla services för att returnera antingen data eller ett felmeddelande
    public class Result<T>
    {
        // Anger om operationen lyckades eller misslyckades
        public bool IsSucces { get; private set; }

        // Felmeddelande som sätts om operationen misslyckades
        public string? Error { get; private set; }

        // Datat som returneras vid en lyckad operation
        public T? Data { get; private set; }

        // Privat konstruktor - instanser skapas via Ok() eller Fail()
        private Result() { }

        // Skapar ett lyckat resultat med tillhörande data
        public static Result<T> Ok(T data)
        {
            return new Result<T> { IsSucces = true, Data = data };
        }

        // Skapar ett misslyckat resultat med ett felmeddelande
        public static Result<T> Fail(string error)
        {
            return new Result<T> { IsSucces = false, Error = error };
        }
    }
}
